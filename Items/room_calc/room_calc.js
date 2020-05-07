/* Склонение declOfNum(count, ['найдена', 'найдено', 'найдены']); */
function declOfNum(n, titles) {
  return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

/* Поиск родителя по названию класса */
function getParentElementByClassName(element, className) {
  do {
    if(element.classList.contains(className))
      return element;
  } while(element = element.parentElement);
}


window.room_calc__date_changed = function(element) {
  update_table(element);
}

function update_table(calc) {
  calc = getParentElementByClassName(calc, 'room_calc__order');
  var price = parseInt(calc.attributes['price'].value);
  var service = parseInt(calc.attributes['service'].value);
  var addition = parseInt(calc.attributes['addition'].value);

  var days = calc.querySelector('.date_picker__filter');
  days = (days.selection_to - days.selection_from) / (60*60*24*1000);
  if(isNaN(days) || (days < 1))
    days = 1;

  var room_calc__price = calc.querySelector('.room_calc__price');
  room_calc__price.innerHTML = '<b>' + price.toLocaleString() + '₽</b> в сутки';

  var room_calc__days = calc.querySelector('.room_calc__days');
  room_calc__days.innerText = price.toLocaleString() + ' х ' + days.toLocaleString() + ' ' + declOfNum(days, ['сутки','суток','суток']);

  var room_calc__sub_total = calc.querySelectorAll('.room_calc__sub_total');
  room_calc__sub_total[0].innerText = (price * days).toLocaleString() + '₽';

  if(service < 0) {
    var room_calc__service_title = calc.querySelector('.room_calc__service_title');
    var text = ': скидка ' + (-service).toLocaleString() + '₽';
    if(!room_calc__service_title.innerText.endsWith(text))
      room_calc__service_title.innerText = room_calc__service_title.innerText + text;
  }
  room_calc__sub_total[1].innerText = ((service < 0)?0:service).toLocaleString() + '₽';

  var room_calc__total_value = calc.querySelector('.room_calc__total_value');
  room_calc__total_value.innerText = (price * days + service + addition).toLocaleString() + '₽';
}

window.addEventListener('load', function () {
  var tables = document.querySelectorAll('.room_calc__order');
  for(var i=0; i<tables.length; i++)
    update_table(tables[i]);
});