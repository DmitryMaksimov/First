
/* auto close */
function list_view__onmousedown_document(event) {
  var e = document.elementFromPoint(event.clientX, event.clientY);
  do {
    if(e.className.indexOf('list_view__popup_container') >= 0)
      return;
  } while(e = e.parentElement);
  var arr = document.querySelectorAll('.list_view__popup_container');
  for( var i=0; i<arr.length; i++)
    arr[i].style.visibility = 'hidden';
}

window.list_view__update_caption = function(element) {
  var caption = element.querySelector('.list_view__caption');
  caption.innerText = "";
}

window.addEventListener('load', function () {
  var arr = document.querySelectorAll(".list_view__container");
  for(var i=0; i<arr.length; i++) {

    list_view__update_caption(arr[i]);

  }
  document.addEventListener("mousedown", list_view__onmousedown_document);
});