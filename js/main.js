/* Prevent dragging of images */
$("img").on("dragstart", function(event) {
  event.preventDefault();
}); 


/* Response to tapping of sources  */
$(".source-btn").on("click", function() {
  var that = $(this);
  var othersHidden = new $.Deferred()
  $.when(othersHidden).then(function() {
    that.parent().css("height", "90%");
    that.parent().parent().css("height", "100%");
    that.children("img").
    that.animate({ height: "100%", width: "100%"});
    that.parent().attr("class","col-xs-12");
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
  $(".source-btn").not(this).parent().hide({ 
    duration : "slow",
    //always : btnHidden(this),
    done : function(){othersHidden.resolve();}
  });
});



/* called when source btns are hidden */
function btnHidden(that) {
  console.log($(that).parent());
  //$(that).parent().attr("class", "col-xs-12");
};
