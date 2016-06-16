var Router = require('react-router');

var history,
  routes
;

module.exports = {
  init: function( props ){
    history = props.history;
    routes = props.routes;
  },
  navigate: function( path ){
    history.push( path );
  },
  resolve: function( path, callback ){
    Router.match({ routes: routes, location: path}, function( err, redirect, state ){
      callback( state.routes[1].component );
    });
  }
}
