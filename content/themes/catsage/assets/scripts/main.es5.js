(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var model = require('./modules/model.js');
var view = require('./modules/view.js');

var app = {
  init: function () {
    model.init();
    view.init();
  }
};

app.init();

},{"./modules/model.js":2,"./modules/view.js":3}],2:[function(require,module,exports){
var model = module.exports = {
  init: function () {
    console.log('model initialised');
  }
};

},{}],3:[function(require,module,exports){
var view = module.exports = {
  init: function () {
    console.log('view initialised');
  }
};

},{}]},{},[1])


//# sourceMappingURL=main.es5.js.map
