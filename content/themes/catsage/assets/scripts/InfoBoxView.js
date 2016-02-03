/**
 * InfoBoxView view object constructor
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function InfoWindowView($el, props) {

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

  this.render = function(infoWindow) {
    document.location.hash = infoWindow.view ? infoWindow.view+"-view" : infoWindow.view;
    if(infoWindow.view === 'display') {
      populateInfoWindow(infoWindow.displayed);
    }
  };

  this.hide = function() {
    unbindEvents();
  };



  /* ----------------- private functions ------------------ */

  function populateInfoWindow(id) {
    var plot = _.where(store.getState().map.map_data, {id: id})[0];
    console.log(plot);
    $display.find('.plot-image').attr("src", plot.image);
    $display.find('.plot-title').html(plot.title.rendered);
    $display.find('.plot-content').html(plot.content.rendered);
    $display.find('.plot-suggested-use').html(plot.area_type);
    $display.find('.plot-area-type').html(plot.suggested_use);
  }

  function bindEvents() {
    $('#loginform').submit(function(e){

        var $elem = $(e.target);
        $elem.find('p.status').text('Sending user info, please wait...');
        var loginrequest = postLogin($elem);

        loginrequest.done(function(data){
            if(data.loggedin == true) {
                CONFIG.logged_in = true;
                map.addDrawControls();
                document.location.hash = 'start-view';
            }
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

var infoWindow = new InfoWindowView($('#info_container'), {});
