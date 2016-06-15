var vvkTimeline = function() {
  this.placesMap = {};
  this.dateFilter = null;
  this.chart = null;

  this.start = function() {
    this.createDateFilter();
    this.fetchPlaces();
  };

  this.fetchPlaces = function() {
    var addToPlaceMap = function(place) {
      this.placesMap[place.id] = place;
    };

    var readyCallbackFn = function(places) {
      places.forEach(addToPlaceMap.bind(this));
      this.createTimelineChart();
    };
    vvk.placeService.getAllPlaces(readyCallbackFn.bind(this));
  };

  this.fetchTimelineData = function() {
    var date = this.getSelectedDateFilterValue();
    var startDate = moment(date).startOf('day').toDate();
    var endDate = moment(date).endOf('day').toDate();

    vvk.placeService.getTimelineForTimespan(startDate, endDate, this.onTimelineFetchReady.bind(this));
  };

  this.onTimelineFetchReady = function(timelineData) {
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Place' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows(this.createChartDataFromResponse(timelineData));

    this.chart.draw(dataTable);
  };

  this.createChartDataFromResponse = function(timelineData) {
    return timelineData
      .map(this.createSinglePlaceChratDataRows.bind(this))
      .reduce(function(previousValue, currentValue, currentIndex, array) {
        return previousValue.concat(currentValue);
      });
  };

  this.createSinglePlaceChratDataRows = function(placeTimelineData) {
    var mapRange = function(range) {
      return [this.placesMap[placeTimelineData.placeId].name, moment.utc(range.startTime).local().toDate(), moment.utc(range.endTime).local().toDate()];
    };

    return placeTimelineData.ranges.map(mapRange.bind(this));
  };

  this.createTimelineChart = function() {
    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(this.onChartLibraryLoadComplete.bind(this));    
  };

  this.onChartLibraryLoadComplete = function() {
    var container = document.getElementById('timeline');
    this.chart = new google.visualization.Timeline(container);
    this.fetchTimelineData();
  };

  this.createDateFilter = function() {
    this.dateFilter = new Pikaday({
      field: document.getElementById('date-filter-datepicker'),
      defaultDate: new Date(),
      setDefaultDate: true,
      showWeekNumber: true,
      firstDay: 1,
      onSelect: this.fetchTimelineData.bind(this)
    });
  };

  this.getSelectedDateFilterValue = function() {
    return this.dateFilter.getDate();
  };
  
 
};
vvk.timeline = new vvkTimeline();