// Jquert scripts

$(document).ready(function () {

   // Slider
   $('.carousel__inner').slick({
      dots: false,
      speed: 1200,
      autoplay: true,
      autoplaySpeed: 2000,
      adaptiveHeight: false,
      prevArrow: '<button type="button" class="slick-prev"><img src="img/carousel-arrow-left.png" alt=""></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="img/carousel-arrow-right.png" alt=""></button>',
      responsive: [
         {
            breakpoint: 900,
            settings: {
               arrows: false,
               dots: true,
               dotsClass: 'carousel-dots',
            }
         },
      ]
   });


   // Скрипт для работы с Табами
   $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab--active)', function () {
      $(this)
         .addClass('catalog__tab--active').siblings().removeClass('catalog__tab--active')
         .closest('div.container').find('ul.catalog__content').removeClass('catalog__content--active').eq($(this).index()).addClass('catalog__content--active');
   });

   // Скрипт для отображения описания товара в карточках

   $('.catalog-item__link-details').each(function(i) {
      $(this).on('click', function(e) {
         e.preventDefault();
         $('.catalog-item__list').eq(i).toggleClass('catalog-item__list--active');
      })
   });

   $('.catalog-item__link-back').each(function(i) {
      $(this).on('click', function(e) {
         e.preventDefault();
         $('.catalog-item__list').eq(i).removeClass('catalog-item__list--active');
      })
   });

});