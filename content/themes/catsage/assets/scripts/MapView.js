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
      overlayGroup    = undefined,
      drawnItemsGroup = undefined; // this becomes the editable layer

      numPlots = 0; // we use this as a basic diff. if the number of plots to render changes we rerender, otherwise skip rendering.


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
    if(numPlots !== store.getState().map.map_data.length) {
      numPlots = store.getState().map.map_data.length;
      console.log('rendering map');
      renderPlots(state.map_data);
    }
  };

  this.hide = function() {
    unbindEvents();
  };

  this.enableDrawing = function() {
    drawnItemsGroup = new L.featureGroup();  // create a layer-group (feature group is a layer group with events + pop-ups)
    drawnItemsGroup.addTo(map);              // add the new layer-group to the map

    var drawControls = new L.Control.Draw( createDrawControlOptions(drawnItemsGroup) ); // instance draw controls and pass the drawnitems group as the editable layer
    drawControls.addTo(map);                 // add the control to the map
  };

  this.getDrawnItemsAsCoordinates = function() {
    var coordinates = []
    var keys = _.keys(drawnItemsGroup._layers);
    _.each(keys, function(key, index, list){
      coordinates.push(normaliseLayerData(drawnItemsGroup._layers[key]._latlngs));
    });
    return coordinates;
  };

  // this is called on successfull ajax post of new plot
  this.clearDrawnItems = function() {
    drawnItemsGroup.clearLayers();
  }
  /* ----------------- private functions ------------------ */

  function createBaseLayers() {
    var baseMapLayer   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.5d749acb/{z}/{x}/{y}.png?access_token='+L.mapbox.accessToken, {reuseTiles : true});
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

      drawnItemsGroup.addLayer(e.layer); // adding the layer to the feature group gives it an id

      var type   = e.layerType,         // they're all polygons
          layer  = e.layer,             // the layer that was just created
          tempId = e.layer._leaflet_id;  // temp id assigned by leaflet, wordpress will give it an id when submitted

      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'enter-details'
      });

    });

    map.on('draw:edited', function(e){
      // nothing new is created but the details of the drawnitems layer group have changed.
    });

    map.on('draw:deleted', function(e){
      console.log(e);
    });


  }

  function normaliseLayerData(latlngs) {
    var coordinates = [];

    latlngs.forEach(function(element){
        var pair = [element.lng, element.lat];
        coordinates.push(pair);
    });

    // start and end point must match exactly so add the first point as the last
    coordinates.push(coordinates[0]);

    return coordinates;
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
                  color: '#000',
                  weight:1
              },
              showArea : true
          }
      },
      edit: {
          featureGroup: group,
          selectedPathOptions: {
          maintainColor: true,
          color: '#000',
          weight: 1
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
              container.setAttribute('border', '1px solid red' );

              L.DomEvent.addListener(this.infoButton, 'click', this._clicked, this);
              return container;
          },

          onRemove: function(map) {
              L.DomEvent.removeListener(this.infoButton, 'click', this._clicked, this);
          },

          _clicked: function(e) {
              if(store.getState().details.view) {
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
    startPos    : [32.778524, -96.795305],
}); // we pass in null for the $el as leaflet.js will handle the DOM