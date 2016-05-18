var vvkMap = function() {
  this.markerForPlaceIdMap = {};
  this.map = null;
  this.freeIcon = L.icon({iconUrl: 'img/toilet_free_25px.png', iconSize: [25, 25]});
  this.occupiedIcon = L.icon({iconUrl: 'img/toilet_occupied_25px.png', iconSize: [25, 25]});

  this.start = function(deviceService) {
    this.createMap();
    this.startPlaceStatusUpdatePoller();
  };

  this.createMap = function() {
    this.map = L.map('map', {maxZoom: 22}).setView([60.176839, 24.938555], 19);
    this.map.on('click', function(e) { console.log([e.latlng.lat, e.latlng.lng]); });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    var imageUrl = 'img/solita_helsinki_map_grayscale_flipped.png';
    var imageBounds = [[60.177211, 24.939080], [60.176510, 24.938305]];

    L.imageOverlay(imageUrl, imageBounds).addTo(this.map);
  };

  this.startPlaceStatusUpdatePoller = function() {
    this.updatePlacesStatus();
    window.setInterval(this.updatePlacesStatus.bind(this), 4000);
  };

  this.updatePlacesStatus = function() {
    var readyCallbackFn = function(places) {
      places.forEach(this.updateOrCreatePlaceStatusMarker.bind(this));
    };

    vvk.placeService.getPlacesCurrentStatus(readyCallbackFn.bind(this));
  };

  this.updateOrCreatePlaceStatusMarker = function(place) {
    var marker = this.markerForPlaceIdMap[place.place_id];
    var coordinates = [place.latitude, place.longitude];
    var icon = place.occupied ? this.occupiedIcon : this.freeIcon;

    if(!marker) {
      marker = L.marker(coordinates, {icon: icon}).addTo(this.map);
      this.markerForPlaceIdMap[place.place_id] = marker;
    }
    else {
      marker.setLatLng(coordinates).setIcon(icon);
    }
  };


};