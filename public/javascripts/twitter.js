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
  console.log("A");
  if (outputUrl == "") {
    console.log("B");
    ret = baseUrl + url; 
  } else {
    console.log("C");
    ret = baseUrl + outputUrl + "%20" + url; 
  }
  console.log("D");
  console.log("ret: " + ret);
  console.log("baseUrl: " + baseUrl);
  console.log("url: " + url);
  return ret;
}; 

function updateTwitterShare(link) {
  
  console.log("UPDATE is called");
  
  // remove click event
  $("#twitter-share").addClass("active").unbind();
  
  $.get('/shorten/'+encodeURIComponent(link), function(data) {
    outputUrl = data.shortUrl;
    
    // recreate click event;
    $("#twitter-share").click(function() {
      console.log("CLICKED");
      window.open(generateTwitterShare(), 'twitter', opts);
    });
    
  });
};
