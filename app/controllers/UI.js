$(document).ready(function() {
   $('.trigger').click(function() {
     $('.one').toggleClass('open');
    $('.page-wrapper').toggleClass('blur');
     return false;
  }); 
  $('.login-direct').click(function() {
      $('.one').removeClass('open');
     $('.two').toggleClass('open');
     $('.trigger2').click(function() {
        $('.two').removeClass('open');
        $('.one').addClass('open');
     });
     return false;
  });
});