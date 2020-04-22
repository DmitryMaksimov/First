var double_slider_current = null;
var start_x = 0;
var start_margin = 0;

class double_slider {
  
  constructor (element_container, element_left, element_middle, element_right) {
    this.element_container = element_container;
    this.element_left = element_left;
    this.element_middle = element_middle;
    this.element_right = element_right;
    element_middle.style.width='100px';
  }
  OnStartDragLeft(element) {

  }
  OnStartDragRight(element) {

  };
}

function double_slider__onmousedown (element) {
  double_slider_current = document.elementFromPoint(element.clientX, element.clientY);
  if(double_slider_current == null)
    return;
  start_x = element.clientX;
  if(double_slider_current.className.includes("double_slider__left")) {
    start_margin = parseInt(double_slider_current.style.marginLeft);
  } else {
    start_margin = parseInt(double_slider_current.parentElement.querySelector(".double_slider__middle_spacer").style.width);
  }
  if(isNaN(start_margin)) {
    start_margin = 0;
  }
  element.stopImmediatePropagation();
}

function double_slider__onmouseup (element) {
  if(double_slider_current != null)
    element.stopImmediatePropagation();
  double_slider_current = null;
}

function double_slider__onmousemove (element) {
  if(double_slider_current === null)
    return;

  container_rect = double_slider_current.parentElement.getBoundingClientRect();


  if(double_slider_current.className.includes("double_slider__left")) {


    var offset = element.clientX - start_x;
    var ret = start_margin - parseInt(double_slider_current.style.marginLeft);
    var new_margin_left = start_margin + offset;

    var middle = double_slider_current.parentElement.querySelector(".double_slider__middle_spacer");
    var l = parseInt(middle.style.width);
    if(isNaN(l))
      l = 0;
    var new_middle = l - ret - offset;

    if(new_middle < 0) {
      new_margin_left += new_middle;
      new_middle = 0;
    }

    if(new_margin_left < 0) {
      new_middle += new_margin_left;
      new_margin_left = 0;
    }


    double_slider_current.style.marginLeft = new_margin_left + "px";
    middle.style.width = new_middle + "px";


/*

  
    double_slider_current.style.marginLeft = 
    right = double_slider_current.parentElement.querySelector(".double_slider__right").getBoundingClientRect().left -
      parseInt(double_slider_current.style.width);
*/    
  } else {

  }
  element.stopImmediatePropagation();
}



window.addEventListener('load',
  function () {


    document.body.addEventListener('mousemove', double_slider__onmousemove );
    document.body.addEventListener('mouseup', double_slider__onmouseup );


    document.querySelectorAll('.double_slider__container').forEach(
      function(element) {
        element.addEventListener('mousedown', double_slider__onmousedown );
        element.UI = new double_slider(
          element.querySelector('.double_slider__drag_drop'),
          element.querySelector('.double_slider__left'),
          element.querySelector('.double_slider__middle_spacer'),
          element.querySelector('.double_slider__right'),
        )
      }
    )
  }
);