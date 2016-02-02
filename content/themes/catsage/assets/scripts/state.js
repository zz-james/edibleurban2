// es5 polyfill for object.assign
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}


// we're using the redux pattern here so
// we have this single global state tree
// if the initial render is slow we could populate map data?
function getInitialState() {
    return {
        map :{
            map_data     : [],
            active_layer : undefined
        },
        info_window : {
            view: '',
            displayed: null
        },
        counter: 0
    }
}

var json = $.getJSON(CONFIG.api_url+'wp/v2/plots/?filter[posts_per_page]=-1');

json.done(function(data){
    // state.map_data = createStore(data);   // this needs to trigger the rendering
    store.dispatch({ type:'ADDPLOTS', plots:createStore(data) });
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
        plots.push( _.pick(data, ['id', 'title','content','image','area_type','map_data']) );
    });
    return plots;
}

/***********************************************************/

/**
 * This is a reducer, a pure function signiture is (state,action) => state
 * it describes how an action transforms the state into the next state
 *
 * the shape of the state is up to you, it can be primary, an array or 
 * an object or even a immutable.js data structure. The only important part
 * is that you should not mutate the state object, but return a new object
 * if the state changes.
 *
 * in this example we use a switch statement and strings but you can use a
 * helper that follows a different convention (such as function maps) if this
 * makes sense for your project.
 */

function counter(state, action) {

    if(typeof state === 'undefined') {
        return getInitialState();
    }

    switch(action.type) {
        case 'ADDPLOTS' :
            return Object.assign( {}, state, {
                map : Object.assign( {}, state.map, {
                    map_data : action.plots
                })
            });
        case 'INCREMENT':
            return Object.assign({}, state, {
                counter: state.counter + 1
            });
            break;
        case 'DECREMENT':
            return Object.assign({}, state, {
                counter: state.counter - 1
            });
            break;
        default:
            return state;
    }

}

/**
 * create a Redux store holding the state of your app/
 * its API is {subscribe, dispatch, getState}
 */
var store = Redux.createStore(counter);

var renderApp = function() {
    console.log(store.getState());
}

/**
 * called any time and action has been dispatched so you can
 * update the UI of your application
 */
store.subscribe(renderApp);
renderApp();

store.dispatch({type:'INCREMENT'});  // 1
// store.dispatch({type:'INCREMENT'});  // 2
// store.dispatch({type:'DECREMENT'});  // 1








