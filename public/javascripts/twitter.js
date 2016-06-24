var accessToken = "922f2202ac7fd7d5d02797784322b3d6230a50d9";
var url = "www.meatface.me";
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
  var ret;
  if (outputUrl == "") {
    ret = "http://twitter.com/share?text=Meat-face%20yourself%20now%20%23morethanmeat%20" + url; 
  } else {
    ret = "http://twitter.com/share?text=Want%20to%20see%20me%20meat-faced?%20" + outputUrl + "%20%23morethanmeat%20" + url; 
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