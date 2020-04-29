
window.addEventListener('load', function (event) {

  var chart = document.querySelectorAll('.chart_view__pie_container');

  for(var i=0; i<chart.length; i++) {
    chart[i].values = JSON.parse(chart[i].attributes['values'].value);
    
    var total = 0;
    var zero = 0;

    var lastchild = null;
    if(chart[i].childNodes.length > 0)
      lastchild = chart[i].childNodes[chart[i].childNodes.length - 1];

    for(var j=0; j<chart[i].values.length; j++)
      zero += chart[i].values[j].value;

    zero = 360 - zero;

    for(var j=0; j<chart[i].values.length; j++) {
      if(chart[i].values[j].value <= 0)
        chart[i].values[j].value = zero;

      var v = chart[i].values[j].value;

      if(chart[i].values[j].value > 180) {
        var div = document.createElement('div');
        div.className = 'chart_view__pie_slice_biggest';
  
        chart[i].insertBefore(div, chart[i].childNodes[0]);
        
        div.style.width = chart[i].clientWidth + 'px';
        div.style.height = chart[i].clientHeight + 'px';
        div.style.position = 'absolute';

        div.style.background = 'linear-gradient(180deg, ' + chart[i].values[j].color1 + ' 0%, ' + chart[i].values[j].color2 + ' 100%)';
      } else {

        var div = document.createElement('div');
        div.className = 'chart_view__pie_slice_triangle';

        if(lastchild != null)
          chart[i].insertBefore(div, lastchild);
        else
          chart[i].appendChild(div);


        
        div.style.width = chart[i].clientWidth + 'px';
        div.style.height = chart[i].clientHeight/2 + 'px';

        div.style.position = 'absolute';

        div.style.transform = 'rotate(' + (total + v - 90) + 'deg)';

        var subdiv = document.createElement('div');
        subdiv.className = 'chart_view__pie_slice_circle';
        div.appendChild(subdiv);

        subdiv.style.transform = 'rotate(' + (180 - v) + 'deg)';
        subdiv.style.background = 'linear-gradient(' + (90 - total) + 'deg, ' + chart[i].values[j].color1 + ' 0%, ' + chart[i].values[j].color2 + ' 100%)';
      }

      total += v;
    }

    var border_width = parseInt(chart[i].attributes['border_width'].value);
    if(!isNaN(border_width)) {
      var div = document.createElement('div');
      div.className = 'chart_view__pie_border';

      if(lastchild != null)
        chart[i].insertBefore(div, lastchild);
      else
        chart[i].appendChild(div);
  
      div.style.width = chart[i].clientWidth - border_width*2 + 'px';
      div.style.height = chart[i].clientHeight - border_width*2 + 'px';
      div.style.marginLeft = border_width + 'px';
      div.style.marginTop = border_width + 'px';
      div.style.position = 'absolute';
    }

    if(lastchild) {
      lastchild.style.width = chart[i].clientWidth + 'px';
      lastchild.style.height = chart[i].clientHeight + 'px';
      lastchild.style.position = 'absolute';
    }
  }

});
