/*
* nyfc - Name Your Favorite Color
* This database contains our nyfc objects
*	id
* created_at
* updated_at
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

// if the database exists use it. If not create it.
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

/*allNYFCs = nyfc.view('nyfc/all', function (err, res) {
	console.log('err', err);
	console.log('res', res);
	return res;
});*/

//creating the views on the data
nyfc.save('_design/nyfc', {
	all: {
		map: function (doc) {
			if (doc.name && doc.color) emit(doc.name, doc);
		}
	}
});
