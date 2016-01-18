L.mapbox.accessToken = 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'; // access token for mapbox


// ----- map ------ //
var startPos = [52.57, -0.25];                                        // default to peterborough.
var map      = L.mapbox.map('map', null, {scrollWheelZoom : false});  // instantiate the map
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
L.control.layers(baseLayers, null, {collapsed:false}).addTo(map);   // instantiate layer control add layer switching control

// -------- scale indicator ---- //
L.control.scale({position:'bottomright'}).addTo(map);

// -------- drawings ----- //
var drawnItems = new L.featureGroup();          // create a layer-group (feature group is a layer group with events + pop-ups)
drawnItems.addTo(map);                          // add the new layer-group to the map

var drawControls = new L.Control.Draw( createDrawControlOptions() );
drawControls.addTo(map);                       // add the control to the map


// --------- events ------ //
map.on('draw:created', function(e){
  var type  = e.layerType,
      layer = e.layer;

  console.log([type,layer]);
  drawnItems.addLayer(layer);
});


// ------------------------------------------------------------------- //

/**
 * create the draw controls options
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