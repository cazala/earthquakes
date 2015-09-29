// app module
angular.module('earthquakeApp')

// filter controller
.controller('filterCtrl', function(filterService, $scope){
  $scope.maxFilter        = filterService.maxFilter;
  $scope.daysFilter       = filterService.daysFilter;
  $scope.magFilter        = filterService.magFilter;
  $scope.continentFilter  = filterService.continentFilter;
  $scope.filter           = filterService.filter;
})