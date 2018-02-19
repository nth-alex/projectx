$(document).ready(function() {
  $('body').removeClass('preload');
  svg4everybody();

  // $('.ddddddd').slick({
  //   prevArrow: prevArrow(),
  //   nextArrow: nextArrow()
  // });

  $('.hamburger').on('click', function() {
    $(this).toggleClass('is-active');
  });
});
