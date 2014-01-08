var SOURCE = Object.freeze({ PC: 'pc', MAC: 'mac', HDMI: 'hdmi', VGA: 'vga', DVD: 'dvd', BLURAY: 'bluray' });
var OUTPUT = Object.freeze({ PROJECTOR: 'projector', TELEVISION: 'television' });

/* DYNAMICALLY CREATE PROJECTORS AND SOURCES */
var sources = [SOURCE.PC, SOURCE.MAC];
var outs = { 1: { name: 'west', type: OUTPUT.PROJECTOR, source: undefined, on: false, vm: false },
             2: { name: 'east', type: OUTPUT.PROJECTOR, source: undefined, on: false, vm: false },
             3: { name: 'north', type: OUTPUT.TELEVISION, source: undefined, on: false, vm: false } };
var state = { active: 1};

var getSourceIcon = function(s) {
  switch(s) {
    case SOURCE.HDMI:
      return 'cf icon-hdmi';
      break;
    case SOURCE.VGA:
      return 'cf icon-vga';
      break;
    case SOURCE.MAC:
      return 'fa fa-apple';
      break;
    case SOURCE.PC:
      return 'fa fa-windows';
      break;
    case SOURCE.DVD:
      return 'cf icon-dvd';
      break;
    default:
      return 'cf icon-cmdr';
  }
}
var getOutputIcon = function(o) {
  switch(o) {
    case OUTPUT.PROJECTOR:
      return 'fa fa-video-camera';
      break;
    case OUTPUT.TELEVISION:
      return 'fa fa-desktop';
      break;
    default:
      return 'fa fa-video-camera';
  }
}
var addSources = function(sources) {
  var html = '';
  for (var s in sources) {
    if (sources.hasOwnProperty(s)) {
      html += '<div class="src" id="src-'+sources[s]+'">'+
                '<input type="radio" name="source">'+
                '<label>'+
                  '<div><i class="'+getSourceIcon(sources[s])+'"></i></div>'+
                  '<div>'+sources[s]+'</div>'+
                '</label>'+
              '</div>';
    }
  }
  $('#src-group').html(html);
}

addSources(sources);

var addOutputs = function(outputs) {
  var navHtml = '';
  var octHtml = '';
  var c = 1;
  for (var o in outputs) {
    if (outputs.hasOwnProperty(o)) {
      navHtml += '<div class="col-xs-4">'+
                '<div class="out-nav-item" data-tab="'+o+'">'+
                  '<i class="'+getOutputIcon(outputs[o].type)+'"></i>'+
                  '<span>'+outputs[o].name+'</span>'+
                '</div>'+
              '</div>';
      octHtml = '<div class="col-xs-6 out-info">'+
                  '<div class="transforms">'+
                    '<div class="cube p-front">'+
                      '<div class="face f-top">'+
                        '<i class="cf icon-cmdr fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-front">'+
                        '<i class="fa fa-apple fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-bottom">'+
                        '<i class="fa fa-windows fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-back">'+
                        '<i class="cf icon-vga fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-left">'+
                        '<i class="cf icon-hdmi fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-right">'+
                        '<i class="cf icon-dvd fa-7x"></i>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-xs-3">'+
                  '<div class="pwr-btn">'+
                    '<label>'+
                      '<i class="fa fa-power-off fa-3x"></i>'+
                    '</label>'+
                  '</div>'+
                '</div>'+
                '<div class="col-xs-3">'+
                  '<div class="vm-btn">'+
                    '<label>'+
                      '<span class="vm-txt">VIDEO MUTE</span>'+
                    '</label>'+
                  '</div>'+
                '</div>';
      $('#o-'+c).html(octHtml);
      console.log($('#o-'+c));
      c++;
    }
  }
  $('#out-nav').html(navHtml);
}

addOutputs(outs);

/* POWER BUTTON LISTENER */
$(document).on('click', '.pwr-btn > label', function() {
  var current = outs[state.active];
  var that = this;
  if (!$(this).hasClass('pwr-on')) {
    var blink = setInterval(warming, 500);
    window.setTimeout(clearInterval, 5000, blink);
    window.setTimeout(powerOn, 5000, that);
    current.on = true;
  }
  else {
    $(this).removeClass('pwr-on');
    console.log('power off for '+state.active);
    $('#o-'+state.active+' .cube').addClass('c-top');
    current.on = false;
  }
});
var warming = function() {
  var label = $('#o-'+state.active+' .pwr-btn > label');
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
  console.log('power on for '+state.active);
  $(that).removeClass('warming');
  $(that).addClass('pwr-on');
  $('#o-'+state.active+' .cube').removeClass('c-top');
}
/* VIDEO MUTE LISTENER */
$(document).on('click','.vm-btn > label', function() {
  var current = state.active;
  if (!$(this).hasClass('vm-on')) {
    console.log('video muted for '+current);
    $(this).addClass('vm-on');
    $('.cube').addClass('cube-vm');
    outs[current].vm = true;
  }
  else {
    console.log('vidoe unmuted');
    $(this).removeClass('vm-on');
    $('.cube').removeClass('cube-vm');
    outs[current].vm = false;
  }
});
/* TAB NAVIGATION */
$(document).on('click', '.out-nav-item', function() {
  var oldOut = $('.nav-selected').data() ? $('.nav-selected').data().tab : 1;
  $('.nav-selected').removeClass('nav-selected');
  $(this).addClass('nav-selected');
  $('.active').removeClass('active');
  $('#out' + this.dataset.tab).addClass('active');
  $('#octagon').removeClass('p-out-' + oldOut);
  $('#octagon').addClass('p-out-' + this.dataset.tab);
  state.active = this.dataset.tab;
  var nextSource = outs[state.active].source;
  if (nextSource) {
    $('#src-'+nextSource).click();
  }
  else {
    $('.src > input').prop('checked', false);
  }

  console.log(outs);
});


/* SOURCE SELECTION LISTENER */
$(document).on('click', '.src', function() {
  var cur = state.active;
  var s = $(this).children('label').children(':last-child').html();
  console.log('switching '+cur+' to '+s);
  $('#src-' + s + ' input').prop('checked', true);
  var newClass = getMatrixClass(s);
  $('#o-'+cur+' .cube').removeClass('c-top c-front c-left c-right c-back c-bottom').addClass(newClass);
  outs[cur].source = s;
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

