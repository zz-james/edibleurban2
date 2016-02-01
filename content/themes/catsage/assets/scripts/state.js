// we're using the redux pattern here so
// we have this single global state tree
// if the initial render is slow we could populate map data?
var state = {
    map_data : [],
    info_window : {
        view: 'empty',
        displayed: null
    }
}