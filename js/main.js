/* Prevent dragging of images */
$("img").on("dragstart", function(event) {
  event.preventDefault();
}); 


/* Response to tapping of sources  */
$(".src-img").on("click", function() {
  var that = $(this);
  var othersHidden = new $.Deferred()
  $.when(othersHidden).then(function() {
    //that.parent().parent().css("height", "90%");
    //that.parent().parent().parent().css("height", "100%");
    //that.children("img").
    that.parent().animate({ height: "100%", width: "100%"});
    that.parent().parent().attr("class","col-xs-12");
    that.parent().children(".src-info").fadeIn();
    /*
    that.parent().parent().parent().children().last().animate({
      opacity : "show"}, function() {
        $(this).parent().attr("class", "col-xs-4");
        $(this).parent().parent().children().last().addClass("col-xs-8");
      }
    );
    */
      
  });

  //hide sources that were not selected
  $(".src-thumbnail").not($(this).parent()).parent().fadeOut({ 
    duration : "slow",
    //always : btnHidden(this),
    done : function(){
      othersHidden.resolve();
    }
  });
});

/* Closes view of source */
$(".close-btn").on("click", function() {
  var srcClosed = new $.Deferred()
  //show hidded sources once selected source has been shrunk
  $.when(srcClosed).then(function() {
    console.log($(".src-thumbnail").not($(this).parent().parent()));
    $(".src-thumbnail").not($(this).parent().parent()).each(function() {
      $(this).parent().fadeIn({
        duration : "slow"
      });
    });
  });
  //shrink current source
  console.log($(this).parent());
  console.log($(this).parent().parent());
  console.log($(this).parent().parent().parent());
  $(this).parent().fadeOut();
  $(this).parent().parent().animate({height : "90px", width : "90px"});
  $(this).parent().parent().parent().attr("class","col-xs-4");
  srcClosed.resolve();

  
  

});



/* Sets Date */

/* called when source btns are hidden */
function btnHidden(that) {
  console.log($(that).parent());
  //$(that).parent().attr("class", "col-xs-12");
};

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

updateTime();

setInterval(updateTime, 1000);

/* TAB NAVIGATION */
$(document).on("click", ".out-nav-item", function() {
  $(".nav-selected").removeClass("nav-selected");
  $(this).addClass("nav-selected");
  $(".active").removeClass("active");
  $("#" + this.dataset.tab).addClass("active");
});

/* TURNS OUTLINE OF KNOB WHEN MUTED */
$("#switch_mute").on("click", function() {
  if ($(this).is(':checked')) {
    $("#vol-den").addClass("red-shadow");
    $("#switch_mute_label span").html("UNMUTE").addClass("vol-checked-muted");
    $(".switch_label").each(function() {
      if ($(this).children("span").children("i").hasClass("vol-checked")) {
        $(this).children("span").children("i").addClass("vol-checked-muted")
      }
    });
    $("input[name='switch']").attr('disabled',true);
  }
  else {
    $("#vol-den").removeClass("red-shadow");
    $("#switch_mute_label span").html("MUTE").removeClass("vol-checked-muted");
    $(".switch_label").each(function() {
      if ($(this).children("span").children("i").hasClass("vol-checked-muted")) {
        $(this).children("span").children("i").removeClass("vol-checked-muted");
      }
    });
    $("input[name='switch']").attr('disabled',false);
  }
});

/* Changes color of volume knob ratchets */
$(".vol-switch label").not("#switch_mute_label").on("click", function() {
  if (!$("#switch_mute").is(":checked")) {
    $(this).nextAll("label").each(function() {
      $(this).children("span").children("i").removeClass("vol-checked");
    });

    $(this).prevAll("label").each(function() {
      $(this).children("span").children("i").addClass("vol-checked");
    });

    $(this).children("span").children("span").addClass("vol-checked");
  }
});



$('#switch_mute').click();
$('#switch_mute').click();
$('#switch_1').click();
