function OnResize() {
  var top = document.querySelector('header').clientHeight;
//  var bottom = document.querySelector('footer').clientHeight;
  content = document.querySelector('.content_wrapper');
  content.style.marginTop = top + 'px';
//  content.style.marginBottom = bottom + 'px';
}

window.onresize = function () {
  OnResize();
}

window.onload = function () {
  OnResize();
}