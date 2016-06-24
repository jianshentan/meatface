var accessToken = "922f2202ac7fd7d5d02797784322b3d6230a50d9";
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
  
  getShortUrl(link, function(shortUrl) {
    outputUrl = shortUrl;
    $("#twitter-share").click(function() {
      window.open(generateTwitterShare(), 'twitter', opts);
    });
  });

};

function getShortUrl(longUrl, cb) {
  $.get("https://api-ssl.bitly.com/v3/shorten?access_token="+accessToken+"&longUrl=http://"+encodeURIComponent(longUrl), function(res) {
    cb(res.data.url);
  });
}