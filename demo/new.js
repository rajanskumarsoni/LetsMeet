var map,infoWindow,stepDisplay;
var markerArray = [];
var directionsService = [];
var directionsDisplay = [];
var closure = 0;
var sumlat = 0;
var sumlng = 0;
var latarray = [];
var lngarray = [];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 40.771, lng: -73.974}
  });
  infoWindow = new google.maps.InfoWindow;
  stepDisplay = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Hey you are here. Add your friends and meet');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }


//
function executeGeocode(allplaces,count) {
  markerArray[closure] = [];
  directionsService[closure] = new google.maps.DirectionsService;
  directionsDisplay[closure]=  new google.maps.DirectionsRenderer({map: map});
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    "address": allplaces[closure]
  }, function(results) {
    lngarray[closure]=results[0].geometry.location.lng();
    sumlng += lngarray[closure];
    latarray[closure]=results[0].geometry.location.lat();
    sumlat = sumlat+latarray[closure];
    if(closure==count) {
      for(var j=0;j<=count;j++){
        calculateAndDisplayRoute({lat: latarray[j], lng: lngarray[j]},{lat: sumlat/(count+1), lng: sumlng/(count+1)}, directionsDisplay[j], directionsService[j], markerArray[j], stepDisplay, map);
      }
    } else {
      closure++;
      executeGeocode(allplaces,count);
    }
  });
}
function calculateAndDisplayRoute(start, end, directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          // document.getElementById('warnings-panel').innerHTML =
          // '<b>' + response.routes[0].warnings + '</b>';
          directionsDisplay.setDirections(response);
          showSteps(response, markerArray, stepDisplay, map);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  var myRoute = directionResult.routes[0].legs[0];
  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
      stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
