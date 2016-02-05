
/**
 * Redux.combineReducers is a factory method which returns a reducer function (state, action) => state
 * keys are the props managed by the child reducers, values are the names of the relevant child reducers
 * @type {[type]}
 */
var edibleUrbanApp = Redux.combineReducers({
    map: plots,
    details: details,
    editing: editing
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
            map_data: []
        };
    }

    switch (action.type) {
        case 'ADDPLOTS':
            return { map_data : action.plots }
            break;
        case 'ADDPLOT':
            return { map_data : state.map_data.concat(action.plot) }
            break;
        default:
            return state;
    }

}

/**
 * reducer to manage the details part of the state tree
 * @param  {object} state:  the details part of the state tree
 * @param  {object} action: action to transform the state
 * @return {object} entirely new object to replace the details part of the state tree
 */
function details(state, action) {

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
 * reducer to manage the editing part of the state tree
 * @param  {object} state:  the editing part of the state tree
 * @param  {object} action: action to transform the state
 * @return {object} entirely new object to replace the editing part of the state tree
 */
function editing(state, action) {

    if(typeof state === 'undefined') {
        state = {
            title         : '',
            body          : '',
            imageId       : '',
            coordinates   : [],
            suggested_uses: [],
            land_type     : ''
        };
    }

    switch(action.type) {
        case 'SET_TITLE_BODY':
            return Object.assign({}, state, { title: action.title, body: action.body });
            break;
        case 'SET_IMAGE':
            return Object.assign({}, state, { imageId: action.imageId });
            break;
        case 'SET_COORDINATES':
            return Object.assign({}, state, { coordinates: action.coordinates });
            break;
        case 'SET_SUGGESTED_USES':
            return Object.assign({}, state, { suggested_uses: action.suggested_uses });
            break;
        case 'SET_LAND_TYPE':
            return Object.assign({}, state, { land_type: action.land_type });
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
    detailsWindow.render(store.getState().details);
    map.render(store.getState().map);   // make sure we don't re-render all the plots!
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








