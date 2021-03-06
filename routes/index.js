var BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;
var STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
var STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
var PRIVATE_PREVIEW_PASSWORD = process.env.PRIVATE_PREVIEW_PASSWORD;
var FACEBOOK_PREVIEW_PASSWORD = process.env.FACEBOOK_PREVIEW_PASSWORD;

var express = require('express');
var router = express.Router();
var randomString = require('random-string');
var fs = require('fs');
var azure = require('azure-storage');
var async = require('async');
var Bitly = require('bitly');
var bitly = new Bitly(BITLY_ACCESS_TOKEN);

var imageCacheQueue= [];

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.mobile == true) {
    res.render('index', { mobile: "true" });
  } else {
    res.render('index', { mobile: "false" });
  }
});

/* private preview endpoints
router.post('/enter', function(req, res, next) {
  if (req.mobile == true) {
    res.render('index', { mobile: "true" });
  } else {
    res.render('index', { mobile: "false" });
  }
});
*/

router.get('/faq', function(req, res, next) {
  if (req.mobile == true) {
    res.render('faq', { mobile: "true" });
  } else {
    res.render('faq', { mobile: "false" });
  }
});

router.get('/privacy', function(req, res, next) {
  if (req.mobile == true) {
    res.render('privacy', { mobile: "true" });
  } else {
    res.render('privacy', { mobile: "false" });
  }
});

router.get('/shorten/:url', function(req, res) {
  console.log("TWITTER START: ");
  bitly.shorten("http://"+req.params.url) // considered invalid uri without 'http'
  .then(function(response) {
    var shortUrl = response.data.url; 
    res.json({
      shortUrl: shortUrl,
      response: response,
      error: null
    });
  }, function(error) {
    res.json({
      erorr: error
    });
    //throw error;
  });
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
  
    var accountName = STORAGE_ACCOUNT_NAME;
    var accountKey = STORAGE_ACCOUNT_KEY;
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
