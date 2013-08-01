/*
* nyfc - Name Your Favorite Color
* This database contains our nyfc objects
*	id
*	name - string. name of color given by user
*	color: {
*	hex: ffffff - string
*	rgb: {r: 255, g: 255, b:255} - numbers
*	hsl: {h:1,s:1,l:1} hue saturation, lightness, values from 0 - 1
*	}hex value.
*	author - unique user who created this name/color pairing
*	adult content - Boolean
*	font: {
*	font-family
*	font-size
*	font-style
*	font-weight
*	font-variant
*	}
*/
var cradle = require('cradle');

c = new(cradle.Connection)('http://127.0.0.1', 5984, {
	cache: true,
	raw: false
});

var nyfc = exports.nyfc = c.database('nyfc');

nyfc.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('the database exists.');
	} else {
		console.log('database does not exists. creating the database');
		nyfc.create();
		/* populate design documents */
	}
});
