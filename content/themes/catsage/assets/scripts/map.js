L.mapbox.accessToken = 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'; // access token for mapbox


// ----- map ------ //
var startPos = [52.57, -0.25];                                        // default to peterborough.
var map      = L.mapbox.map('map', null, {scrollWheelZoom : false});  // instantiate the map

map.on('load', render);

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


// -------- drawing controls (only if logged in)----- //
function addDrawControls() {
    var drawnItems = new L.featureGroup();          // create a layer-group (feature group is a layer group with events + pop-ups)
    drawnItems.addTo(map);                          // add the new layer-group to the map

    var drawControls = new L.Control.Draw( createDrawControlOptions(drawnItems) );
    drawControls.addTo(map);                       // add the control to the map

    return drawnItems;
}

var drawnItemsGroup = CONFIG.logged_in ? addDrawControls() : '';


/**
 * When the polygon drawing is completed this method adds
 * the layer (containing the polygon) to the drawnitems feature group
 * @param  leaflet event object:e  // contains the layer with the newly drawn polygon on
 */
map.on('draw:created', function(e){
  var type  = e.layerType,
      layer = e.layer;

  console.log('drawing bounds are: '+[layer.getBounds()]);
  drawnItemsGroup.addLayer(layer);
});






// -------- info button control ----- //

// create control 'class' to make an instance of
L.Control.Info = createInfoControl();

// info control factory
L.control.info = new L.Control.Info({
    'text'      : 'info',
    'iconUrl'   : 'https://api.mapbox.com/mapbox.js/v2.2.3/images/icons-000000@2x.png',
    'onClick'   : onInfoClick,
    'maxWidth'  : '30px'
}).addTo(map);


function onInfoClick(e){
    console.log('this happened');
    if(!document.location.hash) {
        document.location.hash = 'start-view';
    } else {
        document.location.hash = '';
    }
}


// ------------------------------------------------------------------- //



/**
 * renders the mapdata as geojson layers on the map. each geojson layer is added to a group depending on it's land type
 * @param  array mapdata
 */
function render() {
    // var mapdata = state.map_data;

    // _.each(mapdata, function(element, index, list) {
    //     var geojsonGroup = element.area_type ? element.area_type.replace(/ /g,"_") : 'Unknown';
    //     geojsonGroups[geojsonGroup].addData(element.map_data);
    //     geojsonGroups[geojsonGroup].addTo(map);
    // });
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
 * refers to the IControl interface
 * http://leafletjs.com/reference.html#icontrol
 */
function createInfoControl() {
    var control = L.Control.extend({

        options: {
            position: 'topleft'
        },

        initialise: function(options) {
            L.Util.setOptions(this.options);
        },

        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'leaflet-info-button');

            this.infoButton = L.DomUtil.create('div', 'leaflet-buttons-info-button', container);
            this.infoButton.width = this.maxWidth;

            var image     = L.DomUtil.create('img', 'leaflet-buttons-into-image', this.infoButton);
            image.src = this.options.iconUrl;

            container.setAttribute('border', '1px solid red' );

            L.DomEvent.addListener(this.infoButton, 'click', this._clicked, this);
            return container;
        },

        onRemove: function(map) {
            L.DomEvent.removeListener(this.infoButton, 'click', this._clicked, this);
        },

        _clicked: function(e) {
            onInfoClick();
            L.DomEvent.preventDefault(e)
        }
    });
    return control;
}

