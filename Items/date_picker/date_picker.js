var date_picker__value_from = null;
var date_picker__value_to = null;
var date_picker__last_move = 0;
var date_picker_drag = null;
var date_picker__drag_start = null;

function date_picker__compareDate(v1, v2) {
  if((v1 == null) && (v2 == null))
    return 0;
  if(v1 == null)
    return -1;
  if(v2 == null)
    return 1;

  if(v1.getFullYear() < v2.getFullYear())
    return -1;
  if(v1.getFullYear() > v2.getFullYear())
    return 1;
  if(v1.getMonth() < v2.getMonth())
    return -1;
  if(v1.getMonth() > v2.getMonth())
    return 1;
  if(v1.getDate() < v2.getDate())
    return -1;
  if(v1.getDate() > v2.getDate())
    return 1;
  return 0;
}

window.date_picker__fillMonth = function (element) {
  var today = new Date();
  var value = element.current_month;
  var sel_from = element.selection_from;
  var sel_to = element.selection_to;

  var one_day_start_end = date_picker__compareDate(sel_from, sel_to) == 0;

  var month = new Date(value.getFullYear(), value.getMonth(), 1);
  var weekday = month.getDay();
  if(weekday == 0)
    weekday = 7;
  weekday --;
  if(!weekday)
    weekday = 7;

  month = new Date(value.getFullYear(), value.getMonth() + 1, 0);
  var days = month.getDate() - 1;
  month = new Date(value.getFullYear(), value.getMonth(), 0);
  var lastdays = month.getDate();

  element.querySelector(".date_picker__popup_month_title").innerText = String(new Intl.DateTimeFormat('ru', { month: 'long'}).format(value)).toString() + ' ' + value.getFullYear();
  var table = element.querySelector(".date_picker__month_table");

  var day = lastdays - weekday; //Заполняем first row остатками предыдущего месяца высчитав первый day

  var className = "date_picker__outer";

  for( var i=1; i<7; i++ ) { //Перебираем строки Начиная со второй
    var row = table.childNodes[i]; 

    for( var j=0; j<7; j++) { //Перебираем ячейки
      var cell = row.childNodes[j];

      if(weekday == 0)// После того как кончились дни предыдущего месяца
        day = 0;//Сбрасываем дни (один прибавим чуть ниже), счетчика дней (возрастает)
      if(days == 0) //нерасфасованное количество дней в текущем месяце. Убавляем на единицу
        day = 1; //Инкрементальный счетчик текущего значения для дня
      else
        day ++; //
      
      cell.childNodes[0].childNodes[0].innerText = day;

      var current = null;
      if(weekday>0)
        current = new Date(value.getFullYear(), value.getMonth()-1, day);
      else
        if(days>0) {
          current = new Date(value.getFullYear(), value.getMonth(), day);
          className = "date_picker__cell";
        } else {
          current = new Date(value.getFullYear(), value.getMonth()+1, day);
          className = "date_picker__outer";
        }

      cell.value = current;
      cell.className = "date_picker__cell";
      cell.childNodes[0].className = "date_picker__cell";
      cell.childNodes[0].childNodes[0].className = className;
      

      if(date_picker__compareDate(current, today) == 0) { //Если это сегодняшний день, отмечаем
        cell.className = "date_picker__today";
      }

      if(one_day_start_end) { //День начала совпадает с окончанием
        if(date_picker__compareDate(current, sel_from) == 0) {
          cell.className = "date_picker__select";
        }
      } else {
        if(date_picker__compareDate(sel_from, current) == 0) {
          cell.className = "date_picker__select";
          cell.childNodes[0].className = "date_picker__fill_start";
        } else
        if(date_picker__compareDate(sel_to, current) == 0) {
          cell.className = "date_picker__select";
          cell.childNodes[0].className = "date_picker__fill_end";
        } else
        if((date_picker__compareDate(sel_from, current) < 0) && (date_picker__compareDate(current, sel_to) < 0)) {
          cell.childNodes[0].className = "date_picker__fill";
        }
      }

      if(weekday < 0)
        days --;
      weekday --;
    }
  }
}

function date_picker__onmouseup(event) {
  date_picker_drag = null;
}

function date_picker__onmousedown(event) {
  date_picker_drag = this.parentElement.parentElement.parentElement.parentElement;
  date_picker__value_from = date_picker_drag.selection_from;
  date_picker__value_to = date_picker_drag.selection_to;

  if(date_picker_drag.single_selection) {
    date_picker__drag_start = this.value;
    return;
  }

  if(date_picker__compareDate(this.value, date_picker_drag.selection_from) == 0) {
    date_picker__drag_start = date_picker_drag.selection_to;
  } else if(date_picker__compareDate(this.value, date_picker_drag.selection_to) == 0) {
    date_picker__drag_start = date_picker_drag.selection_from;
  } else {
    date_picker__drag_start = this.value;
  }
}

function date_picker__onmouseover(event) {
  if(date_picker_drag == null)
    return;
  if((date_picker__compareDate(this.value, date_picker__drag_start) == 0) ||
  date_picker_drag.single_selection) {
    date_picker_drag.selection_from = this.value;
    date_picker_drag.selection_to = this.value;
    date_picker__fillMonth(date_picker_drag);
    return;
  }
  if(this.value < date_picker__drag_start) {
    date_picker_drag.selection_from = this.value;
    date_picker_drag.selection_to = date_picker__drag_start;
    date_picker__fillMonth(date_picker_drag);
    date_picker__last_move = -1;
    return;
  }
  date_picker_drag.selection_from = date_picker__drag_start;
  date_picker_drag.selection_to = this.value;
  date_picker__fillMonth(date_picker_drag);
  date_picker__last_move = 1;
}

function date_picker__onmouseleave(event) {
  if(date_picker_drag == null)
    return;
  date_picker_drag.selection_from = date_picker__value_from;
  date_picker_drag.selection_to = date_picker__value_to;
  date_picker__fillMonth(date_picker_drag);
  date_picker_drag = null;
}

function date_picker__onclick(event) {
  var date_picker_drag = this.parentElement.parentElement.parentElement.parentElement;

  if((date_picker_drag.selection_from == null) ||
  (date_picker_drag.selection_to == null) ||
  date_picker_drag.single_selection) {
    date_picker_drag.selection_from = date_picker_drag.selection_to = this.value;
    date_picker__fillMonth(date_picker_drag);
    return;
  }

  if(this.value < date_picker_drag.selection_from) {
    date_picker_drag.selection_from = this.value;
    date_picker__fillMonth(date_picker_drag);
    date_picker__last_move = -1;
    return;
  }

  if(date_picker_drag.selection_to < this.value) {
    date_picker_drag.selection_to = this.value;
    date_picker__fillMonth(date_picker_drag);
    date_picker__last_move = 1;
    return;
  }

  if(date_picker__last_move == 0)
    return;

  if(date_picker__last_move < 0)
    date_picker_drag.selection_from = this.value;
  else
    date_picker_drag.selection_to = this.value;
  date_picker__fillMonth(date_picker_drag);
}

window.date_picker__onnext_month = function (elem) {
  var element = elem.parentElement.parentElement.parentElement;
  var current = element.current_month;
  var newDate = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
  element.current_month = newDate;
  date_picker__fillMonth(element);
}

window.date_picker__onprev_month = function date_picker__onprev_month(elem) {
  var element = elem.parentElement.parentElement.parentElement;
  var current = element.current_month;
  var newDate = new Date(current.getFullYear(), current.getMonth() - 1, current.getDate());
  element.current_month = newDate;
  date_picker__fillMonth(element);
}

/* auto close */
function date_picker__onmousedown_document(event) {
  try {
    var e = document.elementFromPoint(event.clientX, event.clientY);
    while(e) {
      if(e.className.indexOf('date_picker__popup_container') >= 0)
        return;
      e = e.parentElement;
    }
  } catch(e) {
    return;
  }
  var arr = document.querySelectorAll('.date_picker__popup_container');
  for( var i=0; i<arr.length; i++)
    arr[i].style.visibility = 'hidden';
}

window.date_picker__update_caption = function(element) {
  var caption = element.querySelector('.date_picker__caption');
  if((element.selection_from == null) || (element.selection_to == null)) {
    caption.innerText = "";
    return;
  }

  if(element.single_selection) {
    var from = new Intl.DateTimeFormat('ru', { day: '2-digit', month: '2-digit', year: 'numeric'}).format(element.selection_from);
    caption.innerText = from.toString();
  } else {
    var from = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' }).format(element.selection_from);
    var to = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' }).format(element.selection_to);
    caption.innerText = from.toString() + ' - ' + to.toString();
  }
}

window.date_picker__accept = function (button) {
  var element = button.parentElement.parentElement.parentElement;
  var popup = element.querySelector('.date_picker__popup_container');
  date_picker__update_caption(element);
  popup.style.visibility = 'hidden';
  try {
    element.onchange(element);
  } catch(e) {

  }
}

window.date_picker__onmousedown = function(elem) {
  element = elem.parentElement;
  var popup = element.querySelector('.date_picker__popup_container');
  var rect = element.getBoundingClientRect();

  if(element.attributes['right_justifyed'] != null) {
    popup.style.left = (element.offsetLeft + element.clientWidth - popup.clientWidth) + 'px';
  } else {
    popup.style.left = element.offsetLeft + 'px';
  }
  popup.style.top = element.offsetTop + element.clientHeight + 'px';

  if(popup.style.visibility != 'visible')
    window.setTimeout(function() {popup.style.visibility = 'visible';}, 100)
  return false;
}


function date_picker__onresize() {
  arr = document.querySelectorAll('.date_picker__popup_container');
  for(var i=0; i<arr.length; i++) {
    if(arr[i].style.visibility != 'visible')
      continue;

    

    element = arr[i].parentElement;
    if(element.attributes['right_justifyed'] != null) {
      arr[i].style.left = (element.offsetLeft + element.clientWidth - arr[i].clientWidth) + 'px';
    } else {
      arr[i].style.left = element.offsetLeft + 'px';
    }
    arr[i].style.top = element.offsetTop + element.clientHeight + 'px';
  }
}

window.date_picker_filter__selected_from = function (element) {
  element.parentElement.selection_from = element.selection_from;
  try {
    element.parentElement.onchange(element.parentElement);
  } catch(e) {

  }
}

window.date_picker_filter__selected_to = function (element) {
  element.parentElement.selection_to = element.selection_from;
  try {
    element.parentElement.onchange(element.parentElement);
  } catch(e) {

  }
}

window.addEventListener('load', function () {
  var arr = document.querySelectorAll(".date_picker__container");
  for(var i=0; i<arr.length; i++) {

    var table = arr[i].querySelector(".date_picker__month_table");

    arr[i].single_selection = arr[i].attributes.single_selection != null;
    arr[i].selection_from = arr[i].attributes.selection_from;
    arr[i].selection_to = arr[i].attributes.selection_to;

    arr[i].addEventListener("mouseleave", date_picker__onmouseleave);

    var from = new Date(arr[i].selection_from);
    if(isNaN(from.getTime())) {
      arr[i].current_month = new Date();
      arr[i].selection_from = null;
      arr[i].selection_to = null;
    } else {
      var to = new Date(arr[i].selection_to);
      if(isNaN(to.getTime())) {
        arr[i].current_month = new Date();
        arr[i].selection_from = null;
        arr[i].selection_to = null;
      } else {
        arr[i].selection_from = from;
        arr[i].selection_to = to;
        arr[i].current_month = from;
      }
    }

    date_picker__update_caption(arr[i]);

    for( var j=1; j<7; j++ ) { //Перебираем строки Начиная со второй
      var row = table.childNodes[j]; 
      for( var k=0; k<7; k++) { //Перебираем ячейки
        var cell = row.childNodes[k];
        cell.addEventListener("click", date_picker__onclick);
        cell.addEventListener("dragstart", function() {alert();return false;});
        cell.addEventListener("mousedown", date_picker__onmousedown);
        cell.addEventListener("mouseover", date_picker__onmouseover);
      }
    }  
    date_picker__fillMonth(arr[i]);
  }
  document.addEventListener("mouseup", date_picker__onmouseup);
  document.addEventListener("mousedown", date_picker__onmousedown_document);
  window.addEventListener('resize', date_picker__onresize);
});