/* =============================
   Meat Image Class
   ============================= */
 
function MeatImage(src, ori) {
  $.get("/pre-pre-ori-"+ori);
  this.dataUrl = null;
  this.width = null;
  this.height = null;
  this.faces = [];
  
  this.img = new Image();
  this.img.src = src;
  this.ori = ori || null;
  
  //load img to get img data
  var meatImage = this;
  this.img.onload = function() {
    meatImage.width = meatImage.img.width;
    meatImage.height = meatImage.img.height;
    
    $.get("/pre-ori-"+ori);
    if (ori) {
      meatImage.renderImage(ori);
    } else {
      meatImage.renderImage();
    }
    Util.hideUploadButton();
  };
  
  // show loading screen
  Util.loading(true); 
}
  
MeatImage.prototype = {
  
  constructor: MeatImage,
  
  // dev only
  printObject: function() {
    console.log(this.dataUrl);
    console.log(this.getBinaryImage());
  },
 
  renderImage: function(ori) {
    // dynamically crop image to fit in canvas 
       
    var imgWidth = this.img.width;
    var imgHeight= this.img.height;
    
    // if img is portrait
    if (imgHeight > imgWidth) {
      ctx.drawImage(this.img, 
        0, (imgHeight - imgWidth)/2, 
        imgWidth, imgHeight,
        0, 0, canvas.width, canvas.width * imgHeight / imgWidth);
      bgCtx.drawImage(this.img, 
        0, (imgHeight - imgWidth)/2, 
        imgWidth, imgHeight,
        0, 0, canvas.width, canvas.width * imgHeight / imgWidth); 
    }
    // if img is landscape
    else {
      ctx.drawImage(this.img, 
        (imgWidth - imgHeight)/2, 0, 
        imgWidth, imgHeight,
        0, 0, canvas.height * imgWidth / imgHeight, canvas.height);
      bgCtx.drawImage(this.img, 
        (imgWidth - imgHeight)/2, 0, 
        imgWidth, imgHeight,
        0, 0, canvas.height * imgWidth / imgHeight, canvas.height);
    }   
     
    this.dataUrl = canvas.toDataURL();
    this.microsoftFaceDetect();
    //this.printObject();
  },
  
  microsoftFaceDetect: function() {
    var url = "https://api.projectoxford.ai/face/v1.0/detect?";
    var params = {
      // Request parameters
      //"returnFaceId": "false",
      "returnFaceLandmarks": "true"
      //"returnFaceAttributes": "age",
    };
    
    var meatImage = this;
    
    $.ajax({
      url: url + $.param(params),
      beforeSend: function(xhrObj){
        // Request headers
        xhrObj.setRequestHeader("Content-Type","application/octet-stream");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","39ffc0ca0d4b47bf905a0abfe690dfe2");
      },
      type: 'POST',
      data: meatImage.getBinaryImage(),
      processData: false
    })
    .done(function(data) {
      // no faces detected
      if (data.length <= 0) {
        Util.handleError("no faces detected");  
      } else {
        for (var i = 0; i < data.length; i++) {
          var face = new Face(data[i], meatImage);
          meatImage.faces.push(face);
        }
        meatImage.onFaceDetect();
      }
      
    });
    
  },
  
  onFaceDetect: function() { 
    async.each(this.faces, function(face, cb) {
      face.drawMeat(cb);
    }, function(err) {
      if (err) {
        return;
      }
      // upload image retrieves the URL that the image is located at
      Util.uploadImage(function(err, url) {
        if (!err) {
          Util.loading(false);
          Util.showDownloadButton();
          Util.showUploadButton();  
          updateFbShare(url);
          updateTwitterShare(url);
        } else {
          Util.handleError(err);
        }
      });
    });
    
  },
  
  getBinaryImage: function() {
     return Util.dataURLToBinary(this.dataUrl);
  }
};