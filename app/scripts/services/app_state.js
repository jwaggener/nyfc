//holds some state on the App. If routes reload controller/tempaltes, does not affect this state
angular.module('nyfcApp')
  .factory('AppState', function() {
		
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
		
		function _setNewNyfc (obj) {
			newNyfc = obj;
		}
		
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
		
		return {
			// new user
			setUser: _setUser,
			getUser: _getUser,
			// new nyfc
			setNewNyfc: _setNewNyfc,
			getNewNyfc: _getNewNyfc,
			setPropNewNyfc: _setPropNewNyfc,
			//styles
			setStyles:  _setStyles,
			//pagination
			setCurrentPage: _setCurrentPage,
			getCurrentPage: _getCurrentPage,
			addKey: _addKey,
			getKey: _getKey
		};
		
  });