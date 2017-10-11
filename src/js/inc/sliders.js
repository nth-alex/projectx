var slick = require('slick-carousel');

module.exports = function ($) {

  function prevArrow(name) {
    if (name) {
      return '<button type="button" class="slick-prev"><svg class="svg-icon '+name+'"><use xlink:href="img/sprite.svg#'+name+'"></use></svg></button>';
    } else {
      return '<button type="button" class="slick-prev"></button>';
    }
  }

  function nextArrow(name) {
    if (name) {
      return '<button type="button" class="slick-next"><svg class="svg-icon '+name+'"><use xlink:href="img/sprite.svg#'+name+'"></use></svg></button>';
    } else {
      return '<button type="button" class="slick-next"></button>';
    }
  }

  // $('.ddddddd').slick({
  //   prevArrow: prevArrow(),
  //   nextArrow: nextArrow()
  // });
}
