var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	insert = require('gulp-insert'),
	webpack = require('gulp-webpack')
;

var packageName = 'react-tiles';
var pack = require( './package.json' );

var getWPConfig = function( filename ){
  var config = require('./webpack.config.js');
  config.output.filename = filename + '.js';
	return config;
};

var cr = ('/*\n%%name%% v%%version%%\n%%homepage%%\n%%license%%: https://github.com/arqex/' + packageName + '/raw/master/LICENSE\n*/\n')
	.replace( '%%name%%', pack.name)
	.replace( '%%version%%', pack.version)
	.replace( '%%license%%', pack.license)
	.replace( '%%homepage%%', pack.homepage)
;

function wp( config, minify ){
	var stream =  gulp.src( config.entry[0] )
		.pipe( webpack( config ) )
		.pipe( insert.transform( function( contents ){
			return contents.replace('#ver#', pack.version);
		}))
	;

	if( minify ){
		console.log('minifying!');
		stream = stream.pipe( uglify() );
	}

	return stream.pipe( insert.prepend( cr ) )
		.pipe( gulp.dest('dist/') )
	;
}

gulp.task("build", function( callback ) {
	var config = getWPConfig( 'react-tiles' );
	config.devtool = '#eval';
	return wp( config );
});

gulp.task("build minified", ['build'], function(){
	var config = getWPConfig( 'react-tiles.min' );
	delete config.devtool;
	return wp( config, true );
});

gulp.task( 'default', ['build minified'] );
