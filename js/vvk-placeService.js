var vvkPlaceService = function() {

  this.get = function(url, readyCallback) {
    var xhr = new XMLHttpRequest();
	xhr.open('GET', encodeURI(url));
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
	    if (xhr.status === 200) {
	        readyCallback(JSON.parse(xhr.responseText));
	    }
	    else {
	        console.log('Request failed.  Returned status of ' + xhr.status);
	    }
	};
	xhr.send();
  };

  this.getPlacesCurrentStatus = function(readyCallback) {
    this.get(vvk.backendUrl + '/v1/status/current', readyCallback);
  };

  this.getAllPlaces = function(readyCallback) {
  	this.get(vvk.backendUrl + '/v1/place', readyCallback);
  };

};
vvk.placeService = new vvkPlaceService();