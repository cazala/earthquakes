// app module
angular.module('earthquakeApp')

// earthquakes service
.factory('earthquakeService', function(configService, $rootScope){
  return {

    continents: ['europe', 'asia', 'africa', 'north_america', 'south_america', 'antartica', 'oceanic'],
    infoWindowContent: _.template('<b>Magnitud:</b> <%= quake.mag %> <br />' +
                                    '<b>Lugar:</b> <%= quake.place %> <br />' +
                                    '<b>Fecha:</b> <%= quake.dateAsString %>'),
    ref: undefined,
    map: undefined,
    globe: undefined,
    timeout: undefined,
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

      if (configService.viewMode == 'globe'){
        this.globe = new DAT.Globe(container, { imgDir: 'images/' });
      } else {
        this.map = new google.maps.Map(container, {zoom: 3, disableDefaultUI: true, mapTypeId: google.maps.MapTypeId.SATELLITE });
        $(container).addClass('map');
      }

      // SET LISTENERS FOR NEW EARTHQUAKE EVENTS ON ALL CONTINENTS
      _.forEach(this.continents, function(continent) {
        if (configService.continentFilter == "all" || continent == configService.continentFilter)
        for (var mag = configService.magFilter; mag < 10; mag++) {
          magRef = self.ref.child(continent).child(mag.toString());
          magRef.orderByKey().limitToFirst(500).on('child_added', self.addQuake, self);
        }
      });
    },

    addQuake: function(snapshot) {
      var self = this;
      var quake = snapshot.val();

      if (configService.validQuake(quake)) {
        if (configService.viewMode == 'globe') {
          $rootScope.count = configService.count();
          var mag = quake.mag;
          if (mag > 1){
            mag *= mag * mag;
          }
          mag /= 1000;
          self.data = self.data.concat([quake.location.lat, quake.location.lng, mag]);

          this.renderGlobe();
        } else {
          var quakeDate = new Date(quake.time);
          quake.dateAsString = quakeDate.getDay() + " de " + [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ][quakeDate.getMonth()] + ", " + quakeDate.getFullYear();

          var quakeLatLng = new google.maps.LatLng(quake.location.lat, quake.location.lng);
          var marker = new google.maps.Marker({
            position: quakeLatLng,
            map: this.map,
            animation: google.maps.Animation.DROP
          });

          self.map.setCenter(quakeLatLng);
          $rootScope.connected = true;
          $rootScope.$digest();

          // LISTEN FOR USERS TO CLICK ON GOOGLE MAPS PLACE ICON
          google.maps.event.addListener(marker, 'click', function () {
            var templateData = {quake: quake};
            var infoWindow = new google.maps.InfoWindow({
              content: self.infoWindowContent(templateData)
            });

            if (self.previousInfoWindow) {
              self.previousInfoWindow.close();
            }

            infoWindow.open(self.map, marker);
            self.previousInfoWindow = infoWindow;
          });
        }
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