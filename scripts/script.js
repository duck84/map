var map;
//create a variable for markers
var markers = [];
var ViewModel = {
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
	locations: [{
		title: "Tin Shed",
		location: {
			lat: 45.5589514,
			lng: -122.6508892
		}
	}, {
		title: "Broder Nord",
		location: {
			lat: 45.5392485,
			lng: -122.6744243
		}
	}, {
		title: "Pine Street Biscuits",
		location: {
			lat: 45.5589447,
			lng: -122.6427462
		}
	}, {
		title: "Tasty n Sons",
		location: {
			lat: 45.54991769999999,
			lng: -122.6665183
		}
	}, {
		title: "Frank's Noodle House",
		location: {
			lat: 45.53490619999999,
			lng: -122.6570452
		}
	}, ],
};
//code that runs the search filter
ViewModel.Query = ko.observable('');
ViewModel.searchResults = ko.computed(function() {
	var query = ViewModel.Query();
	return ViewModel.locations.filter(function(item) {
		return item.title.toLowerCase().indexOf(query) >= 0;
	});
});
//code that links the filter to the markers
ViewModel.filtered = ko.computed(function() {
	if (ViewModel.Query() === "") {
		ViewModel.showListings();
	} else {
		ViewModel.hideMarkers(markers);
		//    var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < ViewModel.searchResults().length; i++) {
			ViewModel.searchResults()[i].marker.setVisible(true);
			//  bounds.extend(ViewModel.searchResults()[i].marker.position);
		}
		//    map.fitBounds(bounds);
	}
});
var results = ViewModel.searchResults();
ko.applyBindings(ViewModel);
//creates map with markers
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 45.5231,
			lng: -122.6765
		},
		zoom: 12
	});
  infowindow = new google.maps.InfoWindow();
}

var markerCount = 0;

function createMarkers(data) {
	var locations = ViewModel.locations;
	var fsdata = data; //foursquare data that contains user and vist count for each location
	var position = locations[markerCount].location;
	var title = locations[markerCount].title;
	var marker = new google.maps.Marker({
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
		id: markerCount,
		visible: true
	});
	markers.push(marker);
	markers[markerCount].setMap(map);
	ViewModel.locations[markerCount].marker = marker;
	marker.addListener('click', function() {
		infowindow.setContent(title + '<br><br>' + 'FourSquare users: ' + fsdata.usersCount + '<br> ' + 'FourSquare visits: ' + fsdata.checkinsCount);
		infowindow.open(map, this);
		map.setZoom(12);
		map.setCenter(marker.getPosition());
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 2100);
	});
	markerCount ++;
	return markerCount;
}

//funcation that requests data from FourSquare's API and saves it for later use.
function callFoursquare() {
	var version = "20170601";
	var client_secret = "BBCJDCJTIKPJZURDRBPBVWR1ESGEBSU4O3OJEA5UK0LUF4LA";
	var client_id = "HSFBG34JW1X1KJEF4DIBLJDWSXRNWJ1I5VCFR4RKOALCJ1AS";
	ViewModel.locations.forEach(function(element, index, array) {
		var lat = ViewModel.locations[index].location.lat;
		var lng = ViewModel.locations[index].location.lng;
		var limit = 1;
		var fsURL = "https://api.foursquare.com/v2/venues/search?v=" + version + "&ll=" + lat + "," + lng + "&client_id=" + client_id + "&client_secret=" + client_secret + "&limit=" + limit;
		fetch(fsURL).then(function(response) {
			if (response.status !== 200) {
				alert('Looks like there was a problem. Status Code: ' + response.status);
				return;
			}
			// Adds the FourSquare data to the createMarker function and creates makers
			response.json().then(function(data) {
        createMarkers(data.response.venues[0].stats);
			});
		}).catch(function(err) {
      alert('Fetch Error :-S', err);
		});
	});
}
callFoursquare();
	//TODO get the callFoursquare function to work. Alternative is to hard code foursquare IDs
function googleError() {
	alert("The Google map failed to load. Check internet connection.");
}
