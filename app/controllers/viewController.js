(function() {
    $(document).ready(function() {
        var pollUrlView = appUrl + '/api/:id/view/polls?query=' + window.location.href.split('=')[1];
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrlView, function(d) {
            var data2 = JSON.parse(d);
            $('#title').text(data2.name);
            for (var i = 0; i < data2.options.length; i++) {
                var li = document.createElement('li');
                var p = document.createElement('p');
                p.innerHTML = data2.options[i].name;
                li.appendChild(p);
                li.addEventListener('click', function() {
                    $('li').removeClass('active');
                    $('li p').css('color', '#00bcd4');
                    $(this).addClass('active');
                    $('.active p').css('color', 'white');
                })
                li.setAttribute('id', i);
                $('.vote-list').append(li);
            }
            $('.vote-btn').click(function() {
                if ($('.active').attr('id') === undefined) {
                    alert("Please Choose One of the Options!");
                }
                else {
                    var url = appUrl + '/api/:id/view/polls?query=' + window.location.href.split('=')[1];
                    var string = $('.active p').text();
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            option: string
                        },
                        dataType: "json",
                        jsonCallback: "_testcb",
                        cache: false,
                        timeout: 5000,
                        success: function() {
                            var pollUrlView = appUrl + '/api/:id/view/polls?query=' + window.location.href.split('=')[1];
                            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrlView, function(d) {
                                d = JSON.parse(d);
                                $('.vote-container').css('display', 'none');
                                $('.chart-container').css('display', 'block');
                                
                                for (var i = 0; i < d.options.length; i++) {
                                    var li = document.createElement('li');
                                    var em = document.createElement('em');
                                    var span = document.createElement('span');
                                    em.innerHTML = d.options[i].name;
                                    span.innerHTML = d.options[i].votes;
                                    li.appendChild(em);
                                    li.appendChild(span);
                                    $('.legend').append(li);
                                }

                                function sliceSize(dataNum, dataTotal) {
                                    return (dataNum / dataTotal) * 360;
                                }

                                function addSlice(sliceSize, pieElement, offset, sliceID, color) {
                                    $(pieElement).append("<div class='slice " + sliceID + "'><span></span></div>");
                                    var offset = offset - 1;
                                    var sizeRotation = -179 + sliceSize;
                                    $("." + sliceID).css({
                                        "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
                                    });
                                    $("." + sliceID + " span").css({
                                        "transform": "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
                                        "background-color": color
                                    });
                                }

                                function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
                                    var sliceID = "s" + dataCount + "-" + sliceCount;
                                    var maxSize = 179;
                                    if (sliceSize <= maxSize) {
                                        addSlice(sliceSize, pieElement, offset, sliceID, color);
                                    }
                                    else {
                                        addSlice(maxSize, pieElement, offset, sliceID, color);
                                        iterateSlices(sliceSize - maxSize, pieElement, offset + maxSize, dataCount, sliceCount + 1, color);
                                    }
                                }

                                function createPie(dataElement, pieElement) {
                                    var listData = [];
                                    $(dataElement + " span").each(function() {
                                        listData.push(Number($(this).html()));
                                    });
                                    var listTotal = 0;
                                    for (var i = 0; i < listData.length; i++) {
                                        listTotal += listData[i];
                                    }
                                    var offset = 0;
                                    var color = [
                                        "#00bcd4",
                                        "#ffaa01",
                                        "#ff4538",
                                        "forestgreen",
                                        "purple",
                                        "turquoise",
                                        "navy",
                                        "crimson",
                                        "cornflowerblue",
                                        "olivedrab",
                                        "orange",
                                        "tomato",
                                        "gray"
                                    ];
                                    for (var i = 0; i < listData.length; i++) {
                                        var size = sliceSize(listData[i], listTotal);
                                        iterateSlices(size, pieElement, offset, i, 0, color[i]);
                                        $(dataElement + " li:nth-child(" + (i + 1) + ")").css("border-color", color[i]);
                                        offset += size;
                                    }
                                }
                                createPie(".pieID.legend", ".pieID.pie");
                            }));
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
                        }
                    });
                }
            });
        }));
    })
})();