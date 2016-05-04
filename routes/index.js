var express = require('express');
var router = express.Router();
var randomString = require('random-string');
var fs = require('fs');
var azure = require('azure-storage');
var async = require('async');

var imageCacheQueue= [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/faq', function(req, res, next) {
  res.render('faq');
});

router.post('/test', function(req, res) {
  console.log("in test!");
})

router.post('/upload', function(req, res) {
  var image = req.body.img.replace(/^data:image\/png;base64,/, "");
  
  var fileName= randomString({
    length: 20,
    numeric: true,
    letters: true,
    special: false
  });
  
  imageCacheQueue.push(fileName);
  if (imageCacheQueue.length > 10) {
    var fileToDelete = imageCacheQueue.shift();
    fs.unlink("imageCache/"+fileToDelete+".png");
  }
  
  fs.writeFile("imageCache/"+ fileName +".png", image, 'base64', function(err) {
    if (err) {
      console.log(err);
      return;
    } 
  
    var accountName = "meatface";
    var accountKey = "bdpfrGoxtdyFuCJ9pbFASg6EO3ZUpAjOzzaOvyi8VJkxN1Jk4uM/ytBq++euVpplK9CuvazzIPu8GxChsBOEdg==";
    var host = accountName + '.blob.core.windows.net';
    var container = 'meatface';
    
    var blobSvc = azure.createBlobService(accountName, accountKey, host); 
    
    blobSvc.createContainerIfNotExists(container, {
        publicAccessLevel : 'blob'
        }, function(error, result, response){
      if (error) {
        console.log(error);
        return;
      }
      
      if (!error){
        //Container exists and allows 
        //anonymous read access to blob 
        //content and metadata within this container
  
        // createBlockBlobFromStream(containerName, fileName, stream, size, callback)
        blobSvc.createBlockBlobFromLocalFile(
            container, fileName, "imageCache/"+fileName+".png",
            function(error, result, response){
          if (error) {
            console.log(error);
            return;
          }
          
          if (!error){
            // file uploaded
            // console.log(error);
            
            res.json({
              url: host + "/" + container + "/" + fileName
            })
          }
          
        });
      }
      
    });
  });
 
});


module.exports = router;
