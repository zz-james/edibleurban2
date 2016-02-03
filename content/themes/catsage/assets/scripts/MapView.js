/**
 * MapView object
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function MapView($el, props) {

  this.$el = $el;
  var scope        = this,
      accessToken  = props.accessToken,
      startPos     = props.startPos,
      map          = L.mapbox.map('map', null, {scrollWheelZoom : false}),

      layerControl    = undefined, // we define these later
      overlayGroup    = undefined;
      drawnItemsGroup = undefined, // this becomes the editable layer


  /* ------------------- public methods ------------------- */
  this.initialise = function() {
    L.mapbox.accessToken = accessToken;
    map.setView(startPos, 15);

    // layer initialisations
    var baseLayers = createBaseLayers(); // object that holds base layers {name:tilelayer}
    baseLayers.Map.addTo(map);           // add the base Map layer as default layer

    layerControl = createLayerControl(baseLayers);
    layerControl.addTo(map);

    overlayGroup = createAndAddOverlayLayers();

    // other controls initialisations
    L.control.scale({position:'bottomright'}).addTo(map); // scale indicator

    CONFIG.logged_in ? this.enableDrawing() : null; // only add draw controls here if initialising with a logged in session

    // create button to control the slide out help panel
    L.control.info = createInfoControl({
        'text'      : 'info',
        'iconUrl'   : 'https://api.mapbox.com/mapbox.js/v2.2.3/images/icons-000000@2x.png',
        'maxWidth'  : '30px'
    }).addTo(map);

    bindEvents();
  }

  this.render = function(state) {
    renderPlots(state.map_data);
  };

  this.hide = function() {
    unbindEvents();
  };

  /**
   * I think we'll be coming back to this little monkey....
   */
  this.enableDrawing = function() {
    drawnItemsGroup = new L.featureGroup();  // create a layer-group (feature group is a layer group with events + pop-ups)
    drawnItemsGroup.addTo(map);              // add the new layer-group to the map

    var drawControls = new L.Control.Draw( createDrawControlOptions(drawnItemsGroup) ); // instance draw controls and pass the drawnitems group as the editable layer
    drawControls.addTo(map);                 // add the control to the map
  }

  /* ----------------- private functions ------------------ */

  function createBaseLayers() {
    var baseMapLayer   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.o2ii1n61/{z}/{x}/{y}.png?access_token='+L.mapbox.accessToken, {reuseTiles : true});
    var satelliteLayer = L.mapbox.tileLayer('mapbox.satellite', {reuseTiles : true});
    return {
        Map       : baseMapLayer,
        Satellite : satelliteLayer
    };                          // group layers in object to send to the layer control

  }

  function createLayerControl(baseLayers) {
    return L.control.layers(baseLayers, null, {collapsed:false});   // instantiate layer control add layer switching control
  }

  /**
   * generates a geojson feature group layer for every entry specified in suggested use array (part of CONFIG)
   * @return {object} collection of geoJSON feature groups stored by suggested use key
   */
  function createAndAddOverlayLayers() {

    var overlayGroup = {};

    // create object with area types as keys add a geojson feature group for each one add them to layer control
    _.each(CONFIG.suggested_use, function(value, key, list) {

        var geojsonLayer = L.geoJson( null , {

            style         : function() {
              return { fillColor: value || '#000000', opacity: 1, color: 'red', weight:1, fillOpacity: 0.6 };  // if no land type specified make it black
            },

            onEachFeature : function(feature, layer) { // each feature in the layer will have this applied when it is added
                layer.on('click',function(){
                  store.dispatch({
                    type:'SIDEBAR_VIEW',
                    view: 'display',
                    id  : this.feature.id
                  });
                });
            }

        });

        var newKey = key.replace(/ /g,"_"); // replace spaces in key e.g. 'pedestrial area' becomes 'pedestrian_area'
        var icon   = '<svg width="20" height="12"><rect width="20" height="12" style="fill:'+value+'" /></svg>';

        overlayGroup[newKey] = geojsonLayer;
        layerControl.addOverlay(geojsonLayer, icon+'&nbsp;'+key);
    }); // end of _each loop
    return overlayGroup;
  }

  function bindEvents() {
    /**
     * When the polygon drawing is completed this method adds
     * the layer (containing the polygon) to the drawnitems feature group
     * @param  leaflet event object:e  // contains the layer with the newly drawn polygon on
     */
    map.on('draw:created', function(e){
      var type  = e.layerType,  // they're all polygons
          layer = e.layer;      // the layer that was just created

      console.dir(layer);
      drawnItemsGroup.addLayer(layer);
      // we need to pop up the enter details form now.
      // and maybe disable drawing button so only one polygon can be drawn?
    });

    map.on('draw:edited', function(e){
      // nothing new is created but the details of the drawnitems layer group have changed.

      console.dir(e.layers);
        // var layers = e.layers;
        // layers.eachLayer(function (layer) {
        // //do whatever you want, most likely save back to db
        // });
    });

    map.on('draw:deleted', function(e){
      console.log(e);
    });


  }

  function unbindEvents() {

  }


  /**
 * renders the mapdata as geojson layers on the map. each geojson layer is added to a group depending on it's land type
 * @param  array mapdata
 */
function renderPlots(mapdata) {
    _.each(mapdata, function(element, index, list) {
        element.map_data.id = element.id; // copy in the post id into the properties so they are added to the layer data
        var geojsonGroup = element.area_type ? element.area_type.replace(/ /g,"_") : 'Unknown';
        overlayGroup[geojsonGroup].addData(element.map_data);
        overlayGroup[geojsonGroup].addTo(map);
    });
}

  /**
   * factory method: create the draw controls options object
   */
  function createDrawControlOptions(group) {

    return {
      draw: {
          polyline : false,
          rectangle: false,
          circle   : false,
          marker   : false,
          polygon  : {
              allowIntersection : false, // Restricts shapes to simple polygons
              drawError         : {
                  color   : '#e1e100', // Color the shape will turn when intersects
                  message : '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
              },
              shapeOptions : {
                  color: '#000'
              },
              showArea : true
          }
      },
      edit: {
          featureGroup: group,
          selectedPathOptions: {
          maintainColor: true,
          color: '#000',
          weight: 10
        }
      }
    }
  }


  /**
   * factory method: create the info button class
   * and return a new instance of it.
   * refers to the IControl interface
   * http://leafletjs.com/reference.html#icontrol
   */
  function createInfoControl(props) {
      var control = L.Control.extend({

          options: {
              position: 'bottomleft'
          },

          initialise: function(options) {
              L.Util.setOptions(this.options);
          },

          onAdd: function(map) {
              var container = L.DomUtil.create('div', 'leaflet-info-button');

              this.infoButton = L.DomUtil.create('div', 'leaflet-buttons-info-button', container);
              this.infoButton.width = this.maxWidth;

              // var image     = L.DomUtil.create('img', 'leaflet-buttons-into-image', this.infoButton);
              // image.src = this.options.iconUrl;

              container.setAttribute('border', '1px solid red' );

              L.DomEvent.addListener(this.infoButton, 'click', this._clicked, this);
              return container;
          },

          onRemove: function(map) {
              L.DomEvent.removeListener(this.infoButton, 'click', this._clicked, this);
          },

          _clicked: function(e) {
              if(store.getState().info_window.view) {
                store.dispatch({
                    type:'SIDEBAR_VIEW',
                    view: ''
                });
                return;
              }
              if(CONFIG.logged_in) {
                store.dispatch({
                    type:'SIDEBAR_VIEW',
                    view: 'start'
                });
              } else {
                store.dispatch({
                    type:'SIDEBAR_VIEW',
                    view: 'help'
                });
              }
              L.DomEvent.preventDefault(e)
          }
      });
      return new control(props);
  }

  this.initialise();

  return this;
}

var map = new MapView(null, {
    accessToken : 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg', // access token for mapbox
    startPos    : [52.57, -0.25],
}); // we pass in null for the $el as leaflet.js will handle the DOM