function OnResize() {
  var height = document.querySelector('header').clientHeight;
  document.querySelector('.wrapper').style.marginTop = height + 'px';
}

window.onresize = function () {
  OnResize();
}

window.onload = function () {
  OnResize();
}