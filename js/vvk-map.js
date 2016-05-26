var vvkMap = function() {
  this.markerForPlaceIdMap = {};
  this.map = null;
  this.freeIcon = L.icon({iconUrl: 'img/toilet_free_25px.png', iconSize: [25, 25]});
  this.occupiedIcon = L.icon({iconUrl: 'img/toilet_occupied_25px.png', iconSize: [25, 25]});

  this.start = function() {
    this.createMap();
    this.startPlaceStatusUpdatePoller();
  };

  this.createMap = function() {
    this.map = L.map('map', {maxZoom: 22})
        .setView(vvk.solitaOfficeHkiLocation, 19)
        .addControl(new vvkGoToHomeControl())
        .addControl(new vvkRadiatorControl())
        .on('click', function(e) { console.log([e.latlng.lat, e.latlng.lng]); });

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
    link.title = 'Show places status in radiator';

    var icon = L.DomUtil.create('span', 'fa fa-th', link);

    return container;
  }
 
});
vvk.map = new vvkMap();