/* jshint globalstrict : false
 */
var srcEl;

var onDragStart = function(e) {
  'use strict';
  this.style.opacity = '0.4';
  console.log('dragging');
  console.log(e);

  srcEl = this;
  e.originalEvent.dataTransfer.effectAllowed = 'move';
  e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
  console.log(this.innerHTML);
};
var onDragOver = function(e) {
  'use strict';
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.originalEvent.dataTransfer.dropEffect = 'move';
  //console.log('drag over');
  //console.log(e);
  return false;
};
var onDragEnter = function(e) {
  'use strict';
  this.classList.add('over');
  //console.log('drag enter');
  //console.log(e);
};
var onDragLeave = function(e) {
  'use strict';
  this.classList.remove('over');
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
    srcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.originalEvent.dataTransfer.getData('text/html');
  }
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
