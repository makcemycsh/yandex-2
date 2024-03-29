$(document).ready(function () {

  const circle = $(".js-circle");
  const maxVal = circle.attr('data-max');
  const minVal = circle.attr('data-min');
  const circleGray = $(".js-circle-rotate");
  const circleGrayStart = parseFloat($(".js-circle-rotate").attr('data-start'));
  const circleGrayEnd = parseFloat($(".js-circle-rotate").attr('data-end'));

  const circleRotate = function (curVal) {
    curVal = parseFloat(curVal);

    minVal <= curVal && curVal <= maxVal ? '' : maxVal <= curVal ? curVal = maxVal : curVal = minVal;
    let rotateDeg = (curVal - minVal) / (maxVal - minVal) * (495 - 225) + 225;
    let rotatePx = circleGrayStart + (curVal - minVal) / (maxVal - minVal) * (circleGrayEnd - circleGrayStart);

    $(".js-circle-dot").css("transform", "rotate(" + rotateDeg + "deg)");
    $(".js-circle-rotate").css("stroke-dasharray", rotatePx + 'px');

    $(".js-circle-val").attr('data-val', curVal > 0 ? "+" + curVal : curVal)
  };
  const circleInit = (function () {
    let is_dragging;
    is_dragging = false;

    let curVal = parseFloat($(".js-circle-val").attr('data-val'));
    circleRotate(curVal);
    let angle = (maxVal - curVal) / (maxVal - minVal) * (495 - 225);

    $(document).on("mousedown touchstart", ".b-circle", function (e) {
      return is_dragging = true;
    });
    $(document).on("mouseup touchend", function (e) {
      return is_dragging = false;
    });
    return $(window).on("mousemove touchmove", function (e) {
      let center_x, center_y, delta_x, delta_y, pos_x, pos_y, touch;
      if (is_dragging) {
        touch = void 0;
        if (e.originalEvent.touches) {
          touch = e.originalEvent.touches[0];
        }
        center_x = ($(circle).outerWidth() / 2) + $(circle).offset().left;
        center_y = ($(circle).outerHeight() / 2) + $(circle).offset().top;
        pos_x = e.pageX || touch.pageX;
        pos_y = e.pageY || touch.pageY;
        delta_y = center_y - pos_y;
        delta_x = center_x - pos_x;
        angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI);
        angle -= 90;
        if (angle < 0) {
          angle = 360 + angle;
        }
        angle < 180 && angle > 0 ? angle = angle + 360 : "";
        angle < 540 && angle > 495 ? angle = 495 : angle > 180 && angle < 225 ? angle = 225 : "";

        curVal = ((angle - 225) / (495 - 225)) * (maxVal - minVal) + parseFloat(minVal);
        curVal = Math.round(curVal);

        return circleRotate(curVal);
        ;
      }
    });
  }).call(this);


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

  //Если табов мало, то скрываем стрелки навигации
  let div = $('.js-tabs'),
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
  const showArrow = function (div, item, arrows) {
    let div_sw = $(div)[0].scrollWidth;
    let div_w = div.outerWidth(true);
    div_sw - div_w <= item.outerWidth(true) ? arrows.hide() : arrows.show();
    div.trigger('scroll');
  };

  //Скролл при нажатии на кнопку
  const scrollArrow = function (scrollWrap) {
    let div = $('.' + scrollWrap.attr('data-scroll')),
      div_sw = $(div)[0].scrollWidth,
      div_w = div.outerWidth(true);
    let item = $('.b-tab:first', div);
    showArrow(div, item, scrollWrap);

    //Дизейбл кнопки, если некуда скроллить
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
  for (let i = 0; i < $('.js-arrows').length; i++) {
    scrollArrow($('.js-arrows:eq(' + i + ')'));
  }

  //Выбор категории
  $('.js-cat').children().on('click', function () {
    if (!$(this).hasClass('is-active')) {
      let cat = $(this).attr('data-cat');
      $('.js-cat-items > :not([data-cat=' + cat + '])').hide();
      $('.js-cat-items > [data-cat=' + cat + ']').show();
      !cat && $(".js-cat-items > [data-cat]").show();
      for (let i = 0; i < $('.js-arrows').length; i++) {
        let div = $('.' + $('.js-arrows:eq(' + i + ')').attr('data-scroll'));
        showArrow(
          div,
          $('.b-tab:first', div),
          $('.js-arrows:eq(' + i + ')')
        );
      }
    }
  });

  // Активация выпадающего списка с категориями на мобильной версии
  $('.js-cat').on('click', function () {
    $(this).toggleClass('is-active-mob');
  });

  // Открывает попап при клике на таб
  $('.js-tabs').on('click', '.js-popup-open', function () {
    $(this).addClass('is-popup');
    let param = {
      'popupClass': $('.' + $(this).attr('data-popup-class')),
      'title': $('[data-title]', this).attr('data-title'),
      'status': $('[data-status]', this).attr('data-status'),
      'val': $(this).attr('data-val'),
      'active': $('[data-active]', this).attr('data-active')
    };

    $('[data-title]', param.popupClass).attr('data-title', param.title);
    $('[data-val]', param.popupClass).attr('data-val', param.val);
    $('[data-status]', param.popupClass).attr('data-status', param.status);
    $('[data-active]', param.popupClass).attr('data-active', param.active);

    $('.b-page').toggleClass('is-fixed');
    $('.b-popup').removeClass('is-open');

    circleRotate(param.val);
    param.popupClass.addClass('is-open');
  });

  // Закрытие попапа
  $('.js-popup-close').on('click', function () {
    $('.b-popup').removeClass('is-open');
    $('.b-page').removeClass('is-fixed');
  });

  //Смена состояния активности
  $('.js-change-active').children().on('click', function () {
    if (!$(this).hasClass('is-active')) {
      $(this).parent().children().removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

});

