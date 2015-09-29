// app module
angular.module('earthquakeApp')

// earthquakes service
.factory('filterService', function($window){

	// read values from query
	var maxFilter 			= getParam('max', "3000"),
		daysFilter			= getParam('days', "30"),
		magFilter			= getParam('mag', "3"),
		continentFilter		= getParam('continent', "all")

	// API
	return {
		maxFilter: 			maxFilter, 	
		daysFilter: 		daysFilter,
		magFilter: 			magFilter,		
		continentFilter: 	continentFilter,
		filter: 			filter
	}

	// call filter url
	function filter(opts){
		var url = $window.location.href.replace($window.location.search, '').replace($window.location.hash, '');
    $window.location.href = url + '?' +
      'max=' + (opts.maxFilter || maxFilter) + "&" +
      'days=' + (opts.daysFilter || daysFilter) + "&" +
      'mag=' + (opts.magFilter || magFilter)+ "&" +
      'continent=' + (opts.continentFilter || continentFilter);
  }

  // extract param from query
  function getParam(paramName, defaults){
	  var query = location.search.replace('?', '').split('&');
	  var ret = defaults;
	  query.forEach(function(param){
	    var split = param.split('=');
	    var name = split[0];
	    var value = split[1];
	    if (name == paramName) {
	      ret = value;
	    }
	  });
	  return ret;
	}
});