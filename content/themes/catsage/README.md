This is build of v2 of mikey's edible urban website.


some notes. hopefully will fill this out later.

uses redux.js to manage ui state


/**
 * This is a redux pattern:
 * all state is kept in a single js object, think of it as a tree describing the app
 * redux uses reducer functions to manage state.
 * a reducer function is a pure function who's signiture is (state,action) => state
 * it describes how an action transforms the state into the next state
 * the reducers can be found in the file state.js
 *
 * important: reducers do not mutate the state object, but return a new object
 * constructed from the old object with the relavant states different.
 */



here are some internals about the data structures

 state object has the form:
 {
     map :{
         map_data     : [array of plot objects],
         active_layer : undefined
     },
     info_window : {
         view: '',
         displayed: null
     }
 }

 plot object looks like this:
 {
      "id":630,
      "title":{
          "rendered":"City College Car Park"
      },
      "content":{
          "rendered":"<p>Car park</p>\n"},
          "image":"http:edibleurban/content/uploads/2015/09/Screen-Shot-2015-09-09-at-14.45.39-150x150.png",
          "area_type":"Tarmac",
          "map_data":{
              "type":"Feature",
              "geometry":{
                  "type":"Polygon",
                  "coordinates":[
                      [
                          [-0.23715555667877,52.577103596881],
                          [-0.23657619953156,52.576712404658],
                          [-0.23629724979401,52.576806943098],
                          [-0.23661911487579,52.57719161465],
                          [-0.23693025112152,52.577116636561],
                          [-0.23702144622803,52.577181834906],
                          [-0.23715555667877,52.577103596881]
                      ]
                                 ]
              },
              "properties":{
                  "name":"City College Car Park",
                  "body":"Car park",
                  "areatype":"tarmac"
              }
      }
 }
 The redux-reducers don't manage the internals of the plot objects just the UI state
