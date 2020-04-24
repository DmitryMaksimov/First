function floatToString(float) {
  str = '' + parseInt(float);
  result = "";
  for(var i=0; i<str.length; i+=3) {
    result = str.substring(str.length - i - 3, str.length - i) + " " + result;
  }
	return result;
}


window.onSlider = function onSlider(element) {
  amount.innerText = floatToString(element.current_min) + "₽ - " + floatToString(element.current_max) + "₽";
}

window.onTest = function onTest(element) {
  alert(element);
}
