var srcs = Object.freeze({ pc: {}, mac: {}, hdmi: {}, vga: {}, dvd: {}, bluray: {} });
var outs = { active : 1,
             out1 : { name: 'west', source: undefined, on: false, vm: false },
             out2 : { name: 'east', source: 'mac', on: false, vm: false },
             out3 : { name: 'north' , source: 'mac', on: false, vm: false } };


/* POWER BUTTON LISTENER */
$(document).on('click', '.pwr-btn > label', function() {
  var current = outs['out'+outs.active];
  var that = this;
  if (!$(this).hasClass('pwr-on')) {
    var blink = setInterval(warming, 500);
    window.setTimeout(clearInterval, 5000, blink);
    window.setTimeout(powerOn, 5000, that);
    current.on = true;
  }
  else {
    $(this).removeClass('pwr-on');
    console.log('power off for '+outs.active);
    $('.p-'+outs.active+' .cube').addClass('c-top');
    current.on = false;
  }
});
var warming = function() {
  var label = $('.p-'+outs.active+' .pwr-btn > label');
  console.log();
  if (label.hasClass('warming')) {
    console.log('blink off');
    label.removeClass('warming');
  }
  else {
    console.log('blink on');
    label.addClass('warming')
  }
}
var powerOn = function(that) {
  console.log('power on for '+outs.active);
  $(that).removeClass('warming');
  $(that).addClass('pwr-on');
  $('.p-'+outs.active+' .cube').removeClass('c-top');
}
/* VIDEO MUTE LISTENER */
$(document).on('click','.vm-btn > label', function() {
  var current = outs.active;
  if (!$(this).hasClass('vm-on')) {
    console.log('video muted for '+current);
    $(this).addClass('vm-on');
    $('.cube').addClass('cube-vm');
    outs['out'+current].vm = true;
  }
  else {
    console.log('vidoe unmuted');
    $(this).removeClass('vm-on');
    $('.cube').removeClass('cube-vm');
    outs['out'+current].vm = false;
  }
});
/* TAB NAVIGATION */
$(document).on('click', '.out-nav-item', function() {
  var oldOut = $('.nav-selected').data() ? $('.nav-selected').data().tab : 1;
  $('.nav-selected').removeClass('nav-selected');
  $(this).addClass('nav-selected');
  $('.active').removeClass('active');
  $('#out' + this.dataset.tab).addClass('active');
  $('#p-cube').removeClass('p-out-' + oldOut);
  $('#p-cube').addClass('p-out-' + this.dataset.tab);
  outs.active = this.dataset.tab;
  $('#src-' + outs['out'+outs.active].source).click();
  console.log(outs);
});


/* SOURCE SELECTION LISTENER */
$(document).on('click', '.src', function() {
  var cur = outs.active;
  var s = $(this).children('label').children(':last-child').html();
  console.log('switching '+cur+' to '+s);
  $('#src-' + s + ' input').prop('checked', true);
  var newClass = getMatrixClass(s);
  $('.p-'+cur+' .cube').removeClass('c-top c-front c-left c-right c-back c-bottom').addClass(newClass);
  outs['out'+cur].source = s;
});


/* Returns correct class */
function getMatrixClass(s) {
  switch(s) {
    case 'mac':
      return 'c-front';
      break;
    case 'pc':
      return 'c-bottom';
      break;
    case 'vga':
      return 'c-back';
      break;
    case 'dvd':
      return 'c-right';
      break;
    case 'hdmi':
      return 'c-left';
      break;
    case 'bluray':
      return 'c-top'
      break;
  }
}


/* Initial configuration */
$('.cube').addClass('c-top');
$('.out-nav-item')[0].click();


/* Prevent dragging of images */
$('img').on('dragstart', function(event) {
  event.preventDefault();
}); 



/* SETS DATE */
var findMonth = function(num) {
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
}
var daySuffix = function(num) {
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
}

/* Pads single digits with zeros */
var pad = function(x) {
  return x < 10 ? '0'+x : x;
};

/* converts hours in military to tuple of hours, am/pm */
var fromMilitary = function(hours) {
  if (hours >= 12) {
    hours = hours - 12;
    hours = (hours === 0) ? 12 : hours;
    return [hours, 'pm'];
  }
  else {
    return [hours, 'am'];
  }
}

/* updates the clock */
var updateTime = function() {
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
/* calls updateTime every second */
updateTime();
setInterval(updateTime, 1000);

/* VOLUME KNOB MUTE CONTROL */
$(document).on('click','#vol-mute', function() {
  if (!$(this).hasClass('vol-muted-m')) {
    $(this).addClass('vol-muted-m');
    $('#vol-switches > label').each(function() {
      $(this).children('div').children('div').addClass('vol-muted')
      if ($(this).children('div').children('div').hasClass('vol-checked')) {
        $(this).children('div').children('div').addClass('vol-checked-muted')
      }
    });
    $('input[name="switch"]').attr('disabled',true);
  }
  else {
    $(this).removeClass('vol-muted-m');
    $('#vol-switches > label').each(function() {
      $(this).children('div').children('div').removeClass('vol-muted')
      if ($(this).children('div').children('div').hasClass('vol-checked')) {
        $(this).children('div').children('div').removeClass('vol-checked-muted')
      }
    });
    $('input[name="switch"]').attr('disabled',false);
  }
});
  /* VOLUME KNOB LEVEL CONTROL */
$(document).on('click', '.vol-c', function() {
  var label = $(this).parent().parent();
  if (!$('#vol-mute').hasClass('vol-muted-m')) {
    label.nextAll('label').each(function() {
      $(this).children('div').children('div').removeClass('vol-checked');
    });
    label.prevAll('label').not('#switch-m-l').each(function() {
      $(this).children('div').children('div').addClass('vol-checked');
    });
    $(this).addClass('vol-checked');
  }
});
