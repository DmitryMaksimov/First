function OnResize() {
  /* Берем наше верхнее меню */
  var header = document.querySelector('header');
  /* Получаем размер верхнего меню */
  var margin_top = header.clientHeight;

  /* Делаем пустой отступ сверху для контента */
  content = document.querySelector('.content_wrapper');
  content.style.marginTop = margin_top + 'px';
  
  /* При скрулинге вправо/влево надо двигать меню тоже */
  /* Вычисляем размер сдвига по оси x */
  var offset_left = document.documentElement.scrollLeft || document.body.scrollLeft;
  /* Сдвигаем наше верхнее меню */
  header.style.left = -offset_left + 'px';
//  content.style.marginBottom = bottom + 'px';
}

window.onscroll = function() {
  OnResize();
}

window.onresize = function () {
  OnResize();
}

window.onload = function () {
  OnResize();
}