var map;

//create a variable for markers
var markers = [];

var viewModel = {

  show: function(self) {
    google.maps.event.trigger(self.marker, 'click');
  },

    // This function will loop through the markers array and display them all.
  showListings: function(self) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
      }
    },

    // This function will loop through the listings and hide them all.
  hideMarkers: function(self) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
      }
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
  if (viewModel.Query() === "") {
    viewModel.showListings();
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

    locations.forEach(function(element, index, array) {
    var fsdata = viewModel.locations[index].data; //foursquare data that contains user and vist count for each location
    var position = locations[index].location;
    var title = locations[index].title;

    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: index,
      visible: true
    });
    markers.push(marker);

    markers[index].setMap(map);
    viewModel.locations[index].marker = marker;
    viewModel.locations[index].infowindow = infowindow;

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
    }, 2100);

    });

  });
}

//funcation that requests data from FourSquare's API and saves it for later use.
function callFoursquare() {
  var version = "20170601";
  var client_secret = "BBCJDCJTIKPJZURDRBPBVWR1ESGEBSU4O3OJEA5UK0LUF4LA";
  var client_id = "HSFBG34JW1X1KJEF4DIBLJDWSXRNWJ1I5VCFR4RKOALCJ1AS";

  viewModel.locations.forEach(function(element, index, array) {
    var lat = viewModel.locations[index].location.lat;
    var lng = viewModel.locations[index].location.lng;
    var limit = 1;
    var fsURL = "https://api.foursquare.com/v2/venues/search?v=" + version + "&ll=" + lat + "," + lng + "&client_id=" + client_id + "&client_secret=" + client_secret + "&limit=" + limit;

fetch(fsURL)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        viewModel.locations[index].data = data.response.venues[0].stats;
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

})
};

callFoursquare()
//TODO get the callFoursquare function to work. Alternative is to hard code foursquare IDs

function googleError() {
  alert("The Google map failed to load. Check internet connection.");
}
