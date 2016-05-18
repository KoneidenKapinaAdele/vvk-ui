var vvkPlaceService = function() {

  this.getPlacesCurrentStatus = function(readyCallback) {
    readyCallback([
      {place_id: 1, latitude: 60.17667308232766, longitude: 24.93886023759842, occupied: this.randomBoolean()},
      {place_id: 2, latitude: 60.17667274884376, longitude: 24.938826039433486, occupied: this.randomBoolean()},
      {place_id: 3, latitude: 60.17667274884376, longitude: 24.93879653513432, occupied: this.randomBoolean()},
      {place_id: 4, latitude: 60.1766710814243, longitude: 24.93876770138741, occupied: this.randomBoolean()},
      {place_id: 5, latitude: 60.17660104972962, longitude: 24.9387750774622, occupied: this.randomBoolean()},
      {place_id: 6, latitude: 60.17660238366804, longitude: 24.938867613673217, occupied: this.randomBoolean()},
      {place_id: 7, latitude: 60.177032242507515, longitude: 24.93876770138741, occupied: this.randomBoolean()},
      {place_id: 8, latitude: 60.1770305751063, longitude: 24.938737526535995, occupied: this.randomBoolean()},
      {place_id: 9, latitude: 60.17710093936467, longitude: 24.93872813880444, occupied: this.randomBoolean()}
    ]);
  };

  this.randomBoolean = function() {
    return Math.random() > 0.5;
  };
};