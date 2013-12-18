var output = 1;
var output1;
var output2;
var output3;

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
  console.log("switching to output: " + this.dataset.tab);
  switch (this.dataset.tab) {
    case "out-2":
      output = 2;
      console.log("selecting source " + output2 + " for output 2");
      selectSource(output2);
      break;
    case "out-3":
      output = 3;
      console.log("selecting source " + output3 + " for output 3");
      selectSource(output3);
      break;
    default:
      output = 1;
      selectSource(output1);
      console.log("selecting source " + output1 + " for output 1");
  }
});

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

/* SOURCE SELECTION LISTENER */
$(document).on("click", ".src", function() {
  switch (output) {
    case 1:
      var oldS = output1;  
      break;
    case 2: 
      var oldS = output2;
      break;
    case 3:
      var oldS = output3;
      break;
  }
  var source = $(this).children("label").children(":last-child").html();
  updateOutput(source);
  selectSource(source);
  var vecs = getRotationVector(oldS, source);
  console.log('rotation vector from '+oldS+' to '+source);
  console.log(vecs);
  var matrix = new WebKitCSSMatrix($('#cube').css('webkitTransform'));
  for (var i=1;i<vecs.length;i++) {
    var matrix = getRotationMatrix(matrix, vecs[i], vecs[0]);
  }
  $('#cube')[0].style.webkitTransform = matrix;
});

/* SELECTS SOURCE BUTTON */
function selectSource(out) {
  $("#src-" + out + " input").prop('checked', true);
}

/* 3d vector object */
var Vector = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
/* function for matrix-vector multiplications */
WebKitCSSMatrix.prototype.transformVector = function(v) {
  return new Vector(this.m11*v.x + this.m12*v.y + this.m13*v.z, 
                    this.m21*v.x + this.m22*v.y + this.m23*v.z,
                    this.m31*v.x + this.m32*v.y + this.m33*v.z);
};

/* RETURNS LIST OF CORRECT CUBE ROTATION VECTORS
 *
 * This relies on the representation of the unfolded cube as
 *            4
 *          6 1 5
 *            2
 *            3
 *  where 1->Mac, 2->DVD, 3->VGA, 4->BLURAY, 5->PC, 6->HDMI
 */
function getRotationVector(oldSource, newSource) {
  switch (oldSource) {
    case "MAC":
      switch (newSource) {
        case "MAC":
          return [0, new Vector(0, 0, 0)];
          break;
        case "PC":
          return [90, new Vector(0, -1, 0)];
          break;
        case "VGA":
          return [90, new Vector(-1, 0, 0), new Vector(-1, 0, 0)];
          break;
        case "HDMI":
          return [90, new Vector(0, 1, 0)];
          break;
        case "DVD":
          return [90, new Vector(1, 0, 0)];
          break;
        case "BLURAY":
          return [90, new Vector(-1, 0, 0)];
          break;
      }
      break;
    case "PC":
      switch (newSource) {
        case "MAC":
          return [90, new Vector(0, 1, 0)];
          break;
        case "PC":
          return [0, new Vector(0, 0, 0)];
          break;
        case "VGA":
          return [90, new Vector(0, -1, 0)];
          break;
        case "HDMI":
          return [90, new Vector(0, -1, 0), new Vector(0, -1, 0)];
          break;
        case "DVD":
          return [90, new Vector(1, 0, 0)];
          break;
        case "BLURAY":
          return [90, new Vector(-1, 0, 0)];
          break;
      }
      break;
    case "VGA":
      switch (newSource) {
        case "MAC":
          return [90, new Vector(1, 0, 0), new Vector(1, 0, 0)]
          break;
        case "PC":
          return [90, new Vector(0, 1, 0)];
          break;
        case "VGA":
          return [0, new Vector(0, 0, 0)];
          break;
        case "HDMI":
          return [90, new Vector(0, 1, 0)];
          break;
        case "DVD":
          return [90, new Vector(-1, 0, 0)];
          break;
        case "BLURAY":
          return [90, new Vector(1, 0, 0)];
          break;
      }
      break;
    case "HDMI":
      switch (newSource) {
        case "MAC":
          return [90, new Vector(0, -1, 0)];
          break;
        case "PC":
          return [90, new Vector(0, -1, 0), new Vector(0, -1, 0)];
          break;
        case "VGA":
          return [90, new Vector(0, 1, 0)];
          break;
        case "HDMI":
          return [0, new Vector(0, 0, 0)];
          break;
        case "DVD":
          return [90, new Vector(1, 0, 0)];
          break;
        case "BLURAY":
          return [90, new Vector(-1, 0, 0)];
          break;
      }
      break;
    case "DVD":
      switch (newSource) {
        case "MAC":
          return [90, new Vector(-1, 0, 0)];
          break;
        case "PC":
          return [90, new Vector(0, -1, 0)];
          break;
        case "VGA":
          return [90, new Vector(1, 0, 0)];
          break;
        case "HDMI":
          return [90, new Vector(0, 1, 0)];
          break;
        case "DVD":
          return [0, new Vector(0, 0, 0)];
          break;
        case "BLURAY":
          return [90, new Vector(1, 0, 0), new Vector(1, 0, 0)];
          break;
      }
      break;
    case "BLURAY":
      switch (newSource) {
        case "MAC":
          return [90, new Vector(0, -1, 0)];
          break;
        case "PC":
          return [90, new Vector(1, 0, 0)];
          break;
        case "VGA":
          return [90, new Vector(0, 1, 0)];
          break;
        case "HDMI":
          return [90, new Vector(-1, 0, 0)];
          break;
        case "DVD":
          return [90, new Vector(0, 1, 0), new Vector(0, 1, 0)];
          break;
        case "BLURAY":
          return [0, new Vector(0, 0, 0)];
          break;
      }
      break;
    default:
      return [0, new Vector(0, 0, 0)];
  }

}
/* Returns the new matrix of the cube */
function getRotationMatrix(matrix, vector, angle) {
  console.log('vector');
  console.log(vector);
  var vat = matrix.transformVector(vector);
  console.log('vector axis translated');
  console.log(vat);
  return matrix.rotateAxisAngle(vat.x, vat.y, vat.z, angle);
}


/* 3D TRANSFORMATIONS */
var xAngle = 0, yAngle = 0;
var matrix;
//90deg about x-axis
var xAxis = new Vector(1, 0, 0);
var xAm = new Vector(-1, 0, 0);
//90 deg about y-axis
var yAxis = new Vector(0, 1, 0);
var yAm = new Vector(0, -1, 0);
//90deg about z-axis
var zAxis = new Vector(0, 0, 1);
var zAm = new Vector(0, 0, -1);

var angle = 90;
var cM;
var nM;

$(document).on('keydown',function(e) {
  cM = new WebKitCSSMatrix($("#cube").css("webkitTransform"));
  switch (e.keyCode) {
    case 37:  //left
      yat = cM.transformVector(yAm);
      nM = cM.rotateAxisAngle(yat.x, yat.y, yat.z, angle);
      break;
    case 38: //up
      xat = cM.transformVector(xAxis);
      nM = cM.rotateAxisAngle(xat.x, xat.y, xat.z, angle);
      break;
    case 39: //right
      yat = cM.transformVector(yAxis);
      nM = cM.rotateAxisAngle(yat.x, yat.y, yat.z, angle);
      break;
    case 40: //down
      xat = cM.transformVector(xAm);
      nM = cM.rotateAxisAngle(xat.x, xat.y, xat.z, angle);
      break;
    default:
      zat = cM.transformVector(zAxis);
      nM = cM.rotateAxisAngle(zat.x, zat.y, zat.z, angle);
  }
  setTimeout(function() {
    $('#cube')[0].style.webkitTransform = nM;
  }, 5);
});


/* UPDATES THE CURRENT OUTPUT WITH THE GIVEN SOURCE */
function updateOutput(source) {
  console.log("switching output " + output + " to source " + source);
  var icon = getIcon(source);
  switch (output) {
    case 2:
      output2 = source;
      $("#out-2 i").remove();
      $("#out-2 > div > div").append(icon);
      break;
    case 3:
      output3 = source;
      $("#out-3 i").remove();
      $("#out-3 > div > div").append(icon);
      break;
    default:
      output1 = source;
      $("#out-1 i").remove();
      $("#out-1 > div > div").append(icon);
  }
}
/* RETURNS HTML STRING OF CORRECT ICON */
function getIcon(source) {
  switch (source) {
    case "VGA":
      return "<i class='cf icon-vga-nc-md cf-7x'></i>";
      break;
    case "HDMI":
      return "<i class='cf icon-hdmi-nc-detailed cf-7x'></i>";
      break;
    case "PC":
      return "<i class='fa fa-windows fa-7x'></i>";
      break;
    case "MAC":
      return "<i class='fa fa-apple fa-7x'></i>";
      break;
    case "DVD":
      return "<i class='cf icon-dvd-nc cf-7x'></i>";
      break;
    case "BLURAY":
      return "<i class='fa fa-dot-circle-o fa-7x'></i>";
      break;
    default:
      alert ("unknown source");
  }
}


$('#src-MAC').click();
$('#switch_mute').click();
$('#switch_mute').click();
$('#switchW1').click();
