var vvkPlaceService = function() {

  this.getPlacesCurrentStatus = function(readyCallback) {
    var xhr = new XMLHttpRequest();
	xhr.open('GET', encodeURI(vvk.backendUrl + '/v1/status/current'));
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

};