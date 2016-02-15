var json = $.getJSON(CONFIG.api_url+'wp/v2/plots/?filter[posts_per_page]=-1');

json.done(function(data){
    store.dispatch({
        type:'ADDPLOTS',
        plots:createStore(data)
    });
});

json.fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});

/**
 * factory for store that map application uses construction is mainly a filter on the data to preserve only what we need
 * @param  array data : the data from the server about the plots
 * @return array store: the data we need.
 */
function createStore(data) {
    var plots = [];
    _.each(data, function(data){
        plots.push( filterKeys(data) );
    });
    return plots;
}

function filterKeys(data) {
  return _.pick(data, ['id', 'title','content','image','area_type','suggested_uses','map_data'])
}

/**
 * post the user credentials to the ajax login end point
 * @param  {jquery} $form - jQuery object with the form
 * @return {jquery promise} loginrequest - jquery ajax xhr promise
 */
function postLogin($form) {

    var data = {
        'action'    : 'ajaxlogin',
        'username'  : $form.find('#user_login').val(),
        'password'  : $form.find('#user_pass').val(),
        'remember'  : $form.find('#rememberme').val(),
        'security'  : $form.find('#security').val()
    };

    var loginrequest = $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : $form[0].action, // the url is in the action attribute of the form tag
        data    : data
    });

    return loginrequest;
}

/**
 * uploads to media endpoint in wordpress wp-api which
 * creates a new file on the server in the media library
 * and returns info about the file incl. full url
 * @param  {FomrData} fd        : see https://developer.mozilla.org/en/docs/Web/API/FormData
 * @param  {string}   filename  : string - the file name unchanged from local
 * @return {xhrpromise}         : returns async promise for resolving in the original caller
 */
function uploadMedia(fd, filename) {

  var upload = $.ajax({
    url: CONFIG.api_url + 'wp/v2/media',
    headers: {
        'X-WP-Nonce'          : CONFIG.api_nonce,
        'Content-Disposition' : 'filename='+filename
    },
    type        : 'POST',
    data        : fd,
    cache       : false,
    contentType : false,
    processData : false,
  });

  return upload;
}


/**
 * this is shit and we have to sort it out but we'll do it tomorrow probably.
 * @param  {[type]} newPlot [description]
 * @return {[type]}         [description]
 */
function saveNewPlot(newPlot) {
  var payload = {};
  payload.suggested_uses = (newPlot.suggested_uses).join();
  payload.area_type      = newPlot.land_type;
  payload.content        = newPlot.body;
  payload.excerpt        = '';
  payload.image          = newPlot.imageId;
  payload.title          = newPlot.title;
  payload.geo_json = makeFeatureObject(newPlot);

  var post = $.ajax({
    url: CONFIG.api_url+'edible_urban/v2/plots',
    headers: {
        'X-WP-Nonce'  : CONFIG.api_nonce
    },
    type: 'POST',
    dataType: 'json',
    data: payload
  });
  return post;
}

function makeFeatureObject(data) {
  var obj = {};
  obj.type = "Feature",
  obj.geometry = {
    type: "Polygon",
    coordinates : map.getDrawnItemsAsCoordinates()
  },
  obj.properties = {
    name:data.title,
    body:data.body,
    areatype:data.land_type
  }
  return JSON.stringify(obj);
}

