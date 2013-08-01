/*
* nyfc - Name Your Favorite Color
* This database contains our nyfc objects
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
