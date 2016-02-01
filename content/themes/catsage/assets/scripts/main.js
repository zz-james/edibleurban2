L.mapbox.accessToken = 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'; // access token for mapbox


// ----- map ------ //
var startPos = [52.57, -0.25];                                        // default to peterborough.
var map      = L.mapbox.map('map', null, {scrollWheelZoom : false});  // instantiate the map

map.on('load', onMapLoad);

map.setView(startPos, 15);                                            // set view to our chosen geographical coordinates and zoom level


// ---- base layers ---- //
var baseMapLayer   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.o2ii1n61/{z}/{x}/{y}.png?access_token='+L.mapbox.accessToken, {reuseTiles : true});
var satelliteLayer = L.mapbox.tileLayer('mapbox.satellite', {reuseTiles : true});

baseMapLayer.addTo(map);    // add the baeMapLayer as default layer

// ----- layers controls ----- //
var baseLayers = {
    Map       : baseMapLayer,
    Satellite : satelliteLayer
};
var LayerManager = L.control.layers(baseLayers, null, {collapsed:false}).addTo(map);   // instantiate layer control add layer switching control

// ----- geojson feature layers ------ //
var geojsonGroups = {};

// create object with area types as keys add a geojson feature group for each one add them to layer control
_.each(CONFIG.suggested_use, function(value, key, list){
    var geojsonLayer = L.geoJson(null,{
        style         : function() {
          return {fillColor: value || '#000000', opacity: 1, color: 'red', weight:1, fillOpacity: 0.6 };  // if no land type specified make it black
        },
        onEachFeature : function(feature, layer) {
            layer.on('click',function(){
                console.log(this.feature.properties.name);
            }); 
        }
    });
    var newKey       = key.replace(/ /g,"_"); // replace spaces in key
    var icon         = '<svg width="20" height="12"><rect width="20" height="12" style="fill:'+value+'" /></svg>';

    geojsonGroups[newKey] = geojsonLayer;
    LayerManager.addOverlay(geojsonLayer, icon+'&nbsp;'+key);
});




// -------- scale indicator ---- //
L.control.scale({position:'bottomright'}).addTo(map);

// -------- drawings ----- //
var drawnItems = new L.featureGroup();          // create a layer-group (feature group is a layer group with events + pop-ups)
drawnItems.addTo(map);                          // add the new layer-group to the map

var drawControls = new L.Control.Draw( createDrawControlOptions() );
drawControls.addTo(map);                       // add the control to the map


// --------- events ------ //

/**
 * this handles the map load event assigned near the top (as it happens early on)
 */
function onMapLoad() {
    var json = $.getJSON(CONFIG.api_url+'wp/v2/plots/?filter[posts_per_page]=-1');
    json.done(function(data){
        state.map_data = createStore(data);
        render(state.map_data);
    });
    json.fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });
}

/**
 * When the polygon drawing is completed this method adds
 * the layer (containing the polygon) to the drawnitems feature group
 * @param  leaflet event object:e  // contains the layer with the newly drawn polygon on
 */
map.on('draw:created', function(e){
  var type  = e.layerType,
      layer = e.layer;

  console.log('drawing bounds are: '+[layer.getBounds()]);
  drawnItems.addLayer(layer);
});



// ------------------------------------------------------------------- //

/**
 * factory for store that map application uses construction is mainly a filter on the data to preserve only what we need
 * @param  array data : the data from the server about the plots
 * @return array store: the data we need.
 */
function createStore(data) {
    var store = [];
    _.each(data, function(data){
        store.push( _.pick(data, ['id', 'title','content','image','area_type','map_data']) );
    });
    return store;
}

/**
 * renders the store as geojson layers on the map. each geojson layer is added to a group depending on it's land type
 * @param  array store
 */
function render(store) {
    _.each(store, function(element, index, list) {
        var geojsonGroup = element.area_type ? element.area_type.replace(/ /g,"_") : 'Unknown';
        geojsonGroups[geojsonGroup].addData(element.map_data);
        geojsonGroups[geojsonGroup].addTo(map);
    });
}



/**
 * factory method: create the draw controls options object
 */
function createDrawControlOptions() {

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
        featureGroup: drawnItems,
        selectedPathOptions: {
            maintainColor: true,
            color: '#000',
            weight: 10
        }
    }
  }
}