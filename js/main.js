var SOURCE = Object.freeze({ PC: 'pc', MAC: 'mac', HDMI: 'hdmi', VGA: 'vga', DVD: 'dvd', BLURAY: 'bluray' });
var OUTPUT = Object.freeze({ PROJECTOR: 'projector', TELEVISION: 'television' });

/* DYNAMICALLY CREATE PROJECTORS AND SOURCES */
var sources = { 1: SOURCE.MAC, 2: SOURCE.PC, 3: SOURCE.HDMI,
                4: SOURCE.VGA, 5: SOURCE.DVD };

var outs = { 1: { name: 'west', type: OUTPUT.PROJECTOR, source: undefined, on: false, vm: false },
             2: { name: 'east', type: OUTPUT.PROJECTOR, source: undefined, on: false, vm: false },
             3: { name: 'north', type: OUTPUT.TELEVISION, source: undefined, on: false, vm: false } };

var state = { active: 1};

var getSourceIcon = function(s, x) {
  switch(s) {
    case SOURCE.HDMI:
      return 'cf icon-hdmi cf-' + x + 'x';
    case SOURCE.VGA:
      return 'cf icon-vga cf-' + x + 'x';
    case SOURCE.MAC:
      return 'fa fa-apple fa-' + x + 'x';
    case SOURCE.PC:
      return 'fa fa-windows fa-' + x + 'x';
    case SOURCE.DVD:
      return 'cf icon-dvd cf-' + x + 'x';
    default:
      return 'cf icon-cmdr cf-' + x + 'x';
  }
};
var getOutputIcon = function(o) {
  switch(o) {
    case OUTPUT.PROJECTOR:
      return 'fa fa-video-camera';
    case OUTPUT.TELEVISION:
      return 'fa fa-desktop';
    default:
      return 'fa fa-video-camera';
  }
};

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
                    '<div class="cube c-6">'+
                      '<div class="face f-1">'+
                        '<i class="fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-2">'+
                        '<i class="fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-3">'+
                        '<i class="fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-4">'+
                        '<i class="fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-5">'+
                        '<i class="fa-7x"></i>'+
                      '</div>'+
                      '<div class="face f-6">'+
                        '<i class="fa-7x"></i>'+
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
      c++;
    }
  }
  $('#out-nav').html(navHtml);
};

addOutputs(outs);

var addSources = function(sources) {
  var html = '';
  $('.f-6 > i').addClass('cf icon-cmdr');
  for (var s in sources) {
    if (sources.hasOwnProperty(s)) {
      html += '<div class="src" id="src-'+sources[s]+'">'+
                '<input type="radio" name="source" data-face="'+s+'">'+
                '<label>'+
                  '<div><i class="'+getSourceIcon(sources[s], 2)+'"></i></div>'+
                  '<div>'+sources[s]+'</div>'+
                '</label>'+
              '</div>';
      $('.f-'+s+' > i').addClass(getSourceIcon(sources[s], 7));
      console.log('s: '+s+'\tsources[s]: '+sources[s]+'\t'+getSourceIcon(sources[s],7));
    }
  }
  $('#src-group').html(html);
};

addSources(sources);

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
    $('#o-'+state.active+' .cube').addClass('c-top');
    current.on = false;
  }
});
var warming = function() {
  var label = $('#o-'+state.active+' .pwr-btn > label');
  if (label.hasClass('warming')) {
    label.removeClass('warming');
  }
  else {
    label.addClass('warming');
  }
};
var powerOn = function(that) {
  $(that).removeClass('warming');
  $(that).addClass('pwr-on');
  $('#o-'+state.active+' .cube').removeClass('c-top');
};
/* VIDEO MUTE LISTENER */
$(document).on('click','.vm-btn > label', function() {
  var current = state.active;
  if (!$(this).hasClass('vm-on')) {
    $(this).addClass('vm-on');
    $('.cube').addClass('cube-vm');
    outs[current].vm = true;
  }
  else {
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

});


/* SOURCE SELECTION LISTENER */
$(document).on('click', '.src', function() {
  var cur = state.active;
  var s = $(this).children('label').children(':last-child').html();
  console.log('switching '+cur+' to '+s);
  $('#src-' + s + ' input').prop('checked', true);
  var newClass = $(this).children('input').data('face');
  console.log('new Class: '+newClass);
  $('#o-'+cur+' .cube').removeClass('c-1 c-2 c-3 c-4 c-5 c-6').addClass('c-'+newClass);
  outs[cur].source = s;
});


/* Returns correct class */
var getMatrixClass = function(s) {
  switch(s) {
    case 'mac':
      return 'c-front';
    case 'pc':
      return 'c-bottom';
    case 'vga':
      return 'c-back';
    case 'dvd':
      return 'c-right';
    case 'hdmi':
      return 'c-left';
    case 'bluray':
      return 'c-top';
  }
};


/* Initial configuration */
//   /* vga */$('.cube').addClass('c-6');
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
};
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
};

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
};

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
      $(this).children('div').children('div').addClass('vol-muted');
      if ($(this).children('div').children('div').hasClass('vol-checked')) {
        $(this).children('div').children('div').addClass('vol-checked-muted');
      }
    });
    $('input[name="switch"]').attr('disabled',true);
  }
  else {
    $(this).removeClass('vol-muted-m');
    $('#vol-switches > label').each(function() {
      $(this).children('div').children('div').removeClass('vol-muted');
      if ($(this).children('div').children('div').hasClass('vol-checked')) {
        $(this).children('div').children('div').removeClass('vol-checked-muted');
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
