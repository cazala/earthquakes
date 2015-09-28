if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {

  /*
  var container = document.getElementById('container');
  var globe = new DAT.Globe(container, {
    imgDir: '/images/'
  });

  console.log(globe);
  var i, tweens = [];
  
  var settime = function(globe, t) {
    return function() {
      new TWEEN.Tween(globe).to({time: t},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
    };
  };
  
  var xhr;
  TWEEN.start();
  
  
  xhr = new XMLHttpRequest();
  xhr.open('GET', '/data/population909500.json', true);
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        window.data = data;
        for (i=0;i<data.length;i++) {
          console.log(data[i])
          globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
        }
        globe.createPoints();
        settime(globe,0)();
        globe.animate();
        document.body.style.backgroundImage = 'none'; // remove loading
      }
    }
  };
  xhr.send(null);
  */

  var earthquakes = {
    continents: ['europe', 'asia', 'africa', 'north_america', 'south_america', 'antartica', 'oceanic'],
    ref: undefined,
    globe: undefined,
    timeout: undefined,
    data: [],
    /*
     * init
     *
     * initialize the module
     */
    init: function() {
      this.ref = new Firebase('https://publicdata-earthquakes.firebaseio.com/by_continent/');
      this.fetchContinents();
      this.globe.zoom(10);
    },
    /*
     * fetchContinents
     *
     * initialize the Google Maps API and listen for new earthquakes to be added
     */
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
        for (var mag = 0; mag < 10; mag++) {
          magRef = self.ref.child(continent).child(mag.toString());
          magRef.orderByKey().limitToLast(100).on('child_added', self.addQuake, self);
        }
      });
    },
    /*
     * renderQuakeMarkers
     *
     * plot earthquake event on the map and enable clicking to reveal more earthquake info
     */
    addQuake: function(snapshot) {
      var self = this;
      var quake = snapshot.val();
      
      //console.log(quake);
      //globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
      var mag = quake.mag;
      if (mag > 1){
        mag *= mag * mag;
      }
      mag /= 1000;
      self.data = self.data.concat([quake.location.lat, quake.location.lng, mag]);

      this.renderGlobe();
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

        console.log(self.data.length);
      }, 500);
    }
  };

  $(document).ready(function(){
    earthquakes.init();
    // Set a timeout...
    setTimeout(function(){
      // Hide the address bar!
      window.scrollTo(0, 1);
    }, 0);
  });
}