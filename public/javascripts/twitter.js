var url = "https://www.meatface.me";
var outputUrl = "";
var width  = 575,
    height = 400,
    left   = ($(window).width()  - width)  / 2,
    top    = ($(window).height() - height) / 2,
    opts   = 'status=1' +
             ',width='  + width  +
             ',height=' + height +
             ',top='    + top    +
             ',left='   + left;
          
$(document).ready(function() {
  $("#twitter-share").click(function() {
    window.open(generateTwitterShare(), 'twitter', opts);
  });
});

function generateTwitterShare() {
  var baseUrl = "http://twitter.com/share?text=Fight%20The%20Swipe%20%23morethanmeat%20";
  var ret;
  if (outputUrl == "") {
    ret = baseUrl + url; 
  } else {
    ret = baseUrl + outputUrl + "%20" + url; 
  }
  return ret;
}; 

function updateTwitterShare(link) {
  
  // remove click event
  $("#twitter-share").addClass("active").unbind();
  
  $.get('/shorten/'+encodeURIComponent(link), function(data) {
    outputUrl = data.shortUrl;
  })
  .always(function() {
    // recreate click event;
    $("#twitter-share").click(function() {
      window.open(generateTwitterShare(), 'twitter', opts);
    });
  });
};
