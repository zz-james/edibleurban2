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
        plots.push( _.pick(data, ['id', 'title','content','image','area_type','suggested_uses','map_data']) );
    });
    return plots;
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