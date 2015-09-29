// app module
angular.module('earthquakeApp')

// earthquake controller
.controller('earthquakeCtrl', function(earthquakeService, $scope, $modal){

  // filters
  $scope.openFilter = openFilter;

  function openFilter(){
    $modal.open({
      templateUrl: "views/filter.html",
      controller: 'filterCtrl',
    })
  }

  // start app
  earthquakeService.blastoff();
})