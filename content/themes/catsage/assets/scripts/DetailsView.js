/**
 * DetailsView view object constructor
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function DetailsView($el, props) {

  this.$el  = $el;
  var scope    = this,
      $display = $el.find('#display-view');  // cache this as we render here quite a bit
      // blah  = props.blah, // (.. etc)

  /* ------------------- public methods ------------------- */
  this.initialise = function() {
    // you can just do stuff in the body of the function but
    // this is callable from outside if you need to
    bindEvents();
  }

  this.render = function(details) {
    document.location.hash = details.view ? details.view+"-view" : details.view;
    if(details.view === 'display') {
      populateInfoWindow(details.displayed);
    }
  };

  this.hide = function() {
    unbindEvents();
  };



  /* ----------------- private functions ------------------ */

  function populateInfoWindow(id) {
    var plot = _.where(store.getState().map.map_data, {id: id})[0];  // this does not scale.
    if(plot.image === null){
      // collapse coords into a single array
      var arr = plot.map_data.geometry.coordinates[0];
      // get avarage to find approx. centre
      var cen = arr.reduce(function (prev, curr) { return [ prev[0] + curr[0] / arr.length, prev[1] + curr[1] / arr.length ] }, [0,0] );

      plot.image = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center="+cen[1]+","+cen[0]+"&zoom=17&size=150x150&key=AIzaSyBBY7yBxCXozlvzvEcEMkzuBar7EWK5h64";
    }
    $display.find('.plot-image').attr("src", plot.image);
    $display.find('.plot-title').html(plot.title.rendered);
    $display.find('.plot-content').html(plot.content.rendered);
    var suggested_uses = JSON.parse(plot.suggested_uses);
    if(suggested_uses.length) {
      $display.find('.plot-suggested-use').html(suggested_uses.join(", "));
    }
    $display.find('.plot-area-type').html(plot.area_type);
  }

  function bindEvents() {
    $('#loginform').submit(function(e){

        var $elem = $(e.target);
        $elem.find('p.status').text('Sending user info, please wait...');
        var loginrequest = postLogin($elem);

        loginrequest.done(function(data, textStatus, request){
            window.location.reload(false); 
            // if(data.loggedin == true) {
            //     CONFIG.logged_in = true;
            //     map.enableDrawing();
            //     store.dispatch({
            //         type:'SIDEBAR_VIEW',
            //         view: 'start'
            //     });
            // }
        });

        loginrequest.fail(function(data){
            console.log('login network fail :-(');
        });

        e.preventDefault();
    });
  }

  function unbindEvents() {
    $('#loginform').off('submit');
  }

  this.initialise();

  return this;
}

var detailsWindow = new DetailsView($('#info_container'), {});
