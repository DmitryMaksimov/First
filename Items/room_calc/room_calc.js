window.room_calc__date_changed = function(element) {
  days = (element.selection_to - element.selection_from) / (60*60*24*1000);
  if(isNaN(days))
    days = 1;
  if(days < 1)
    days = 1;
  update_table(element);
}

function update_table(calc) {
  calc = calc.parentElement;
  var room_calc__days = calc.querySelector('.room_calc__days');
  alert(room_calc__days);
  room_calc__days.innerText = days;
}
