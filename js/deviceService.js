var deviceService = function() {

  this.listDevices = function(readyCallback) {
    readyCallback([
      {id: 1, x: 1000, y: 275},
      {id: 2, x: 1000, y: 301},
      {id: 3, x: 1000, y: 325},
      {id: 4, x: 1000, y: 354},
      {id: 5, x: 1120, y: 356},
      {id: 6, x: 1120, y: 276},
      {id: 7, x: 366, y: 326},
      {id: 8, x: 366, y: 352},
      {id: 9, x: 244, y: 357}
    ]);
  }

  this.getDevicesCurrentState = function(readyCallback) {
    var listDevicesCallback = function(devices) {
      var states = devices.map(function(device) {
        return {
      	  id: device.id,
      	  occupied: this.randomBoolean()
        };
      }, this);
      readyCallback(states);
    };
    this.listDevices(listDevicesCallback.bind(this));
  };

  this.randomBoolean = function() {
    return Math.random() > 0.5;
  };
};