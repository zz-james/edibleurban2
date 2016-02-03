
/**
 * Redux.combineReducers is a factory method which returns a reducer function (state, action) => state
 * keys are the props managed by the child reducers, values are the names of the relevant child reducers
 * @type {[type]}
 */
var edibleUrbanApp = Redux.combineReducers({
    map: plots,
    info_window: info_window
});

/**
 * reducer to manage the map part of the state tree
 * logically this should be called 'map' but that is a reservered word
 * @param  {object} state:  the map part of the state tree
 * @param  {object} action: action to transform the state
 * @return {object} entirely new object to replace the map part of the state tree
 */
function plots(state, action) {

    if(typeof state === 'undefined') {
        state = {
            map_date: [],
            active_layer : undefined
        };
    }

    switch (action.type) {
        case 'ADDPLOTS':
            return { map_data : action.plots, active_layer : state.active_layer }
            break;
        default:
            return state;
    }
}

/**
 * reducer to manage the info_window part of the state tree
 * @param  {object} state:  the info_window part of the state tree
 * @param  {object} action: action to transform the state
 * @return {object} entirely new object to replace the info_window part of the state tree
 */
function info_window(state, action) {

    if(typeof state === 'undefined') {
        state = {
            view     : CONFIG.logged_in ? '' : 'help',
            displayed: null
        };
    }

    switch(action.type) {
        case 'SIDEBAR_VIEW':
            return { view: action.view, displayed: action.id };
            break;
        default:
            return state
    }
}

/**
 * create a Redux store from the parent edibleUrbanApp reducer
 * holding the complete state of the app.
 * its API is {subscribe, dispatch, getState}
 */
var store = Redux.createStore(edibleUrbanApp);

var renderApp = function() {
    // console.log(store.getState());
    infoWindow.render(store.getState().info_window);
    map.render(store.getState().map);
}

/**
 * the method passed to subscribe is called any time
 * an action has been dispatched so you can
 * update the UI of your application
 */
store.subscribe(renderApp);
renderApp();

// store.dispatch({type:'INCREMENT'});  // 1
// store.dispatch({type:'INCREMENT'});  // 2
// store.dispatch({type:'DECREMENT'});  // 1








