function OnResize() {
  /* Берем наш content */
  var content = document.querySelector('main');
  /* Берем наше верхнее меню */
  var header_wrapper = document.querySelector('.menu__wrapper');


  var header = document.querySelector('header');
  header.style.width = content.clientWidth + 'px';

  /* Получаем размер верхнего меню */
  var margin_top = header_wrapper.clientHeight;

  /* Делаем пустой отступ сверху для контента */
  content.style.marginTop = margin_top + 'px';
  
  document.querySelector('header').height = margin_top + 'px';

  /* При скрулинге вправо/влево надо двигать меню тоже */
  /* Вычисляем размер сдвига по оси x */
  var offset_left = document.documentElement.scrollLeft || document.body.scrollLeft;
  /* Сдвигаем наше верхнее меню */
  header.style.left = (-offset_left) + 'px';
//  content.style.marginBottom = bottom + 'px';
}

window.onscroll = function() {
  OnResize();
}

window.onresize = function () {
  OnResize();
}

window.addEventListener('load', OnResize);
 