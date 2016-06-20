
/* =============================
   Face Class
   ============================= */
   
var meatSrcList = [{
    src: "../images/meat1.png",
    type: "steak"
  }, {
    src: "../images/meat2.png",
    type: "steak"
  }, {
    src: "../images/meat3.png",
    type: "steak"
  }, {
    src: "../images/meat4.png",
    type: "steak"
  }, {
    src: "../images/meat5.png",
    type: "steak"
  }];

function Face(data, meatImage) {
   this.meatImage = meatImage;
   this.meat = meatSrcList[Math.floor(Math.random() * meatSrcList.length)];
   this.width = meatImage.width;
   this.height = meatImage.height;
    
   // FACE 
   this.faceWidth = data.faceRectangle.width;
   this.faceHeight = data.faceRectangle.height;
   this.scaleFactor = this.faceWidth / 10;
   
   this.faceCorners = {
      topLeft: { 
         x: data.faceRectangle.left, 
         y: data.faceRectangle.top  
      },
      topRight: {
         x: data.faceRectangle.left + data.faceRectangle.width,
         y: data.faceRectangle.top
      },
      bottomLeft: {
         x: data.faceRectangle.left,
         y: data.faceRectangle.top + data.faceRectangle.height
      },
      bottomRight: {
         x: data.faceRectangle.left + data.faceRectangle.width,
         y: data.faceRectangle.top + data.faceRectangle.height
      }
   };
  
   // LEFT EYE
   this.leftEye = data.faceLandmarks.pupilLeft;
   
   this.leftEyeCorners = {
      topLeft: {
         x: data.faceLandmarks.eyeLeftOuter.x,
         y: data.faceLandmarks.eyeLeftTop.y
      },
      topRight: {
         x: data.faceLandmarks.eyeLeftInner.x,
         y: data.faceLandmarks.eyeLeftTop.y
      },
      bottomLeft: {
         x: data.faceLandmarks.eyeLeftOuter.x,
         y: data.faceLandmarks.eyeLeftBottom.y
      },
      bottomRight: {
         x: data.faceLandmarks.eyeLeftInner.x,
         y: data.faceLandmarks.eyeLeftBottom.y
      }
   };
   
   this.leftEye.width = 
      this.leftEyeCorners.topRight.x - this.leftEyeCorners.topLeft.x;
   this.leftEye.height = 
      this.leftEyeCorners.bottomLeft.y - this.leftEyeCorners.topLeft.y;
      
   // RIGHT EYE
   this.rightEye = data.faceLandmarks.pupilRight;
   
   this.rightEyeCorners = {
      topLeft: {
         x: data.faceLandmarks.eyeRightInner.x,
         y: data.faceLandmarks.eyeRightTop.y
      },
      topRight: {
         x: data.faceLandmarks.eyeRightOuter.x,
         y: data.faceLandmarks.eyeRightTop.y
      },
      bottomLeft: {
         x: data.faceLandmarks.eyeRightInner.x,
         y: data.faceLandmarks.eyeRightBottom.y
      },
      bottomRight: {
         x: data.faceLandmarks.eyeRightOuter.x,
         y: data.faceLandmarks.eyeRightBottom.y
      }
   };
    
   this.rightEye.width = 
      this.rightEyeCorners.topRight.x - this.rightEyeCorners.topLeft.x;
   this.rightEye.height = 
      this.rightEyeCorners.bottomLeft.y - this.rightEyeCorners.topLeft.y;
      
   // MOUTH
   this.leftMouth = data.faceLandmarks.mouthLeft;
   this.rightMouth = data.faceLandmarks.mouthRight;
   
   this.mouthCorners = {
      topLeft: {
         x: data.faceLandmarks.mouthLeft.x,
         y: data.faceLandmarks.upperLipTop.y
      },
      topRight: {
         x: data.faceLandmarks.mouthRight.x,
         y: data.faceLandmarks.upperLipTop.y
      },
      bottomLeft: {
         x: data.faceLandmarks.mouthLeft.x,
         y: data.faceLandmarks.underLipBottom.y
      },
      bottomRight: {
         x: data.faceLandmarks.mouthRight.x,
         y: data.faceLandmarks.underLipBottom.y
      }
   };
       
   this.mouth = {
      width: this.mouthCorners.topRight.x - this.mouthCorners.topLeft.x,
      height: 2*(this.rightEyeCorners.bottomLeft.y - this.rightEyeCorners.topLeft.y)
   };
 
} 

Face.prototype = {
   
   constructor: Face,
   
   drawDetection: function() {
      Util.drawCorners(this.mouthCorners);
      Util.drawCorners(this.faceCorners);
      Util.drawCorners(this.leftEyeCorners);
      Util.drawCorners(this.rightEyeCorners);
   },
   
   // start of a chain function: DrawMeat --> ClipOutFeatures --> AddHashTag
   drawMeat: function(cb) {

      var img = new Image();
      img.src = this.meat.src;
      var face = this;
      img.onload = function() {
             
         var srcX = 0;
         var srcY = 0;
         var srcW = img.width;
         var srcH = img.height;
         var desX = face.faceCorners.topLeft.x - 2*face.scaleFactor;
         var desY = face.faceCorners.topLeft.y - 2*face.scaleFactor;
         var desW = face.faceWidth + 4*face.scaleFactor;
         var desH = face.faceHeight + 4*face.scaleFactor;
         ctx.drawImage(img, srcX, srcY, srcW, srcH, desX, desY, desW, desH);
         
         face.clipOutFeatures(cb);
         
      };
  
   },
   
   clipOutFeatures: function(cb) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      
      // LEFT EYE
      var leftEyeClip = {
         x: this.leftEyeCorners.topLeft.x - this.leftEye.width/2,
         y: this.leftEyeCorners.topLeft.y - this.leftEye.height/2,
         width: 2*this.leftEye.width,
         height: 2* this.leftEye.height
      };
      
      ctx.beginPath();
      var leftEyeGradient = ctx.createRadialGradient(
         leftEyeClip.x + leftEyeClip.width/2,
         leftEyeClip.y + leftEyeClip.height/2,
         this.faceWidth/10,
         leftEyeClip.x + leftEyeClip.width/2,
         leftEyeClip.y + leftEyeClip.height/2,
         0);
      leftEyeGradient.addColorStop(0,"rgba(0,0,0,0)");
      leftEyeGradient.addColorStop(0.5,"rgba(0,0,0,0.9)");
      leftEyeGradient.addColorStop(1,"rgba(0,0,0,1)");
      ctx.fillStyle = leftEyeGradient;
      ctx.arc(this.leftEye.x, this.leftEye.y, this.faceWidth/10, 0, 2*Math.PI, false);
      ctx.fill();
       
      ctx.closePath();
      /*
      ctx.fillRect(
         leftEyeClip.x, leftEyeClip.y, 
         leftEyeClip.width, leftEyeClip.height);
      */
         
      // RIGHT EYE
      var rightEyeClip = {
         x: this.rightEyeCorners.topLeft.x - this.rightEye.width/2,
         y: this.rightEyeCorners.topLeft.y - this.rightEye.height/2,
         width: 2*this.rightEye.width,
         height: 2* this.rightEye.height
      };
      
      ctx.beginPath();
      var rightEyeGradient = ctx.createRadialGradient(
         rightEyeClip.x + rightEyeClip.width/2,
         rightEyeClip.y + rightEyeClip.height/2,
         this.faceWidth/10,
         rightEyeClip.x + rightEyeClip.width/2,
         rightEyeClip.y + rightEyeClip.height/2,
         0);
      rightEyeGradient.addColorStop(0,"rgba(0,0,0,0)");
      rightEyeGradient.addColorStop(0.5,"rgba(0,0,0,0.9)");
      rightEyeGradient.addColorStop(1,"rgba(0,0,0,1)");
      ctx.fillStyle = rightEyeGradient;
      ctx.arc(this.rightEye.x, this.rightEye.y, this.faceWidth/10, 0, 2*Math.PI, false);
      ctx.fill();
      
      ctx.closePath();
      
      /*   
      ctx.fillRect(
         rightEyeClip.x, rightEyeClip.y,
         rightEyeClip.width, rightEyeClip.height);
      */
          
      // MOUTH
      var mouthClip = {
         x: this.mouthCorners.topLeft.x,
         y: this.mouthCorners.topLeft.y,
         width: this.mouthCorners.topRight.x - this.mouthCorners.topLeft.x,
         height: this.mouthCorners.bottomLeft.y - this.mouthCorners.topLeft.y
      };
      
      ctx.beginPath();
      
      for (var i = 0.2; i < 0.9; i = i + 0.1) {
        var mouthGradient = ctx.createRadialGradient(
          mouthClip.x + mouthClip.width*i,
          mouthClip.y + mouthClip.height/2,
          mouthClip.height/ 2,
          mouthClip.x + mouthClip.width*i,
          mouthClip.y + mouthClip.height/2,
          0);
        mouthGradient.addColorStop(0,"rgba(0,0,0,0)");
        mouthGradient.addColorStop(0.8,"rgba(0,0,0,0.8)");
        mouthGradient.addColorStop(1,"rgba(0,0,0,1)");
        
        ctx.fillStyle = mouthGradient;
        ctx.arc(mouthClip.x + mouthClip.width*i, mouthClip.y + mouthClip.height/2, 
          mouthClip.height/2, 0, 2*Math.PI, false);
        ctx.fill();
      }
     
      ctx.closePath();
      
      ctx.restore(); 
      
      this.addHashtag(cb);
   },
   
   addHashtag: function(cb) {
     
      var offsetFactor = 0;
      var CANVAS_HEIGHT = 0;
      var CANVAS_WIDTH = 0;
      
      if (this.meatImage.ori != null) {
        CANVAS_HEIGHT = 750;
        CANVAS_WIDTH = 750;
        offsetFactor = 160;
      } else {
        CANVAS_HEIGHT = 1000;
        CANVAS_WIDTH = 1000;
        offsetFactor = 200;
      }
      
      ctx.fillStyle = "#EA0047";
      ctx.fillRect(0, CANVAS_HEIGHT - CANVAS_HEIGHT * 0.1, CANVAS_WIDTH /* * .46 */, CANVAS_HEIGHT * 0.1)
      
      var fontSize = CANVAS_WIDTH * 20/360; 
      ctx.font = fontSize + "px Helvetica";
      ctx.fillStyle = "white";
      ctx.fillText("#morethanmeat", CANVAS_WIDTH/2 - offsetFactor, CANVAS_HEIGHT - fontSize/2);
      
      /*
       
      ctx.fillStyle = "#EA0047";
      ctx.fillRect(0, CANVAS_HEIGHT - CANVAS_HEIGHT * 0.1, CANVAS_WIDTH * .46, CANVAS_HEIGHT * 0.1)
      
      var fontSize = CANVAS_WIDTH * 20/360; 
      ctx.font = fontSize + "px Helvetica";
      ctx.fillStyle = "white";
      ctx.fillText("#morethanmeat", fontSize/2, CANVAS_HEIGHT - fontSize/2);
      
      */
      
      cb();
   }
  
};

