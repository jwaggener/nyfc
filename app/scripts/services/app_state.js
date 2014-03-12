//holds some state on the App. If routes reload controller/tempaltes, does not affect this state
angular.module('nyfcApp')
  .factory('AppState', function() {
		
		var query = 'colors', path = '';
		
		// a new model, not yet saved
		var newNyfc = {
			name: '',
			selectedRgbString: 'rgb(0,0,255)',
			selectedHsl: { 
				h: 240, 
				s: 1, 
				l: 0.5
			}
		};
		
		function _setPropNewNyfc (name, val) {
			newNyfc[name] = val;
		}
		
		function _getNewNyfc () {
			return newNyfc;
		}
		
		// for now, for simplicity, setting the styles on the nyfc object for use in display in the app
		var _setStyles = function (obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					newNyfc[key] = obj[key];
				}
			}
		};
		
		// user info from Facebook
		var _user = {};
		
		// pass in the facebook user object
		// and an array of attributes you would like to save
		// ['id', 'first_name', 'last_name']
		var _setUser = function (obj, attrs) {
			var i = 0;
			for(i; i<attrs.length; i++) {
				_user[attrs[i]] = obj[attrs[i]];
			}
		};
		
		var _getUser = function () {
			return _user;
		};
		
		// pagination
		var _currentPage = 0,
			_pageKeys = [null];
		
		// pagination
		function _setCurrentPage (num) {
			_currentPage = num;
		}
		
		function _getCurrentPage () {
			return _currentPage;
		}
		
		function _addKey ( str ) {
			_pageKeys.push(str);
			_pageKeys = _.uniq(_pageKeys);
		}
		
		function _getKey (num) {
			return _pageKeys[num];
		}
		
		function _resetPageKeys () {
			_pageKeys = [null];
		}
		
		var _currentFilter;
		
		var filters = {
			// all colors, prioritized by date
			'COLORS': 0,
			// colors, prioritized by the hue of hsl
			'HUE': 1,
			// colors, prioritized by the saturation of hsl
			'SATURATION': 2,
			// colors, prioritized by the saturation of hsl
			'LIGHTNESS': 3,
			// colors which belong to the currently logged in user
			'USER': 4
		}
		
		_currentFilter = 0;
		
		function _getCurrentFilter () {
			return _currentFilter;
		};
		
		function _setCurrentFilter (val) {
			_currentFilter = val;
		};
		
		return {
			//the type of query
			query: query,
			//a path in that query
			path: path,
			// new user
			setUser: _setUser,
			getUser: _getUser,
			// new nyfc
			getNewNyfc: _getNewNyfc,
			setPropNewNyfc: _setPropNewNyfc,
			//styles
			setStyles:  _setStyles,
			//pagination
			setCurrentPage: _setCurrentPage,
			getCurrentPage: _getCurrentPage,
			resetPageKeys: _resetPageKeys,
			addKey: _addKey,
			getKey: _getKey,
			//filters for the colors
			filters: filters,
			getCurrentFilter: _getCurrentFilter,
			setCurrentFilter: _setCurrentFilter
		};
		
  });