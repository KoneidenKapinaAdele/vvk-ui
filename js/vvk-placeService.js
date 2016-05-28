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

  this.stringifyQueryParams = function(paramsObj) {
  	return Object.keys(paramsObj).map(function(key) {
  		return key + '=' + paramsObj[key];
  	}).join('&');
  };

  this.getPlacesCurrentStatus = function(readyCallback) {
    this.get(vvk.backendUrl + '/v1/status/current', readyCallback);
  };

  this.getAllPlaces = function(readyCallback) {
  	this.get(vvk.backendUrl + '/v1/place', readyCallback);
  };

  this.getUsageStats = function(paramsObj, readyCallback) {
  	this.get(vvk.backendUrl + '/v1/query/usagestats?' + this.stringifyQueryParams(paramsObj), readyCallback);
  };

  this.getUsageStatsForDayHours = function(dayDate, readyCallback) {
  	var date = new Date(dayDate.getTime());
  	date.setHours(0,0,0,0);
  	var readyHoursCount = 0;
  	var result = {};

  	var usageStatsHourCallback = function(hour, usageStats) {
  	  readyHoursCount++;
  	  result[hour] = usageStats.average;

  	  if(readyHoursCount === 23) {
  	  	var resultArray = Object.keys(result).sort().map(function(key) {
  	  		return result[key];
  	  	})
  	  	readyCallback(resultArray);
  	  }

  	};

  	for(var hour = -1; hour <= 23; hour++) {
  		date.setHours(date.getHours()+1);

  		var startOfHour = new Date(date.getTime());
  		startOfHour.setMinutes(0, 0, 0);

  		var endOfHour = new Date(date.getTime());
  		endOfHour.setMinutes(59, 59, 999);

  		this.getUsageStats({
  			starting: startOfHour.toISOString(), 
  			ending: endOfHour.toISOString()
  		}, usageStatsHourCallback.bind(this, hour));
  	}
  };

};
vvk.placeService = new vvkPlaceService();