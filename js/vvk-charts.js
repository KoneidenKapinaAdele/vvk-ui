var vvkCharts = function() {
  this.chart = null;
  this.dateFilter = null;

  this.start = function() {
    this.createFilters();
    this.createChart();
    this.fetchUsageStats();
  };

  this.fetchUsageStats = function() {
    var callback = function(result) {
      this.chart.data.datasets[0].data = result;
      this.chart.update();
    };

    var params = {
      dayDate: this.getSelectedDateFilterValue(),
      placeId: this.getSelectedPlaceFilterValue()
    };

    vvk.placeService.getUsageStatsForDayHours(params, callback.bind(this));
  };

  this.createChart = function() {
    var chartCanvas = document.getElementById('chart');
    this.chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            datasets: [{
                label: 'Usage percent in hour',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  };

  this.createFilters = function() {
    this.createPlaceFilter();
    this.createDateFilter();
  };

  this.createPlaceFilter = function() {
    vvk.placeService.getAllPlaces(this.populatePlacesToFilterSelect.bind(this));
  };

  this.populatePlacesToFilterSelect = function(places) {
    var placeSelect = document.getElementById('place-filter-select');
    placeSelect.appendChild(this.createOptionSelect(-1, '-- All places --'));

    var createOptions = function(place) {
      var opt = this.createOptionSelect(place.id, place.name);
      placeSelect.appendChild(opt);
    };

    places.forEach(createOptions.bind(this));

    placeSelect.addEventListener("change", this.onPlaceFilterChange.bind(this));  
  };

  this.onPlaceFilterChange = function() {
    this.fetchUsageStats();
  };

  this.getSelectedPlaceFilterValue = function() {
    return document.getElementById('place-filter-select').value;
  };

  this.createOptionSelect = function(value, text) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = text;
    return opt;
  };

  this.createDateFilter = function() {
    this.dateFilter = new Pikaday({
      field: document.getElementById('date-filter-datepicker'),
      defaultDate: new Date(),
      setDefaultDate: true,
      showWeekNumber: true,
      firstDay: 1,
      onSelect: this.fetchUsageStats.bind(this)
    });
  };

  this.getSelectedDateFilterValue = function() {
    return this.dateFilter.getDate();
  };
 
};
vvk.charts = new vvkCharts();