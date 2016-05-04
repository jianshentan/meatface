/* =============================
   Utility Class
   ============================= */
 
var Util = {
  dataURLToBinary: function(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    //return new Blob(array, {type: "application/octet-stream"});
    return array;
  },
  /**
   * corners is an object with propeties: 
   *   "topleft", "topRight", "bottomLeft", and "bottomRight"
   */
  drawCorners: function(corners) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(corners.topLeft.x, corners.topLeft.y);
    ctx.lineTo(corners.topRight.x, corners.topRight.y);
    ctx.lineTo(corners.bottomRight.x, corners.bottomRight.y);
    ctx.lineTo(corners.bottomLeft.x, corners.bottomLeft.y);
    ctx.lineTo(corners.topLeft.x, corners.topLeft.y);
    ctx.closePath();
    ctx.stroke();
  },
  
  downloadCanvas: function() {
    bgCtx.drawImage(canvas, 0, 0);
    var dt = bgCanvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  
    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    //dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
  
    this.href = dt;
  },
  
  hideUploadButton: function() {
    $(".sc-load-image").hide(); 
  },
  
  showUploadButton: function() {
    $(".sc-load-image").show(); 
  },
  
  showDownloadButton: function() {
    $("#download-canvas").show();
  },
  
  isValidUrl: function(str) {
    if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(str)) {
      return 1;
    } else {
      return -1;
    }   
  },
 
  getImageFromUrl: function(url, cb) {
    var img = document.getElementById('imageUrl');
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      //return dataURL;  
      cb(dataURL);
    }
    img.src = url;
    //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  },
  
  handleError: function(str) {
    if (str) {
      alert(str);
    } else {
      alert("Errored. Please try again.");
    }
    
    Util.loading(false);
    Util.showDownloadButton();
    Util.showUploadButton();
  },
  
  loading: function(flag, cb) {
    if (flag) {
      $("#loading-screen").slideDown();
    } else {
      $("#loading-screen").slideUp();    
    }
  },
  
  /* TODO: not working */
  uploadImage: function(cb) {
    bgCtx.drawImage(canvas, 0, 0);
    var dt = bgCanvas.toDataURL('image/png');
    
    $.post('/upload', { img : dt })
    .done(function(data) {
      cb(null, data.url);
      console.log(data); 
    })
    .fail(function(xhr, textStatus, errorThrown) {
      cb(textStatus, null);
    });
  },
  
  getTodayDate: function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd;
    } 
    if(mm<10) {
      mm='0'+mm;
    } 
    today = mm+'-'+dd+'-'+yyyy;
    return today;    
  }
  
  
};
