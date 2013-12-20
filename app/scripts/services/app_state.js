'use strict';
//holds some state on the App. If routes reload controller/tempaltes, does not affect this state
angular.module('nyfcApp')
  .factory('AppState', function() {
		
		// a new model, not yet saved
		var newNyfc = {
			name: '',
			color: ''
		};
		
		function _setNewNyfc (obj) {
			newNyfc = obj;
		}
		
		function _setPropNewNyfc (name, val) {
			newNyfc[name] = val;
		}
		
		function _getNewNyfc (obj) {
			return newNyfc;
		}
		
		// for now, for simplicity, setting the styles on the nyfc object for use in display in the app
		var _setStyles = function (obj) {
			for (var key in obj) {
			  if (obj.hasOwnProperty(key)) {
			    newNyfc[key] = obj[key]
			  }
			}
		}
		
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
		}
		
  });