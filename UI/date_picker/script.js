function compareDate(v1, v2) {
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

function fillMonth(element, value) {
  var today = new Date("June 30, 2020 23:15:30");

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

  element.querySelector(".date_picker__popup_month_title").innerText = new Intl.DateTimeFormat('ru', { month: 'long' }).format(value);
  var table = element.querySelector(".date_picker__month_table");

  var day = lastdays - weekday;
  for( var i=1; i<7; i++ ) {
    var row = table.childNodes[i];

    for( var j=0; j<7; j++) {
      var cell = row.childNodes[j];
      if(weekday == 0)
        day = 0;
      if(days == 0)
        day = 1;
      else
        day ++;
      
      cell.childNodes[0].childNodes[0].innerText = day;

      var current = null;
      if(weekday>0)
        current = new Date(value.getFullYear(), value.getMonth()-1, day);
      else
        if(days>0)
          current = new Date(value.getFullYear(), value.getMonth(), day);
        else
          current = new Date(value.getFullYear(), value.getMonth()+1, day);

      if(compareDate(current, today) == 0) {
        cell.childNodes[0].className = "date_picker__today";
      }
          
      if(weekday < 0)
        days --;
      weekday --;
    }



  }
}

window.addEventListener('load', function () {
  fillMonth(document.querySelector(".date_picker__container"), new Date('June 1, 2020 23:15:30'));
});