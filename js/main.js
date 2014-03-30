/* jshint globalstrict : false
 */
var srcEl;

var onDragStart = function(e) {
  'use strict';
  console.log('dragging');
  console.log(e);

  srcEl = this;
  console.log(this);
  e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
  if (this.parentNode.classList.contains('srcs')) {
    console.log('copy');
    this.classList.add('src-selected');
    e.originalEvent.dataTransfer.effectAllowed = 'copy';
  }
  else {
    console.log('move');
    this.classList.remove('src-selected');
    e.originalEvent.dataTransfer.effectAllowed = 'move';
  }
  console.log(this.innerHTML);
};
var onDragOver = function(e) {
  'use strict';
  if (e.preventDefault) {
    e.preventDefault();
  }
  if (e.originalEvent.dataTransfer.effectAllowed === 'move') {
    console.log('move drop');
    srcEl.innerHTML = '';
    e.originalEvent.dataTransfer.dropEffect = 'move';
  }
  else {
    console.log('copy drop');
    e.originalEvent.dataTransfer.dropEffect = 'copy';
  }
  //console.log('drag over');
  //console.log(e);
  return false;
};
var onDragEnter = function(e) {
  'use strict';
  this.classList.add('drag-over');
  //console.log('drag enter');
  //console.log(e);
};
var onDragLeave = function(e) {
  'use strict';
  this.classList.remove('drag-over');
  //console.log('drag leave');
  //console.log(e);
};
var onDrop = function(e) {
  'use strict';
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (srcEl != this) {
    console.log(srcEl.innerHTML);
    console.log(this.innerHTML);
    this.innerHTML = e.originalEvent.dataTransfer.getData('text/html');
  }
  this.classList.remove('drag-over');
  console.log('drop');
  console.log(e);
  return false;
};
var onDragEnd = function(e) {
  'use strict';
  //console.log('drag end');
  //console.log(e);
};
$(document).on('dragstart', '.src', onDragStart);
$(document).on('dragover', '.src', onDragOver);
$(document).on('dragenter', '.src', onDragEnter);
$(document).on('dragleave', '.src', onDragLeave);
$(document).on('drop', '.src', onDrop);
$(document).on('dragend', '.src', onDragEnd);

/* SETS DATE */
var findMonth = function(num) {
  'use strict';
  switch (num) {
    case 0 :
      return 'Jan';
    case 1 :
      return 'Feb';
    case 2 :
      return 'Mar';
    case 3 :
      return 'Apr';
    case 4 :
      return 'May';
    case 5 :
      return 'Jun';
    case 6 :
      return 'Jul';
    case 7 :
      return 'Aug';
    case 8 :
      return 'Sep';
    case 9 :
      return 'Oct';
    case 10 :
      return 'Nov';
    case 11 :
      return 'Dec';
  }
};
var daySuffix = function(num) {
  'use strict';
  switch (num) {
    case (num === 1 || num === 21 || num === 31) :
      return 'st';
    case (num === 2 || num === 22) :
      return 'nd';
    case (num === 3 || num === 23) :
      return 'rd';
    default :
      return 'th';
  }
};

/* Pads single digits with zeros */
var pad = function(x) {
  'use strict';
  return x < 10 ? '0'+x : x;
};

/* converts hours in military to tuple of hours, am/pm */
var fromMilitary = function(hours) {
  'use strict';
  if (hours >= 12) {
    hours = hours - 12;
    hours = (hours === 0) ? 12 : hours;
    return [hours, 'pm'];
  }
  else {
    return [hours, 'am'];
  }
};
/* updates the clock */
var updateTime = function() {
  'use strict';
  var d = new Date();

  var h = pad(d.getHours());
  var m = pad(d.getMinutes());
  var s = pad(d.getSeconds());

  var h2 = fromMilitary(h);

  var month = findMonth(d.getMonth());
  var day = d.getDate();
  var daySuff = daySuffix(day);

  $('#clock').html(h2[0] + ':' + m + ':' + s + ' ' + h2[1]);


  $('#month').html(month + ' ');
  $('#day').html(day);
  $('#daySuffix').html(daySuff);
};
updateTime();
setInterval(updateTime, 1000);
