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


/* called when source btns are hidden */
function btnHidden(that) {
  console.log($(that).parent());
  //$(that).parent().attr("class", "col-xs-12");
};
