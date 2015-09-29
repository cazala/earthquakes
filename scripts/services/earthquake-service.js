// app module
angular.module('earthquakeApp')

// earthquakes service
.factory('earthquakeService', function(maxFilter, daysFilter, magFilter, continentFilter, $rootScope){
  return {

    continents: ['europe', 'asia', 'africa', 'north_america', 'south_america', 'antartica', 'oceanic'],
    ref: undefined,
    globe: undefined,
    timeout: undefined,
    count: 0,
    data: [],

    blastoff: function() {
      if(!Detector.webgl){
        Detector.addGetWebGLMessage();
      } else {
        angular.element("body").css("display", "block");
        this.ref = new Firebase('https://publicdata-earthquakes.firebaseio.com/by_continent/');
        this.fetchContinents();
      }
    },

    fetchContinents: function() {
      var self = this;
      var magRef;

      var container = document.getElementById('container');
      var globe = new DAT.Globe(container, {
        imgDir: 'images/'
      });

      this.globe = globe;

      // SET LISTENERS FOR NEW EARTHQUAKE EVENTS ON ALL CONTINENTS
      _.forEach(this.continents, function(continent) {
        if (continentFilter == "all" || continent == continentFilter)
        for (var mag = magFilter; mag < 10; mag++) {
          magRef = self.ref.child(continent).child(mag.toString());
          magRef.orderByKey().limitToFirst(500).on('child_added', self.addQuake, self);
        }
      });
    },

    addQuake: function(snapshot) {
      var self = this;
      var quake = snapshot.val();
      var ms = new Date - 1000 * 60 * 60 * 24 * daysFilter;

      if (self.count < maxFilter && quake.mag > magFilter && quake.time > ms)
      {
        self.count++;
        $rootScope.count = self.count;
        var mag = quake.mag;
        if (mag > 1){
          mag *= mag * mag;
        }
        mag /= 1000;
        self.data = self.data.concat([quake.location.lat, quake.location.lng, mag]);

        this.renderGlobe();
      }
    },

    renderGlobe: function(){
      var self = this;
      if (self.timeout) {
        clearTimeout(self.timeout);
      }
      self.timeout = setTimeout(function(){
        self.globe.addData(self.data, {format: 'magnitude', name: "earthquakes"});
        self.globe.createPoints();
        self.globe.animate();

        $rootScope.connected = true;
        $rootScope.$digest();

        console.log(self.data.length / 3);
      }, 500);
    }
  };
})