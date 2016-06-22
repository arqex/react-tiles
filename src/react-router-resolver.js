/**
 * The resolvers are the responsible of translating the routes to components
 * letting react-tiles know what to display when a route is received.
 *
 * A resolver is just an object with three methods:
 * * init: Called when the react tiles component is mounted, it receives the same props
 * 			from it as an argument. It is used to initialize any variables needed by our
 * 			resolver.
 *
 *  * navigate: Called by react-tile's links to update the current's browser URL and
 *  		navigate to the next screen.
 *
 *  * resolve: Translates the routes to react components. This method is asynchronous
 *  		because react-router matching method is asynchronous. Since react-router is the
 *  		most used solution, it forces this method to be this way.
 */

var Router = require('react-router');

var history,
  routes
;

module.exports = {
  init: function( props ){

    // Store the history and routes objects to be used in the resolve method.
    // they are private variables.
    history = props.history;
    routes = props.routes;
  },
  navigate: function( path ){

    // Uses the history object to navigate.
    // Any other library may handle the navigation just updating the location
    // like:
    // location.href = path;
    history.push( path );
  },
  resolve: function( path, callback ){
    Router.match({ routes: routes, location: path}, function( err, redirect, state ){

      // We return the second level route's component, since the Tiles component
      // is used in the first lever route. Your app may update this function to
      // make route matching working ok.
      callback( state.routes[1].component );
    });
  }
}
