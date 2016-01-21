var store; // global variable that holds the map data.

L.mapbox.accessToken = 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'; // access token for mapbox


// ----- map ------ //
var startPos = [52.57, -0.25];                                        // default to peterborough.
var map      = L.mapbox.map('map', null, {scrollWheelZoom : false});  // instantiate the map

map.on('load', onMapLoad);

map.setView(startPos, 15);                                            // set view to our chosen geographical coordinates and zoom level


// ---- layers ---- //
var baseMapLayer   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.o2ii1n61/{z}/{x}/{y}.png?access_token='+L.mapbox.accessToken, {reuseTiles : true});
var SatelliteLayer = L.mapbox.tileLayer('mapbox.satellite', {reuseTiles : true});

baseMapLayer.addTo(map);    // add the baeMapLayer as default layer


// ----- layers controls ----- //
var baseLayers = {
    Map       : baseMapLayer,
    Satellite : SatelliteLayer
};
var LayerManager = L.control.layers(baseLayers, null, {collapsed:false}).addTo(map);   // instantiate layer control add layer switching control

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
        store = createStore(data);
        render(store);
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

  console.log([layer.getBounds()]);
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
        store.push( _.pick(data, ['id', 'title','content','featured_image','map_data']) );
    });
    return store;
}

/**
 * renders the store as geojson layers on the map. each geojson layer is added to a group depending on it's land type
 * @param  array store
 */
function render(store) {
    console.dir(store)
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