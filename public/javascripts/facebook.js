var fbUser = {
  accessToken: null,
  userId: null,
  profilePicturesAlbumId: null,
  profilePictures: []
};

window.fbAsyncInit = function() {
  FB.init({
    appId      : '215442935493903',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,
    version    : 'v2.6'
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  $("#fb-share").on('click', function() {
    FB.ui({
      method: "feed",
      link: "http://hellovelocity.com/",
      caption: "Example.com",
      description: "Here is the text I want to share.",
      picture: "http://www.hellovelocity.com/images/fb-banner.png"
    });
  });
  
};

function updateFbShare(url) {
  $("#fb-share").addClass("active");
  $("#fb-share").off('click').on('click', function() {
    FB.ui({
      method: "feed",
      link: "http://meatface.me",
      caption: "Take A Picture. Join the Movement.",
      description: "Updated description text...",
      picture: url
    });
  }); 
};

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  // console.log('statusChangeCallback');
  // console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    fbUser.accessToken = response.authResponse.accessToken;
    fbUser.userId = response.authResponse.userID;
    
    /**
     * Main Access Point
     */
    getFbData();
    //testAPI();
    
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  // console.log('Welcome!  Fetching your information.... ');
  FB.api(
    '/me', 
    function(response) {
      // console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    }
  );
}

function getFbData() {
  async.series([
    
    // Get all albums to get the ID of the "Profile Picture" album
    function(cb){
      // console.log("Fetching albums"); 
      FB.api(
        "/me/albums",
        function (response) {
          if (response && !response.error) {
            // console.log(response);
            var albums = response.data;
            for (var i=0; i<albums.length; i++) {
              if (albums[i].name == "Profile Pictures") {
                fbUser.profilePicturesAlbumId = albums[i].id;
                break;
              }
            }
            if (fbUser.profilePicturesAlbumId) {
              cb(null, true);
            } else {
              cb(response.error);
              return;
            }
          } else {
            Util.handleError("Could not get Profile Picture Album Id");
            cb(response.error);
            return;
          }
        }
      );
    },
    
    // Get all photo ids within the album "Profile Pictures"
    function(cb) {
      // console.log("Fetching Image Ids from Profile Pictures Album");
      FB.api(
        "/"+fbUser.profilePicturesAlbumId+"/photos?fields=images,picture",
        function (response) {
          if (response && !response.error) {
            // console.log(response);
            var profilePictures = response.data;
            for (var i=0; i<profilePictures.length; i++) {
              var profilePicture = profilePictures[i];
              
              var obj = {
                image: profilePicture.images[0],
                thumbnail: profilePicture.picture,
                id: profilePicture.id
              }
              
              fbUser.profilePictures.push(obj);
            }
            cb(null, true);
          } else {
            Util.handleError("Could not get Profile Pictures");
            cb(response.error);
          }
        }
      );
    }
   
  ], function(err, results) {
    if (err) {
      Util.handleError("Error getting fb data: " + err);
      return;
    }  
    populateProfilePictures();
    //console.log(fbUser);
  });
}

function populateProfilePictures() {
  $(".sc-fb-button").hide();
  $(".sc-fb-profile-pictures").show();
  
  var profilePicture = $(".sc-fb-profile-picture");
  profilePicture.attr("src", fbUser.profilePictures[0].image.source);
  
  var profilePictureOptions = $(".sc-fb-profile-picture-options");
  for (var i=0; i<fbUser.profilePictures.length; i++) {
    
    var el = $("<img/>")
    .addClass("sc-fb-profile-picture-option")
    .attr("src", fbUser.profilePictures[i].image.source);
    
    if (i==0) {
      el.addClass("active");
    }
    
    handleProfilePictureThumbnail(el);
    
    profilePictureOptions.append(el);
  }
}

function handleProfilePictureThumbnail(el) {
  var src = el.attr("src");
  el.click( function() {
    $(".sc-fb-profile-picture-option.active").removeClass("active");
    el.addClass("active"); 
    $(".sc-fb-profile-picture").attr("src", src);
  });
    
}
















