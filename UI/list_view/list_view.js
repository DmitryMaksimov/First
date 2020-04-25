/* Склонение declOfNum(count, ['найдена', 'найдено', 'найдены']); */
function list_view__declOfNum(n, titles) {
  return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

/* auto close */
function list_view__onmousedown_document(event) {
  try {
    var e = document.elementFromPoint(event.clientX, event.clientY);
    while(e) {
      if(e.className.indexOf('list_view__popup_container') >= 0)
        return;
      e = e.parentElement;
    }
  } catch(e) {
    return;
  }
  var arr = document.querySelectorAll('.list_view__popup_container');
  for( var i=0; i<arr.length; i++)
    arr[i].style.visibility = 'hidden';
}

window.list_view__button_add = function (element) {
  var input = element.querySelector(".list_view__editor");
  var value = input.value;
  if(isNaN(value))
    value = 1;
  else
    value ++;
  input.value = value;
  list_view__update_caption(element.parentElement.parentElement);
}

window.list_view__button_sub = function (element) {
  var input = element.querySelector(".list_view__editor");
  var value = input.value;
  if(isNaN(value) || value <= 0)
    value = 0;
  else
    value --;
  input.value = value;
  list_view__update_caption(element.parentElement.parentElement);
}

window.list_view__update_caption = function(element) {
  var caption = element.querySelector('.list_view__caption');
  var total = 0;
  var captionText = "";

  if(element.attributes['short'] != null) {
    for(var i=0; i<element.values.length; i++)
      total += element.values[i];
    captionText = total + " " + list_view__declOfNum(total, JSON.parse(element.attributes['short'].value));
  } else {
    for(var i=0; i<element.values.length; i++) {
      total += element.values[i];
      if(element.values[i] <= 0)
        continue;
      var append = element.values[i] + " " + list_view__declOfNum(element.values[i], element.decls[i]);

      if(captionText == "")
        captionText = append;
      else
        captionText += ", " + append;
    }
  }
  if(total == 0)
    caption.innerText = element.caption;
  else
    caption.innerText = captionText;
  return;  
}

window.list_view__accept = function(element) {
  var list = element;
  element = element.parentElement;
  for(var i=0; i<element.values.length; i++) {
    val = parseInt(list.childNodes[i].querySelector('.list_view__editor').value);
    if(isNaN(val))
      val = 0;
    element.values[i] = val;
  }
  list_view__update_caption(element);
}

window.list_view__show_popup = function(element) {
  var popup = element.querySelector('.list_view__popup_container');
  popup.style.left = element.offsetLeft;
  popup.style.top = element.offsetTop + element.offsetHeight + 'px';
  popup.style.width = element.offsetWidth + 'px';
  popup.style.visibility='visible';
}

window.addEventListener('load', function () {
  var arr = document.querySelectorAll(".list_view__container");
  for(var i=0; i<arr.length; i++) {
    arr[i].caption = arr[i].attributes['caption'].value.toString();
    arr[i].values = new Array();
    arr[i].names = new Array();
    arr[i].decls = new Array();
    var rows = arr[i].querySelectorAll('.list_view__row');
    for(var j=0; j<rows.length; j++) {
      var val = [];
      if(rows[j].attributes['names'] != null)
        val = JSON.parse(rows[j].attributes['names'].value)
      arr[i].decls[arr[i].decls.length] = rows[j].names = val;
      val = rows[j].value;
      if(isNaN(val))
        val = 0;
      arr[i].values[arr[i].values.length] = val;
      arr[i].names[arr[i].names.length] = rows[j].attributes['name'].value;
    }
    list_view__update_caption(arr[i]);

  }
  document.addEventListener("mousedown", list_view__onmousedown_document);
});