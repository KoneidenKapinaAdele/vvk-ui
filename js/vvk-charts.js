var vvkCharts = function() {
  this.chart = null;

  this.start = function() {
    this.createChart();
    this.fetchUsageStats();
  };

  this.fetchUsageStats = function() {
    var callback = function(result) {
      this.chart.data.datasets[0].data = result;
      this.chart.update();
    };

    vvk.placeService.getUsageStatsForDayHours(new Date(), callback.bind(this));
  };

  this.createChart = function() {
    var chartCanvas = document.getElementById("chart");
    this.chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            datasets: [{
                label: 'Usage percent in hour',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
 
};
vvk.charts = new vvkCharts();