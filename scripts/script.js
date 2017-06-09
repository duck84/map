var map;

//create a variable for markers
var markers = [];

var viewModel = {

    locations: [
    {title: "Tin Shed", location : {lat : 45.5589514, lng : -122.6508892}},
    {title: "Broder Nord", location : {lat : 45.5392485, lng : -122.6744243}},
    {title: "Pine Street Biscuits", location : {lat : 45.5589447, lng : -122.6427462}},
    {title: "Tasty n Sons", location : {lat : 45.54991769999999, lng : -122.6665183}},
    {title: "Frank's Noodle House", location : {lat : 45.53490619999999, lng : -122.6570452}},
  ]

};

//code that runs the search filter
viewModel.Query = ko.observable('');
viewModel.searchResults = ko.computed(function() {
    var query = viewModel.Query();
    return viewModel.locations.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) >= 0;
    });
});

  ko.applyBindings(viewModel);

//creates map with markers
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat : 45.5231, lng: -122.6765},
    zoom: 12
  });

var locations = viewModel.locations
var infowindow = new google.maps.InfoWindow()

for (var i = 0; i < locations.length; i++) {

  (function(j) {

    var position = locations[j].location;
    var title = locations[j].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: j
    });
    markers.push(marker);

    markers[i].setMap(map);

    marker.addListener('click', function() {
      infowindow.setContent(title)
      infowindow.open(map, this);
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(function () {
        marker.setAnimation(null);
    }, 3000);

    });

  })(i);
};
}


// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}


// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}



document.getElementById('resturants').addEventListener('click', showListings);


document.getElementById('close').addEventListener('click', function() {
  hideMarkers(markers);
});
