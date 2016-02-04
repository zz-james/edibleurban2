/**
 * template for a simple view object
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function EnterDetailsView($el, props) {

  this.$el  = $el;
  var scope = this;
      // blah  = props.blah; // (.. etc)

  /* ------------------- public methods ------------------- */
  this.initialise = function() {
    // you can just do stuff in the body of the function but
    // this is callable from outside if you need
    bindEvents();
  }

  this.render = function() {
  };

  this.hide = function() {
    scope.$el.find('.whatever').remove();
    unbindEvents();
  };

  /* ----------------- private functions ------------------ */

  function privateMethod1() {

  }

  function bindEvents() {
    $el.find("#fileupload").change(function(e){
      createWP_FileId(e.target);
      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'waiting'
      });
    });
    $el.find(".add-land-type").click(function(e){

      store.dispatch({
          type:'SET_TITLE_BODY',
          title: $el.find("#plotTitle").val(),
          body: $el.find("#plotBody").val()
      });
      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'land-type'
      });

    });
    $el.find(".add-suggested-use").click(function(e){

      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'suggested-use'
      });

    });

    $el.find(".save-details").click(function(e){

      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: ''
      });

    });

  }


  function createWP_FileId(el) {
    var file = el.files[0];
    var fd = new FormData();
    fd.append('file',file);
    var xhr = uploadMedia(fd, file.name)
    xhr.then(function(data){

      store.dispatch({
        type:'SET_IMAGE',
        imageId: data.id
      });

      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'enter-details'
      });

    });
    xhr.fail(function(data){
      console.log('upload failed '+data);
    })
  };

  function unbindEvents() {
  }

  this.initialise();

  return this;
}

var enterDetails = new EnterDetailsView($('#info_container'), {});
