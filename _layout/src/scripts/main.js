$(document).ready(function () {

  // Фиксация хедера при скролле
  $(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
      $('body').addClass('head-is-fixed');
      $('.head-is-fixed').css('margin-top', $('.js-head').outerHeight(true));
    } else {
      $('.head-is-fixed').css('margin-top', 0);
      $('body').removeClass('head-is-fixed');
    }
  });

  //Выпадающее меню
  $('.js-menu-bar').on('click', function () {
    $(this).toggleClass('is-active');
  });

  var div = $('.js-tabs'),
    div_sh = $(div)[0].scrollHeight,
    div_h = div.height();
  $(div).scroll(function () {
    if ($(this).scrollTop() >= div_sh - div_h) {
      $('.js-arrow-show').removeClass('is-show');
    } else {
      $('.js-arrow-show').addClass('is-show');
    }
  });
  $(div).trigger('scroll');

  //Кнопки для постраничного листания
  var showArrow = function (div, item, arrows) {
    var div_sw = $(div)[0].scrollWidth;
    var div_w = div.outerWidth(true);
    div_sw - div_w <= item.outerWidth(true) ? arrows.hide() : arrows.show();
  };

  var scrollArrow = function (scrollWrap) {
    var div = $('.' + scrollWrap.attr('data-scroll')),
      div_sw = $(div)[0].scrollWidth,
      div_w = div.outerWidth(true);
    var item = $('.b-tab:first', div);
    showArrow(div, item, scrollWrap);

    div.scroll(function () {
      div_sw = $(this)[0].scrollWidth;
      div_w = $(this).outerWidth(true);
      $(this).scrollLeft() < item.outerWidth(true) * 0.1 ?
        $('.js-arrow-l', scrollWrap).addClass('mod-disabled')
        : $('.js-arrow-l', scrollWrap).removeClass('mod-disabled');
      div_sw - div.scrollLeft() - div_w < item.outerWidth(true) * 0.1 ?
        $('.js-arrow-r', scrollWrap).addClass('mod-disabled')
        : $('.js-arrow-r', scrollWrap).removeClass('mod-disabled');
    });

    $('.js-arrow-l', scrollWrap).on('click', function () {
      div.animate({scrollLeft: '-=' + item.outerWidth(true)}, 150);
    });
    $('.js-arrow-r', scrollWrap).on('click', function () {
      div.animate({scrollLeft: '+=' + item.outerWidth(true)}, 150);
    });
    div.trigger('scroll');
  };
  for (var i = 0; i < $('.js-arrows').length; i++) {
    scrollArrow($('.js-arrows:eq(' + i + ')'));
  }

  //Выбор категории
  $('.js-cat').children().on('click', function () {
    if (!$(this).hasClass('is-active')) {
      var cat = $(this).attr('data-cat');
      $('.js-cat').children().removeClass('is-active');
      $(this).addClass('is-active');
      $('.js-cat-items > :not([data-cat=' + cat + '])').hide();
      $('.js-cat-items > [data-cat=' + cat + ']').show();
      !cat && $(".js-cat-items > [data-cat]").show();
      for (var i = 0; i < $('.js-arrows').length; i++) {
       var div = $('.' + $('.js-arrows:eq(' + i + ')').attr('data-scroll'));
        showArrow(
          div,
          $('.b-tab:first', div),
          $('.js-arrows:eq(' + i + ')')
        );
      }
    }
  });
  $('.js-cat').on('click', function () {
    $(this).toggleClass('is-active-mob');
  });

  //Горизонтальный скролл
  $(window).resize(function () {
    if ($(window).width() < 767) {
      $('.js-scroll').unmousewheel();
      $('.js-scroll').on('mousewheel', function (e) {
        this.scrollLeft -= (e.deltaY * 40);
        e.preventDefault();
      });
    } else {
      $('.js-scroll').unmousewheel();
    }
  });
});