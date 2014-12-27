// map.js
angular.module('xyz')
  .controller('MapCtrl', function($scope, $resource){
    $scope.posts = [];
    $scope.icon = {
      url: 'images/marker.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 32),
      scaledSize: new google.maps.Size(20,20)
    };

    $scope.searchOptions = {
      minTimeStamp: new Date().getDate()-7
    };

    $scope.infoWindow = {
      options: {
        visible: false,
        boxClass:"infobox-wrapper",
        disableAutoPan: false,
        maxWidth: 200,
        pixelOffset: new google.maps.Size(-140, 0),
        boxStyle: {
          background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
          width: "250px"
        },
        zIndex: null,
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "images/exit.png",
        infoBoxClearance: new google.maps.Size(1,1)
      },
      closeClick: function(){
        $scope.infoWindow.options.visible = false;
      }
    };
    $scope.map = {
      center: {latitude: 44, longitude:-108},
      zoom:4,
      styles:[
        {"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},
        {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},
        {"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},
        {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},
        {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},
        {"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},
        {"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},
        {"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}
      ]
    };
    $scope.options = {
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false
    };

    $scope.searchbox = {
      template:'searchbox.tpl.html',
      position:'top-left',
      events:{
        places_changed:function(s){
          var place = s.getPlaces()[0].geometry.location,
              lat = place.lat(),
              lng = place.lng();
          $scope.searchOptions.lat=lat, $scope.searchOptions.lng=lng;
          // The following belongs somewhere else....
          var Search = $resource('http://localhost:3000/api/media/search/'+lat+'/'+lng);
          // going to refactor into its own function that can be called by any of the getters
          Search.get().$promise.then(function(body){
            $scope.posts=[];
            // the last post clicked
            $scope.currentPost = {coords:null, mediaLarge:""};
            $scope.map.center={latitude:lat,longitude:lng};
            $scope.map.zoom = 13;
            console.log(body.data[0].images);
            body.data.forEach(function(post, index){
              if(post.type == 'image') {
                $scope.posts.push({
                  idKey:index,
                  icon:$scope.icon,
                  // must explicitly use 'latitude' and 'longitude' as keys to hook into gmaps
                  latitude:post.location.latitude,
                  longitude:post.location.longitude,
                  mediaSmall:post.images.thumbnail.url,
                  mediaLarge:post.images.standard_resolution.url,
                  link:post.link,
                  click:function(marker, eventName, model){
                    // on click, toggle visibility of marker's infoWindow
                    if($scope.currentPost != model){
                      $scope.currentPost=model;
                      $scope.currentPost.coords={latitude:model.latitude,
                      longitude:model.longitude};

                    }
                    $scope.infoWindow.options.visible = true;
                    // Dirty fix to foundation not initializing in templateUrl problem.
                    // info-window.html is added asynchronously to the DOM
                    // setTimeout(function(){$("#infobox").foundation();},500);
                  }
                });
              }
            });
          // going to refactor into its own function that can be called by any of the getters
          });
        }
      }
    }
  })