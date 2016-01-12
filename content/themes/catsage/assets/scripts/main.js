var model = {
  init : function() {
    console.log('model initialised');
  }
};

var helper = {

};

var view = {
  init : function() {
    console.log('view initialised');
  }
};

var app = {
  init : function() {
    model.init();
    view.init();
  }
};

app.init();
