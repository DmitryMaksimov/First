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

window.list_view__button_add = function (row) {
  var input = row.querySelector(".list_view__editor");
  var value = input.value;
  if(isNaN(value))
    value = 1;
  else
    value ++;
  input.value = value;
  list_view__onrowchange(row);
}

window.list_view__button_sub = function (row) {
  var input = row.querySelector(".list_view__editor");
  var value = input.value;
  if(isNaN(value) || value <= 0)
    value = 0;
  else
    value --;
  input.value = value;
  list_view__onrowchange(row);
}

window.list_view__update_caption = function(element) {
  var caption = element.querySelector('.list_view__caption');
  var total = 0;
  var captionText = "";

  for(var i=0; i<element.values.length; i++) {
    if(element.decls[i].length > 0) {
      if(element.values[i] <= 0)
        continue;
      var append = element.values[i] + " " + list_view__declOfNum(element.values[i], element.decls[i]);

      if(captionText == "")
        captionText = append;
      else
        captionText += ", " + append;
    } else
      total += element.values[i];
  }
  if(total > 0) {
    if(captionText == "")
      captionText = total + " " + list_view__declOfNum(total, JSON.parse(element.attributes['other_decls'].value));
    else
      captionText = total + " " + list_view__declOfNum(total, JSON.parse(element.attributes['other_decls'].value)) + ", " + captionText;
  }

  if(caption.tagName.toUpperCase() == 'INPUT') {
    if(captionText == "")
      caption.value = element.caption;
    else
      caption.value = captionText;
  } else {
    if(captionText == "")
      caption.innerText = element.caption;
    else
      caption.innerText = captionText;
 
  }
  return;  
}

window.list_view__accept = function(element) {
  var list = element;
  element = element.parentElement;
  for(var i=0; i<element.values.length; i++) {
    val = parseInt(list.childNodes[i].querySelector('.list_view__editor').value);
    if(isNaN(val) || val < 0)
      val = 0;
    element.values[i] = val;
  }
  list_view__update_caption(element);
  element.querySelector('.list_view__popup_container').style.visibility = 'hidden';
}

window.list_view__clear = function(element) {
  var arr = element.querySelectorAll('.list_view__editor');
  for(var i=0; i<arr.length; i++) {
    arr[i].value = 0;
  }
}

window.list_view__show_popup = function(elem) {
  element = elem.parentElement;
  var popup = element.querySelector('.list_view__popup_container');
  var rect = element.getBoundingClientRect();
  popup.style.left = element.offsetLeft + 'px';
  popup.style.top = element.offsetTop + element.clientHeight + 'px';
  popup.style.width = element.offsetWidth + 'px';

  
  var arr = popup.querySelectorAll('.list_view__editor');
  for(var i = 0; i<element.values.length; i++) {
    arr[i].value = element.values[i];
    list_view__onrowchange(arr[i].parentElement);
  }

  if(popup.style.visibility != 'visible')
    window.setTimeout(function() {popup.style.visibility = 'visible';}, 100)
  return false;
}

function list_view__onresize() {
  arr = document.querySelectorAll('.list_view__popup_container');
  for(var i=0; i<arr.length; i++) {
    if(arr[i].style.visibility != 'visible')
      continue;

    element = arr[i].parentElement;
    arr[i].style.left = element.offsetLeft + 'px';
    arr[i].style.top = element.offsetTop + element.clientHeight + 'px';
    arr[i].style.width = element.offsetWidth + 'px';
  }
}

window.list_view__onrowchange = function(row) {
  var input = row.querySelector(".list_view__editor");
  var val = parseInt(input.value);

  if(isNaN(val))
    return;

  if(val <= 0)
    row.querySelector(".list_view__sub_button").classList.add('list_view__sub_button_disabled');
  else
    row.querySelector(".list_view__sub_button").classList.remove('list_view__sub_button_disabled');
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
  window.addEventListener('resize', list_view__onresize);

});