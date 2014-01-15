// firebase is a scalable real time backend
// http://www.firebase.com
angular.module('nyfcApp')
  .factory('NYFCFirebase', function() {
		// a list of the colors
		var BASE_URL = 'https://nyfc.firebaseIO.com',
		
		COLORS_LOCATION = BASE_URL + '/colors',
		// a list of the users with name set as the priority
		USERS_LOCATION = BASE_URL + '/users',
		// a list of the colors with names set as the priority
		NAMES_LOCATION = BASE_URL + '/names',
		// a list of the colors with hue set as the priority
		HUES_LOCATION = BASE_URL + '/hues',
		// a list of the colors with saturation set as the priority
		SATURATIONS_LOCATION = BASE_URL + '/saturations',
		// a list of the colors with lightness set as the priority
		LIGHTNESSES_LOCATION = BASE_URL + '/lightnesses';
		
		function getUser (path) {
			return new Firebase(USERS_LOCATION + path);
		};
		
		function getName(path) {
			return new Firebase(NAMES_LOCATION + path);
		}
		
		function getHue(path) {
			return new Firebase(HUES_LOCATION + path);
		}
		
		function getSaturation(path) {
			return new Firebase(SATURATIONS_LOCATION + path);
		}
		
		function getLightness(path) {
			return new Firebase(LIGHTNESSES_LOCATION + path);
		}
		
    //returns firebase data sources for this project
		return {
			colors: new Firebase(COLORS_LOCATION),
			user: getUser,
			names: getName,
			hues: getHue,
			saturations: getSaturation,
			lightnesses: getLightness
		}
  });
  