'use strict';

(function() {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id/user';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
      if (data[0] !== "<") {
         var userObject = JSON.parse(data);
         $('#display-name').text(userObject.name);
         $('#profile-name').text(userObject.name);
      }
   }));
   
   var apiUrl2 = appUrl +'/api/:id/polls';
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl2, function(data) {
      if (data[0] !== "<") {
         var userObject = JSON.parse(data);
         $('#profile-polls').text(userObject.length);
      }
   }));
   
   $('.delete-user').click(function() {
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', apiUrl, function(data) {
            location.reload();
      }));
   });
})();
