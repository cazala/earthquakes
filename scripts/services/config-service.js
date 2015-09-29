// app module
angular.module('earthquakeApp')

// earthquakes service
.factory('configService', function($window){

	// read values from query
	var maxFilter 			= query('max', "3000"),
		daysFilter			= query('days', "30"),
		magFilter			= query('mag', "3"),
		continentFilter		= query('continent', "all"),
		viewMode 			= query('view', "world"),
		quakesCount			= 0;

	// API
	return {
		maxFilter: 			maxFilter, 	
		daysFilter: 		daysFilter,
		magFilter: 			magFilter,		
		continentFilter: 	continentFilter,
		applyConfig: 		applyConfig,
		validQuake: 		validate,
		count: 				count
	}

	// call filter url
	function applyConfig(opts){
		var url = $window.location.href.replace($window.location.search, '').replace($window.location.hash, '');
	    $window.location.href = url + '?' +
	      'max=' + (opts.maxFilter || maxFilter) + "&" +
	      'days=' + (opts.daysFilter || daysFilter) + "&" +
	      'mag=' + (opts.magFilter || magFilter) + "&" +
	      'continent=' + (opts.continentFilter || continentFilter) + "&" +
	      'view=' + (opts.viewMode || viewMode)
	}

	// validate quake
	function validate(quake) {
		var ms = new Date - 1000 * 60 * 60 * 24 * daysFilter;
		return quakesCount < maxFilter && quake.mag > magFilter && quake.time > ms;
	}

	// count quakes
	function count(){
		return ++quakesCount;
	}

	// extract param from query
	function query(paramName, defaults){
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