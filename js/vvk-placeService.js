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
  	  var value = paramsObj[key];

  	  if(Array.isArray(value)) {
  	    return value.map(function(v) {
  	      return key + '=' + v;
  	    }).join('&');
  	  }
  	  
  	  return key + '=' + value;
  	}).join('&');
  };

  this.getPlacesCurrentStatus = function(readyCallback) {
    this.get(vvk.backendUrl + '/v1/place/status', readyCallback);
  };

  this.getAllPlaces = function(readyCallback) {
  	this.get(vvk.backendUrl + '/v1/place', readyCallback);
  };

  this.getUsageStats = function(paramsObj, readyCallback) {
  	this.get(vvk.backendUrl + '/v1/query/usagestats?' + this.stringifyQueryParams(paramsObj), readyCallback);
  };

  this.getUsageStatsForDayHours = function(paramsObj, readyCallback) {
  	var date = moment(paramsObj.dayDate).startOf('day');
  	var result = {};

  	var usageStatsHourCallback = function(hour, usageStats) {
  	  result[hour] = usageStats.average;

  	  if(Object.keys(result).length === 24) {
  	  	var resultArray = Object
  	  	  .keys(result)
  	  	  .map(function(key) { return parseInt(key);})
  	  	  .sort(function(a,b) { return a - b; })
  	  	  .map(function(key) { return result[key]; });
  	  	readyCallback(resultArray);
  	  }

  	};

  	for(var hour = -1; hour <= 23; hour++) {
  		date.add(1, 'hours');

  		this.getUsageStats({
  			starting: moment(date).startOf('hour').utc().toISOString(), 
  			ending: moment(date).endOf('hour').utc().toISOString(),
  			place_id: paramsObj.placeId > -1 ? [paramsObj.placeId] : []
  		}, usageStatsHourCallback.bind(this, date.hour()));
  	}
  };

};
vvk.placeService = new vvkPlaceService();