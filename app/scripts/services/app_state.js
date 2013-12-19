'use strict';
// firebase is a scalable real time backend
// http://www.firebase.com
angular.module('nyfcApp')
  .factory('AppState', function() {
	
		var _currentPage = 0;
		var _pageKeys = [null];
		
		function setCurrentPage (num) {
			_currentPage = num;
		}
		
		function getCurrentPage () {
			return _currentPage;
		}
		
		function addKey ( str ) {
			_pageKeys.push(str);
			_pageKeys = _.uniq(_pageKeys);
		}
		
		function getKey (num) {
			return _pageKeys[num];
		}
		
		return {
			setCurrentPage: setCurrentPage,
			getCurrentPage: getCurrentPage,
			addKey: addKey,
			getKey: getKey
		}
		
  });