var count =0;
var storeId = [];
var map,infoWindow,stepDisplay;
var markerArray = [];
var directionsService = [];
var directionsDisplay = [];
var closure = 0;
var sumlat = 0;
var sumlng = 0;
var latarray = [];
var lngarray = [];
var allplaces = [];
storeId[0]="add0"

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 40.771, lng: -73.974}
  });
  infoWindow = new google.maps.InfoWindow;
  stepDisplay = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    console.log("raj ii here");
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

function addField(){
  var itm = document.getElementById("mychild").firstElementChild;
  //var myListItems = itm.getElementsByTagName('input');
  var cln = itm.cloneNode(true);
  count++;
  //console.log(count);
  var inputItem = cln.getElementsByTagName('input');
  console.log(inputItem);
  console.log("raj is he");
  storeId[count]="add"+count;
  //console.log(storeId[count]);
  inputItem.id=storeId[count];
  //console.log(inputItem.id);
  //document.getElementById("mychild").appendChild(cln);
  insertAfter(cln, itm);
}
function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function letsMeet(){
   for(var j=0;j<=count;j++){
    allplaces[j]= document.getElementById(storeId[j]).value;
   }
  //  console.log(document.getElementById(storeId[i]).value);
  document.getElementById("frame").contentWindow.executeGeocode(allplaces) ;
}

//
function executeGeocode(allplaces) {
  console.log("");
  markerArray[closure] = [];
  directionsService[closure] = new google.maps.DirectionsService;
  console.log(directionsService);
  directionsDisplay[closure]=  new google.maps.DirectionsRenderer({map: map});
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    "address": allplaces[closure]
  }, function(results) {
    //console.log(results);
    lngarray[closure]=results[0].geometry.location.lng();
    sumlng += lngarray[closure];
    latarray[closure]=results[0].geometry.location.lat();
    sumlat = sumlat+latarray[closure];
    if(closure==count) {
      //console.log(closure);
      for(var j=0;j<=count;j++){
        //console.log(j);
        calculateAndDisplayRoute({lat: latarray[j], lng: lngarray[j]},{lat: sumlat/(count+1), lng: sumlng/(count+1)}, directionsDisplay[j], directionsService[j], markerArray[j], stepDisplay, map);
      }
    } else {
      closure++;
      executeGeocode();
    }
  });
}
function calculateAndDisplayRoute(start, end, directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
      console.log("raj is here");
      console.log(start);
      console.log(end);
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          document.getElementById('warnings-panel').innerHTML =
          '<b>' + response.routes[0].warnings + '</b>';
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
