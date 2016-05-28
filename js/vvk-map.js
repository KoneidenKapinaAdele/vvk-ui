var vvkMap = function() {
  this.placesMap = {};
  this.markerForPlaceIdMap = {};
  this.map = null;
  this.freeIcon = L.icon({iconUrl: 'img/toilet_free_25px.png', iconSize: [25, 25]});
  this.occupiedIcon = L.icon({iconUrl: 'img/toilet_occupied_25px.png', iconSize: [25, 25]});
  this.unknownStateIcon = L.icon({iconUrl: 'img/toilet_unknown_state_25px.png', iconSize: [25, 25]});

  this.start = function() {
    this.createMap();
    this.startPlaceStatusUpdatePoller();
    this.fetchPlaces();
  };

  this.createMap = function() {
    this.map = L.map('map', {maxZoom: 22})
        .setView(vvk.solitaOfficeHkiLocation, 19)
        .addControl(new vvkGoToHomeControl())
        .addControl(new vvkRadiatorControl())
        .addControl(new vvkChartsControl())
        .on('click', function(e) { console.log([e.latlng.lat, e.latlng.lng]); });

    // Scale marker on lower left corner
    L.control.scale({metric: true, imperial: false}).addTo(this.map);

    // Open Street map layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Solita office image overlay image
    var imageUrl = 'img/solita_helsinki_map_grayscale_flipped.png';
    var imageBounds = [[60.177211, 24.939080], [60.176510, 24.938305]];

    L.imageOverlay(imageUrl, imageBounds).addTo(this.map);

    // Geo location
    L.control.locate({
      setView: 'untilPan',
      keepCurrentZoomLevel: true,
      locateOptions: {
        enableHighAccuracy: true
      }
    }).addTo(this.map);
  };

  this.fetchPlaces = function() {
    var readyCallbackFn = function(places) {
      places.forEach(this.createPlaceMarker.bind(this));
      this.updatePlacesStatus();
    };
    vvk.placeService.getAllPlaces(readyCallbackFn.bind(this));
  };

  this.startPlaceStatusUpdatePoller = function() {
    window.setInterval(this.updatePlacesStatus.bind(this), 4000);
  };

  this.updatePlacesStatus = function() {
    var readyCallbackFn = function(places) {
      places.forEach(this.updateOrCreatePlaceStatusMarker.bind(this));
    };

    vvk.placeService.getPlacesCurrentStatus(readyCallbackFn.bind(this));
  };

  this.createPlaceMarker = function(place) {
    var coordinates = [place.latitude, place.longitude];
    var marker = L.marker(coordinates, {icon: this.unknownStateIcon})
      .bindPopup(this.generateStatusPopupText(place.name, 'Unknown state'))
      .addTo(this.map);
    this.markerForPlaceIdMap[place.id] = marker;
    this.placesMap[place.id] = place;
  };

  this.updateOrCreatePlaceStatusMarker = function(place) {
    var marker = this.markerForPlaceIdMap[place.place_id];
    var coordinates = [place.latitude, place.longitude];
    var icon = null;
    var statusText = '';

    if(place.occupied) {
       icon = this.occupiedIcon;
       statusText = 'Occupied';
    }
    else {
       icon = this.freeIcon;
       statusText = 'Free';
    }

    if(!marker) {
      marker = L.marker(coordinates, {icon: icon}).addTo(this.map);
      this.markerForPlaceIdMap[place.place_id] = marker;
    }
    else {
      marker.setLatLng(coordinates).setIcon(icon);
    }

    var placeName = this.placesMap[place.place_id] ? this.placesMap[place.place_id].name : 'Tuntematon paikka';
    marker.bindPopup(this.generateStatusPopupText(placeName, statusText))
  };

  this.generateStatusPopupText = function(placeName, statusText) {
    return '<b>' + placeName + '</b>' + 
      '<br>State: ' + statusText
  };

};

var vvkGoToHomeControl = L.Control.extend({
 
  options: {
    position: 'topleft'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-go-to-home');

    var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    link.href = '#';
    link.title = 'Go to Solita Helsinki office';

    var icon = L.DomUtil.create('span', 'fa fa-home', link);

    L.DomEvent
        .on(link, 'click', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.preventDefault)
        .on(link, 'click', this. _onClick, this)

    return container;
  },

  _onClick: function() {
      this._map.setView(vvk.solitaOfficeHkiLocation);
  }
 
});

var vvkRadiatorControl = L.Control.extend({
 
  options: {
    position: 'topleft'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-radiator');

    var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    link.href = 'radiator.html';
    link.title = 'Show places realtime status in radiator';

    var icon = L.DomUtil.create('span', 'fa fa-th', link);

    return container;
  }
 
});

var vvkChartsControl = L.Control.extend({
 
  options: {
    position: 'topleft'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-charts');

    var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    link.href = 'charts.html';
    link.title = 'Show usage statistics in chart';

    var icon = L.DomUtil.create('span', 'fa fa-bar-chart', link);

    return container;
  }
 
});

vvk.map = new vvkMap();