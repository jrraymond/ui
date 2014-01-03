var srcs = Object.freeze({ pc: {}, mac: {}, hdmi: {}, vga: {}, dvd: {}, bluray: {} });
var outs = { out1 : { name: 'west', source: undefined, on: false, vm: false },
             out2 : { name: 'east', source: undefined, on: false, vm: false },
             out3 : { name: 'north' , source: undefined, on: false, vm: false },
             active : 1 };


/* POWER BUTTON LISTENER */
$(document).on("click", ".pwr-btn > input", function() {
  var current = this.dataset.output;
  if ($(this).prop("checked")) {
    console.log("power on for "+current);
    $(".cube").removeClass("c-top");
    outs[current].on = true;
  }
  else {
    console.log("power off for"+current);
    $(".cube").addClass("c-top");
    outs[current].on = false;
  }
  
});
/* VIDEO MUTE LISTENER */
$(document).on("click",".vm-btn > input", function() {
  var current = this.dataset.output;
  if ($(this).prop("checked")) {
    console.log("video muted for "+current);
    $(".cube").addClass("cube-vm");
    outs[current].vm = true;
  }
  else {
    console.log("vidoe unmuted");
    $(".cube").removeClass("cube-vm");
    outs[current].vm = false;
    console.log("video muted for "+current);
  }
});
/* TAB NAVIGATION */
$(document).on("click", ".out-nav-item", function() {
  var oldOut = $(".nav-selected").data() ? $(".nav-selected").data().tab : "none";
  $(".nav-selected").removeClass("nav-selected");
  $(this).addClass("nav-selected");
  $(".active").removeClass("active");
  $("#" + this.dataset.tab).addClass("active");
  $("#p-cube").removeClass("p-" + oldOut);
  $("#p-cube").addClass("p-" + this.dataset.tab);
  outs.active = this.dataset.tab;
  updateState();
});

var updateState = function() {
  console.log("state updated");
};

/* SOURCE SELECTION LISTENER */
$(document).on("click", ".src", function() {
  var source = $(this).children("label").children(":last-child").html();
  console.log('switching to '+source);
  selectSource(source);
  var newClass = getMatrixClass(source);
  $(".cube").removeClass("c-top c-front c-left c-right c-back c-bottom").addClass(newClass);
});

/* SELECTS SOURCE BUTTON */
function selectSource(s) {
  $("#src-" + s + " input").prop('checked', true);
}

/* Returns correct class */
function getMatrixClass(s) {
  switch(s) {
    case "mac":
      return "c-front";
      break;
    case "pc":
      return "c-bottom";
      break;
    case "vga":
      return "c-back";
      break;
    case "dvd":
      return "c-right";
      break;
    case "hdmi":
      return "c-left";
      break;
    case "bluray":
      return "c-top"
      break;
  }
}



$(".cube").addClass("c-top");
$('#switch_mute').click();
$('#switch_mute').click();
$('#switchW1').click();


/* Prevent dragging of images */
$("img").on("dragstart", function(event) {
  event.preventDefault();
}); 



/* SETS DATE */
var findMonth = function(num) {
  switch (num) {
    case 0 :
      return "Jan";
    case 1 :
      return "Feb";
    case 2 :
      return "Mar";
    case 3 :
      return "Apr";
    case 4 :
      return "May";
    case 5 :
      return "Jun";
    case 6 :
      return "Jul";
    case 7 :
      return "Aug";
    case 8 :
      return "Sep";
    case 9 :
      return "Oct";
    case 10 :
      return "Nov";
    case 11 :
      return "Dec";
  }
}
var daySuffix = function(num) {
  switch (num) {
    case (num === 1 || num === 21 || num === 31) : 
      return "st";
    case (num === 2 || num === 22) : 
      return "nd";
    case (num === 3 || num === 23) :
      return "rd";
    default :
      return "th";
  }
}

/* Pads single digits with zeros */
var pad = function(x) {
  return x < 10 ? "0"+x : x;
};

/* converts hours in military to tuple of hours, am/pm */
var fromMilitary = function(hours) {
  if (hours >= 12) {
    hours = hours - 12;
    hours = (hours === 0) ? 12 : hours;
    return [hours, "pm"];
  }
  else {
    return [hours, "am"];
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

  $("#clock").html(h2[0] + ":" + m + ":" + s + " " + h2[1]);


  $("#month").html(month + " ");
  $("#day").html(day);
  $("#daySuffix").html(daySuff);
};
/* calls updateTime every second */
updateTime();
setInterval(updateTime, 1000);

/* VOLUME KNOB MUTE CONTROL */
$(document).on("click","#vol-mute", function() {
  if (!$(this).hasClass("vol-muted-m")) {
    $(this).addClass("vol-muted-m");
    $("#vol-switches > label").each(function() {
      $(this).hide();
      //if ($(this).children("div").children("div").hasClass("vol-checked")) {
       // $(this).children("div").children("div").addClass("vol-muted")
      //}
    });
    $("input[name='switch']").attr('disabled',true);
  }
  else {
    $(this).removeClass("vol-muted-m");
    $("#vol-switches > label").each(function() {
      $(this).show();
      //if ($(this).children("div").children("div").hasClass("vol-checked")) {
       // $(this).children("div").children("div").removeClass("vol-muted")
      //}
    });
    $("input[name='switch']").attr('disabled',false);
  }
});
  /* VOLUME KNOB LEVEL CONTROL */
$(document).on("click", ".vol-c", function() {
  var label = $(this).parent().parent();
  if (!$("#vol-mute").hasClass("vol-muted-m")) {
    label.nextAll("label").each(function() {
      $(this).children("div").children("div").removeClass("vol-checked");
    });
    label.prevAll("label").not("#switch-m-l").each(function() {
      $(this).children("div").children("div").addClass("vol-checked");
    });
    $(this).addClass("vol-checked");
  }
});
