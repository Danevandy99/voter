'use strict';

(function() {
   var pollUrl = appUrl + '/api/:id/polls';

   function cleanArray(actual) {
      var newArray = new Array();
      for (var i = 0; i < actual.length; i++) {
         if (actual[i]) {
            newArray.push(actual[i]);
         }
      }
      return newArray;
   }

   $('.more-options').click(function() {
      var li = document.createElement('li');
      var input = document.createElement('input');
      input.className = 'option';
      li.appendChild(input);
      $('.options-list').append(li);
   })

   $('.submit').click(function() {
      if ($('.name').val() === "") {
         alert("Please Name Your Poll!");
      }
      else {
         var length = cleanArray($('.option').map(function() {
            return $(this).val();
         }).get()).length;
         if (length <= 1) {
            alert("Please add at Least Two Options!");
         }
         else {
            var url = appUrl + '/api/:id/polls';
            $.ajax({
               type: "POST",
               url: url,
               data: {
                  name: $('.name').val(),
                  options: cleanArray($('.option').map(function() {
                     return $(this).val();
                  }).get())
               },
               dataType: "json",
               jsonCallback: "_testcb",
               cache: false,
               timeout: 5000,
               success: function(data) {
                  $('.options-list li input').val('');
                  $('.new-poll').css('display', 'none');
                  $('.view-poll').css('display', 'block');
                  $('.view-poll a').attr('href', appUrl + '/view?query=' + data._id);
               },
               error: function(jqXHR, textStatus, errorThrown) {
                  alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
               }
            });
         }
      }
   })

   $('.yourbtn').click(function() {
      $('.your-polls').css("display", "block");
      $('.new-poll').css("display", "none");
      $('.view-poll').css('display', 'none');
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, function(data) {
         data = JSON.parse(data);
         $('.your-polls-list').empty();
         for (var i = 0; i < data.length; i++) {
            var object = data[i];
            var li = document.createElement('li');
            var p = document.createElement('p');
            var button = document.createElement('button');
            p.innerHTML = object.name;
            button.className = "btn delete-btn";
            button.setAttribute('id', i);
            button.innerHTML = "DELETE";
            button.addEventListener('click', function(e) {
               var id = $(this).attr('id');
               var url = appUrl + '/api/:id/polls';
               $.ajax({
                  type: "DELETE",
                  url: url,
                  data: {
                     id: data[id]._id
                  },
                  dataType: "json",
                  jsonCallback: "_testcb",
                  cache: false,
                  timeout: 5000,
                  success: function(string) {
                     $('.yourbtn').trigger('click');
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                     alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
                  }
               });
               e.stopPropagation();
            });
            li.appendChild(p);
            li.appendChild(button);
            li.setAttribute('id', i);
            li.addEventListener('click', function(e) {
               window.location.href = 'https://voter-danevandy99.c9users.io/view?query=' + data[$(this).attr('id')]._id;
            });
            $('.your-polls-list').append(li);
         }
      }));
   })

   $('.newbtn').click(function() {
      $('.new-poll').css('display', 'block');
      $('.your-polls').css('display', 'none');
      $('.view-poll').css('display', 'none');
      $('input').val('');
   });
   
   
})();
