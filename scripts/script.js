var map;
function initMap(){
}

//create a variable for markers
var markers = [];

var viewModel = {

  show: function(self) {
        google.maps.event.trigger(self.marker, 'click');
    },

    locations: [
    {title: "Tin Shed", location : {lat : 45.5589514, lng : -122.6508892}},
    {title: "Broder Nord", location : {lat : 45.5392485, lng : -122.6744243}},
    {title: "Pine Street Biscuits", location : {lat : 45.5589447, lng : -122.6427462}},
    {title: "Tasty n Sons", location : {lat : 45.54991769999999, lng : -122.6665183}},
    {title: "Frank's Noodle House", location : {lat : 45.53490619999999, lng : -122.6570452}},
  ],

};

//code that runs the search filter
viewModel.Query = ko.observable('');
viewModel.searchResults = ko.computed(function() {
    var query = viewModel.Query();
    return viewModel.locations.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) >= 0;
    });
});

//code that links the filter to the markers
viewModel.test = ko.computed(function() {
  if (viewModel.Query() == false) {
    showListings();
  } else {
  hideMarkers(markers);
  //    var bounds = new google.maps.LatLngBounds();
  for (var i= 0; i < viewModel.searchResults().length; i++) {
    viewModel.searchResults()[i].marker.setVisible(true);
  //  bounds.extend(viewModel.searchResults()[i].marker.position);
  }
  //    map.fitBounds(bounds);

}

});

var results = viewModel.searchResults();

ko.applyBindings(viewModel);

//creates map with markers
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat : 45.5231, lng: -122.6765},
    zoom: 12
  });

var locations = viewModel.locations;

var infowindow = new google.maps.InfoWindow();
  
for (var i = 0; i < locations.length; i++) {

  (function(j) {

    var fsdata = viewModel.locations[j].data; //foursquare data that contains user and vist count for each location
    var position = locations[j].location;
    var title = locations[j].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: j,
      visible: true
    });
    markers.push(marker);

    markers[i].setMap(map);
    viewModel.locations[i].marker = marker;
    viewModel.locations[i].infowindow = infowindow;

    marker.addListener('click', function() {
      infowindow.setContent(title + '<br><br>' +
                'FourSquare users: ' + fsdata.usersCount + '<br> ' +
                'FourSquare visits: ' + fsdata.checkinsCount);
      infowindow.open(map, this);
      map.setZoom(12);
      map.setCenter(marker.getPosition());
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        marker.setAnimation(null);
    }, 3000);

    });

  })(i);
}
}

// This function will loop through the markers array and display them all.
function showListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setVisible(true);
  }
}


// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setVisible(false);
  }
}

document.getElementById('resturants').addEventListener('click', showListings);

document.getElementById('close').addEventListener('click', function() {
  hideMarkers(markers);
});

//funcation that requests data from FourSquare's API and saves it for later use.
function callFoursquare() {
  var version = "20170601";
  var client_secret = "BBCJDCJTIKPJZURDRBPBVWR1ESGEBSU4O3OJEA5UK0LUF4LA";
  var client_id = "HSFBG34JW1X1KJEF4DIBLJDWSXRNWJ1I5VCFR4RKOALCJ1AS";

  for (var i = 0; i < viewModel.locations.length; i++) {
    var lat = viewModel.locations[i].location.lat;
    var lng = viewModel.locations[i].location.lng;
    var limit = 1;
    var fsURL = "https://api.foursquare.com/v2/venues/search?v=" + version + "&ll=" + lat + "," + lng + "&client_id=" + client_id + "&client_secret=" + client_secret + "&limit=" + limit;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", fsURL, false);
    xhttp.send(null);
    var jsonObject = JSON.parse(xhttp.responseText);
    
   
    viewModel.locations[i].data = jsonObject.response.venues[0].stats;
}
}
callFoursquare()
