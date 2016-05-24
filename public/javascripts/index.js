/* =============================
   CONSTANTS 
   ============================= */

var CANVAS_WIDTH = $(".sc-canvas").width();
var CANVAS_HEIGHT = $(".sc-canvas").height();

/* =============================
   MOBILE 
   ============================= */
   
if (mobile) {
  $(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop >= $(".sc-device").offset().top) {
      $(".sc-intro-right .sc-banner").hide();  
    } else {
      $(".sc-intro-right .sc-banner").show();  
    }  
  });
}
  
/* =============================
   Entry 
   ============================= */
//$('.sc-load-image').on('click', function() { $('#loader').click();return false;});

var imageLoader = document.getElementById('loader');
imageLoader.addEventListener('change', handleImage, false);

var fbImageLoader = document.getElementById('fbLoader');
fbImageLoader.addEventListener('click', handleFbImage, false);

if (!mobile) {
  var urlImageLoader = document.getElementById('urlLoader');
  urlImageLoader.addEventListener('click', handleUrlImage, false);

  var webcamImageLoader = document.getElementById('webcamLoader');
  webcamImageLoader.addEventListener('click', handleWebcamImage, false);
}
   
var canvas = document.getElementById('canvas-front');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var ctx = canvas.getContext('2d');

var bgCanvas = document.getElementById('canvas-back');
bgCanvas.width = CANVAS_WIDTH;
bgCanvas.height = CANVAS_HEIGHT;
var bgCtx = bgCanvas.getContext('2d');


document.getElementById("download-canvas")
  .addEventListener('click', Util.downloadCanvas, false);

// handler for image-upload from local
function handleImage(e){
  if (window.FileReader) {
    if (mobile) {
      var mpImg = new MegaPixImage(e.target.files[0]);  
      var tempCanvas = document.createElement('tempCanvas');
      mpImg.render(tempCanvas, { width: 400, height: 400 });
      var mpImgData = tempCanvas.toDataURL("image/png");
      
      new MeatImage(mpImgData);
      $(".sc-camera").hide();
      $(".uploadModal").modal('hide');
      
    } else {
      var reader = new FileReader();
      
      reader.onload = function(event){
        new MeatImage(event.target.result);
        $(".sc-camera").hide();
        $(".uploadModal").modal('hide');
      };
     
      reader.readAsDataURL(e.target.files[0]);     
    }
  } else {
    alert("File Reader not supported");
  }
}

// handler for image-upload from URL
function handleUrlImage(e) {
  var url =  $(".sc-urlLoaderInput").val();
  if (!Util.isValidUrl(url)) {
    Util.handleError("invalid url");
  } else {
    Util.getImageFromUrl(url, function(dataUrl) {
      console.log(dataUrl);
      new MeatImage(dataUrl);
      $(".sc-camera").hide();
      $(".uploadModal").modal('hide');
    });
  }
}

function handleFbImage(e) {
  var url = $(".sc-fb-profile-picture").attr("src");  
  Util.getImageFromUrl(url, function(dataUrl) {
    new MeatImage(dataUrl);
    $(".sc-camera").hide();
    $(".uploadModal").modal('hide');
  });
}

function handleWebcamImage(e) {
  var videoElement = $("#video-stream"); 
  var cameraIcon = $(".sc-camera");
  var uploadImageModal = $(".uploadModal");
  var uploadButton = $(".sc-load-image");
  var takePictureButton = $(".sc-take-picture");
  
  videoElement.show();
  takePictureButton.show();
  
  cameraIcon.hide();
  uploadImageModal.modal('hide');
  uploadButton.hide();
  
  uploadButton.click(function(){
    videoElement.hide();
  });
  
  takePictureButton.click(function(){ 
    canvas.width = 360;
    canvas.height = 360;
     
    /*
    ctx.translate(480, 0);
    ctx.scale(-1, 1);
    bgCtx.translate(480, 0);
    bgCtx.scale(-1, 1);   
    */
   
    ctx.drawImage(video, 0, 0, 480, 480, 0, 0, 360, 360);
    
    new MeatImage(canvas.toDataURL());
    videoElement.hide();
    takePictureButton.hide();
  });
  
  var video = document.querySelector("#video-stream");
  /*
  video.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(-1, 1); filter: FlipH;";
    */
    
  navigator.getUserMedia = (
    navigator.getUserMedia || 
    navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia || 
    navigator.oGetUserMedia);
  
  if (navigator.getUserMedia) {       
  	navigator.getUserMedia({
  	  audio: false,
  	  video: true
  	}, handleVideo, Util.handleError);
  } else {
    Util.handleError("The webcam is not supported on your broswer, please try it on Chrome!");
  }
  
  function handleVideo(stream) {
  	video.src = window.URL.createObjectURL(stream);
  }
  
}

