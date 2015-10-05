// app module
angular.module('earthquakeApp')

// earthquake controller
.controller('appCtrl', function(earthquakeService, configService, $scope, $modal){

  $scope.openFilter = openFilter;
  $scope.changeView = changeView;
  $scope.showMapButton = configService.viewMode == 'globe';
  $scope.showWorldButton = configService.viewMode == 'map';

  // filter
  function openFilter(){
    $modal.open({
      templateUrl: "views/filter-view.html",
      controller: 'filterCtrl',
    })
  }

  // change view
  function changeView(mode){
    configService.applyConfig({
      viewMode: mode
    })
  }

  // start app
  earthquakeService.blastoff();
})