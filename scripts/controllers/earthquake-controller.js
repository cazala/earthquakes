// app module
angular.module('earthquakeApp')

// earthquake controller
.controller('earthquakeCtrl', function(earthquakeService, configService, $scope, $modal){

  $scope.openFilter = openFilter;
  $scope.changeView = changeView;

  // filter
  function openFilter(){
    $modal.open({
      templateUrl: "views/filter.html",
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