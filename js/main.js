/* Prevent dragging of images */
$("img").on("dragstart", function(event) {
  event.preventDefault();
}); 

/* Response to tapping of sources 
$(".source-btn").on("click", function() {
  $(".source-btn").not(this).parent().hide({ 
    duration : "slow", 
    always : btnHidden(this)
  });
});

called when source btns are hidden 
function btnHidden(that) {
  console.log($(that).parent());
  //$(that).parent().attr("class", "col-xs-12");
};*/
