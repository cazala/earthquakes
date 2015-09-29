// app module
angular.module('earthquakeApp')

// filter controller
.controller('filterCtrl', function(configService, $scope){
  $scope.maxFilter        = configService.maxFilter;
  $scope.daysFilter       = configService.daysFilter;
  $scope.magFilter        = configService.magFilter;
  $scope.continentFilter  = configService.continentFilter;
  $scope.filter           = filter;

  function filter(){
  	configService.applyConfig($scope);
  }
})