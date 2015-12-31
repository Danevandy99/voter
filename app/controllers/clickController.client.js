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
                  alert(JSON.stringify(data));
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
            button.addEventListener('click', function() {
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
                     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, function(data) {
                        $('.yourbtn').trigger('click');
                     }));
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                     alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
                  }
               });
            });
            li.appendChild(p);
            li.appendChild(button);
            $('.your-polls-list').append(li);
         }
      }));
   })

   $('.newbtn').click(function() {
      $('.new-poll').css('display', 'block');
      $('.your-polls').css('display', 'none');
      $('input').val('');
   })


   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';

   function updateClickCount(data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function() {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function() {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
