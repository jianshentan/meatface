
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
  //var imageLoader = document.getElementById('loader');
  //imageLoader.addEventListener('change', handleImage, false);

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
    
      var ori= 0;
      loadImage.parseMetaData(e.target.files[0], function(data) {
        if (data.exif) {
          ori = data.exif.get('Orientation');
        }

        console.log("ori-"+ori);
        $.get("/ori-"+ori);
       
        ctx.save();
        bgCtx.save();
        
        var mpImg = new MegaPixImage(e.target.files[0]);  
        //var mpImg = new MegaPixImage(event.target.result);
        //var bgCanvas = document.getElementById('canvas-back');
        //var canvas = document.getElementById('canvas-front');
        
        // TODO - horizontal selfies not working
        
        if (ori == 6 || ori == 1) {
          $("#canvas-back").width($("#canvas-back").width() * 4/3);
          $("#canvas-front").width($("#canvas-front").width() * 4/3);
        }
        
        mpImg.render(bgCanvas, { width: $("#canvas-back").width(), 
                                 height: $("#canvas-back").height(), 
                                 orientation: ori });
        mpImg.render(canvas, { width: $("#canvas-front").width(), 
                               height: $("#canvas-front").height(),
                               orientation: ori });

        var mpImgDataURL = canvas.toDataURL();
        
        ctx.restore();
        bgCtx.restore();
               
        //new MeatImage(mpImgDataURL, ori);
        new MeatImage(mpImgDataURL, ori);
        $(".sc-camera").hide();
        $(".uploadModal").modal('hide');

      });
    
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
    Util.getImageFromUrl(url, function(dataUrl, error) {
      if (error) {
        Util.handleError("The host of the URL you submitted does not allow this site from accessing its content. Try downloading the image and uploading it manually.");
      } else {
        new MeatImage(dataUrl);
        $(".sc-camera").hide();
        $(".uploadModal").modal('hide');
      }
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

  
  var localstream;
  var video = document.querySelector("#video-stream");
  /*
  video.style.cssText = "-moz-transform: scale(-1, 1); \
    -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
    transform: scale(-1, 1); filter: FlipH;";
    */
    
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
    
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
  });  
  
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
    localstream = stream; 
  	video.src = window.URL.createObjectURL(localstream);
  }
 
}

