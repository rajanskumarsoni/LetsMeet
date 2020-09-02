var count =0;
var storeId = [];
var allplaces = [];
var suggestedPlaces = [];
storeId[0]="add0"
function addField(){
  var itm = document.getElementById("mychild").firstElementChild;
  var cln = itm.cloneNode(true);
  count++;
  var inputItem = cln.getElementsByTagName('input')[0];
  storeId[count]="add"+count;
  inputItem.id=storeId[count];
  inputItem.value = "";
  insertAfter(cln, itm);
  initialize(storeId[count],count);
}
function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}
function initialize(elementid,count){

             suggestedPlaces[count] = new google.maps.places.Autocomplete(document.getElementById(elementid));
            google.maps.event.addListener(suggestedPlaces[count] , 'place_changed', function () {
                var place = suggestedPlaces[count] .getPlace();
                var address = suggestedPlaces[count] .formatted_address;
                var latitude = suggestedPlaces[count] .geometry.location.A;
                var longitude = suggestedPlaces[count] .geometry.location.F;
                var mesg = "Address: " + address;
                mesg += "\nLatitude: " + latitude;
                mesg += "\nLongitude: " + longitude;
                alert(mesg);
            });
      }



function letsMeet(){
   for(var j=0;j<=count;j++){
    allplaces[j]= document.getElementById(storeId[j]).value;
    console.log(allplaces);
    console.log("rajan is herer");
   }
   if(validation(allplaces)){
     document.getElementById("frame").contentWindow.executeGeocode(allplaces,count) ;
   }
   else{
     window.alert("Please fill the address or reload");
   }

}
function validation(allplaces){
  var len = allplaces.length;
  for(var i=0;i<len;i++){
    if(allplaces[i]=="")
    return false;
  }
  return true;
}
