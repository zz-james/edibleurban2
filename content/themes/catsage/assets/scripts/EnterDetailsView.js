/**
 * template for a simple view object
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function EnterDetailsView($el, props) {

  this.$el  = $el;
  var scope = this;
  //Initialize the plugin
  $el.find('#suggestedUse').multiselect();  // jquery plug in initialisation

  /* ------------------- public methods ------------------- */
  this.initialise = function() {
    // you can just do stuff in the body of the function but
    // this is callable from outside if you need
    bindEvents();
  }

  this.render = function() {
  };

  this.hide = function() {
    unbindEvents();
  };

  /* ----------------- private functions ------------------ */

  function bindEvents() {
    
    $el.find("#fileupload").change(function(e){
      createWP_FileId(e.target);
      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'waiting'
      });
    });

    $el.find(".save-details").click(function(e){

      store.dispatch({
          type:'SET_TITLE_BODY',
          title: $el.find("#plotTitle").val(),
          body: $el.find("#plotBody").val()
      });

      store.dispatch({
          type:'SET_LAND_TYPE',
          land_type: $el.find('#areaType').val()
      });

      store.dispatch({
        type:'SET_SUGGESTED_USES',
        suggested_uses: $('option:selected', '#suggestedUse').map(function() { return this.value; }).get()
      });

      store.dispatch({
          type:'SIDEBAR_VIEW',
          view: 'waiting'
      });

      var xhr = saveNewPlot(store.getState().editing);

      xhr.then(function(data){

        store.dispatch({
            type:'SIDEBAR_VIEW',
            view: ''
        });
        map.clearDrawnItems();
        document.getElementById("detailsForm").reset();

        $('#suggestedUse option:selected').each(function() {
            $(this).prop('selected', false);
        })

        $('#suggestedUse').multiselect('refresh');


        // add the new plot to the map
        store.dispatch({
          type:'ADDPLOT',
          plot:filterKeys(data)
        });


      });

      xhr.fail(function(data){
        console.log('this failed');
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
