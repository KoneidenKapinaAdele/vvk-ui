var vvkRadiator = function() {

  this.start = function() {
    this.fetchPlaces();
    this.startPlaceStatusUpdatePoller();
  };

  this.startPlaceStatusUpdatePoller = function() {
    window.setInterval(this.updatePlacesStatus.bind(this), 4000);
  };

  this.updatePlacesStatus = function() {
    vvk.placeService.getPlacesCurrentStatus(this.updateGrid.bind(this));
  };

  this.fetchPlaces = function() {
    vvk.placeService.getAllPlaces(this.createGrid.bind(this));
  };

  this.createGrid = function(places) {
    var grid = document.getElementById('grid-container');

    // Remove old rows
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    var rows = places.length / 3;
    var cellIndex = 0;
    for  (var i=1; i <= rows; i++) {
      var gridRow = this.createGridRow();
      grid.appendChild(gridRow);

      for (var k=1; k <= 3; k++) {
        var place = places[cellIndex];
        var cell = this.createGridCell(place);
        gridRow.appendChild(cell);
        cellIndex++;
      }
    }
  };

  this.updateGrid = function(places) {
    places.forEach(this.updateGridCell.bind(this));
  };

  this.createGridRow = function() {
    var gridRow = document.createElement('div');
    gridRow.classList.add('Grid');
    gridRow.classList.add('Grid-full');
    gridRow.classList.add('large-Grid--fit');
    return gridRow;
  };

  this.createGridCell = function(place) {
    var cell = document.createElement('div');
    cell.id = 'place-' + place.id;
    cell.classList.add('Grid-cell');
    cell.classList.add('status-unknown');

    var cellContent = document.createElement('div');
    cellContent.appendChild(document.createTextNode(place.name));
    cellContent.classList.add('grid-cell-content');
    cell.appendChild(cellContent);

    return cell;
  };

  this.updateGridCell = function(place) {
    var cell = document.getElementById('place-' + place.place_id);
    cell.classList.remove('status-unknown');

    if(place.occupied) {
      cell.classList.add('status-occupied');
      cell.classList.remove('status-free');
    }
    else {
      cell.classList.add('status-free');
      cell.classList.remove('status-occupied');
    }
    return cell;
  };
 
};
vvk.radiator = new vvkRadiator();