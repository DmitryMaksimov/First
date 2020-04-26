var double_slider_current = null;
var start_x = 0;
var start_margin = 0;

function double_slider__calc(double_slider_container) {
  var result = {};
  result.container = double_slider_container;
  result.left = result.container.querySelector(".double_slider__left");
  result.middle = result.container.querySelector(".double_slider__middle");
  result.right = result.container.querySelector(".double_slider__right");

  result.container_rect = result.container.getBoundingClientRect();
  result.left_rect = result.left.getBoundingClientRect();
  result.middle_rect = result.middle.getBoundingClientRect();
  result.right_rect = result.right.getBoundingClientRect();

  result.result_left = parseInt(result.left.style.marginLeft);
  if(isNaN(result.result_left))
    result.result_left = 0;
    result.result_length = result.container_rect.right - result.container_rect.left - result.left_rect.right + result.left_rect.left - result.right_rect.right + result.right_rect.left - 2;
  result.result_middle = parseInt(result.middle.style.width);
  if(isNaN(result.result_middle))
    result.result_middle = 0;
  return result;
}

function double_slider__onmousedown (element) {
  double_slider_current = document.elementFromPoint(element.clientX, element.clientY);
  if(double_slider_current == null)
    return;
  start_x = element.clientX;
  if(double_slider_current.className.indexOf("double_slider__left") >= 0) {
    start_margin = parseInt(double_slider_current.style.marginLeft);
  } else {
    if(double_slider_current.className.indexOf("double_slider__right") >= 0) {
      start_margin = parseInt(double_slider_current.parentElement.querySelector(".double_slider__middle").style.width);
    } else {
      double_slider_current = null;
      return;
    }
  }
  if(isNaN(start_margin)) {
    start_margin = 0;
  }
  document.addEventListener('mousemove', double_slider__onmousemove );
  document.addEventListener('mouseup', double_slider__onmouseup );
}

function double_slider__onmouseup (element) {
  double_slider_current = null;
  document.removeEventListener('mousemove', double_slider__onmousemove );
  document.removeEventListener('mouseup', double_slider__onmouseup );
}

function double_slider__onmousemove (element) {
  if(double_slider_current === null) {
    document.removeEventListener('mousemove', double_slider__onmousemove );
    document.removeEventListener('mouseup', double_slider__onmouseup );
    return;
  }

  var context = double_slider__calc(double_slider_current.parentElement);
  var offset = element.clientX - start_x;

  if(double_slider_current.className.indexOf("double_slider__left")>=0) {
    var ret = start_margin - context.result_left;
    var new_middle = context.result_middle - ret - offset;
    var new_margin_left = start_margin + offset;

    if(new_middle < 0) {
      new_margin_left += new_middle;
      new_middle = 0;
    }

    if(new_margin_left < 0) {
      new_middle += new_margin_left;
      new_margin_left = 0;
    }
    context.left.style.marginLeft = new_margin_left + "px";
    context.middle.style.width = new_middle + "px";
  } else {
    var max_middle_width = context.result_length - context.result_left;
    var new_middle_width = start_margin + offset;
    if(new_middle_width > max_middle_width)
      context.middle.style.width = max_middle_width + "px";
    else
      context.middle.style.width = new_middle_width + "px";
  }
  var left = parseInt(context.left.style.marginLeft);
  var middle = parseInt(context.middle.style.width) + left;

  left = (parseFloat(left) / parseFloat(context.result_length)) * (parseFloat(context.container.maximum)-parseFloat(context.container.minimum)) + parseFloat(context.container.minimum);
  middle = (parseFloat(middle) / parseFloat(context.result_length)) * (parseFloat(context.container.maximum)-parseFloat(context.container.minimum)) + parseFloat(context.container.minimum);
  context.container.attributes.current_min.value = context.container.current_min = left;
  context.container.attributes.current_max.value = context.container.current_max = middle;

  context.container.onchange(context.container);
}

window.addEventListener('load', function () {
    arr = document.querySelectorAll('.double_slider__container');
    for (var i = 0, len = arr.length; i < len; i++) {
      var context = double_slider__calc(arr[i]);

      context.container.current_min = context.container.attributes.current_min.value;
      context.container.minimum = context.container.attributes.minimum.value;
      context.container.maximum = context.container.attributes.maximum.value;
      context.container.current_max = context.container.attributes.current_max.value;

      var new_margin_left = parseInt(context.result_length * (parseFloat(context.container.current_min) - parseFloat(context.container.minimum)) / (parseFloat(context.container.maximum) - parseFloat(context.container.minimum)));
      var new_middle_width = parseInt(context.result_length * (parseFloat(context.container.current_max) - parseFloat(context.container.minimum)) / (parseFloat(context.container.maximum) - parseFloat(context.container.minimum)));
      new_middle_width -= new_margin_left;

      new_middle_width -= new_margin_left;
      if(new_margin_left > context.result_length) {
        new_margin_left = context.result_length;
        new_middle_width = 0;
      }
      if(new_middle_width < 0)
        new_middle_width = 0;

      if( (new_middle_width + new_margin_left) > context.result_length)
        new_middle_width = context.result_length - new_margin_left;

        context.left.style.marginLeft = new_margin_left + "px";
        context.middle.style.width = new_middle_width + "px";

        new_margin_left = (parseFloat(new_margin_left) / parseFloat(context.result_length)) * (parseFloat(context.container.maximum)-parseFloat(context.container.minimum)) + parseFloat(context.container.minimum);
        new_middle_width = (parseFloat(new_middle_width) / parseFloat(context.result_length)) * (parseFloat(context.container.maximum)-parseFloat(context.container.minimum)) + parseFloat(context.container.minimum);
        context.container.attributes.current_min.value = context.container.current_min = new_margin_left;
        context.container.attributes.current_max.value = context.container.current_max = new_middle_width;
      
        context.container.onchange(context.container);

        arr[i].addEventListener('mousedown', double_slider__onmousedown );
//        arr[i].addEventListener('ondragstart', function() { return false; });
    }    
  }
);