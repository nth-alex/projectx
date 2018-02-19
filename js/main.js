function slick_prev(name) {
  if (name) {
    return (
      '<button type="button" class="slick-prev"><svg class="svg-icon ' +
      name +
      '"><use xlink:href="img/sprite.svg#' +
      name +
      '"></use></svg></button>'
    );
  } else {
    return '<button type="button" class="slick-prev"></button>';
  }
}

function slick_next(name) {
  if (name) {
    return (
      '<button type="button" class="slick-next"><svg class="svg-icon ' +
      name +
      '"><use xlink:href="img/sprite.svg#' +
      name +
      '"></use></svg></button>'
    );
  } else {
    return '<button type="button" class="slick-next"></button>';
  }
}

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

//# sourceMappingURL=main.js.map
