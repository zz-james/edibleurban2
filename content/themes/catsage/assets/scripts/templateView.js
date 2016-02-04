/**
 * template for a simple view object
 * @param {jquery} $el   [jquery object wrapping parent element of DOM fragment we're managing]
 * @param {object} props [object containing config props]
 */
function TemplateView($el, props) {

  this.$el  = $el;
  var scope = this,
      blah  = props.blah; // (.. etc)

  /* ------------------- public methods ------------------- */
  this.initialise = function() {
    // you can just do stuff in the body of the function but
    // this is callable from outside if you need
  }

  this.render = function() {
    scope.$el.append(html);
    bindEvents();
  };

  this.hide = function() {
    scope.$el.find('.whatever').remove();
    unbindEvents();
  };

  /* ----------------- private functions ------------------ */

  function privateMethod1() {

  }

  function bindEvents() {

  }

  function unbindEvents() {
  }

  this.initialise();

  return this;
}