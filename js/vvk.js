var vvk = function() {
  this.devices = [];
  this.deviceService = null;

  this.start = function(deviceService) {
    this.deviceService = deviceService;
    this.loadDevices(this.startDeviceStateUpdatePoller.bind(this));
  };

  this.loadDevices = function(onReadyCallback) {
    var listDevicesCallback = function(devices) {
      this.devices = devices;
      devices.forEach(this.createDevice);
      onReadyCallback();
    };

    this.deviceService.listDevices(listDevicesCallback.bind(this));
  };

  this.startDeviceStateUpdatePoller = function() {
    this.updateDeviceStates();
    window.setInterval(this.updateDeviceStates.bind(this), 4000);
  };

  this.updateDeviceStates = function() {
    var updateElementFn = function(device) {
      var id = 'toilet' + device.id;
      device.occupied ? this.changeStateToOccupied(id) : this.changeStateToFree(id);
    };

    var stateLoadReadyFn = function(states) {
      states.forEach(updateElementFn.bind(this));
    };

    this.deviceService.getDevicesCurrentState(stateLoadReadyFn.bind(this));
  };

  this.createDevice = function(device) {
    var span = document.createElement("span");
    span.id = 'toilet' + device.id;
    span.style.left = device.x + 'px';
    span.style.top = device.y + 'px';
    span.classList.add("toilet");
    document.getElementById("map").appendChild(span);
  };

  this.changeStateToFree = function(toiletId) {
  	var toiletElem = document.getElementById(toiletId);
  	toiletElem.classList.remove("occupied");
  	toiletElem.classList.add("free");
  };

  this.changeStateToOccupied = function(toiletId) {
  	var toiletElem = document.getElementById(toiletId);
  	toiletElem.classList.remove("free");
  	toiletElem.classList.add("occupied");
  };

};