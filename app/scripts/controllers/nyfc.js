'use strict';
//the main controller for the app
angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, NYFCFirebase) {
    $scope.title = 'Name Your Favorite Color';
		$scope.disabled = false;

		//create a query for the initial load - grab the last 5 objects  NYFCFirebase.endAt().limit(5);
		//load that query and save the key for the first object of the next page; increase the limit by one
		//retrieve the next page by using that key like this... NYFCFirebase.endAt(null, '-JA3MuTS_xHMe8TymKwR').limit(6);
		//you'll have to discard the repeated object
		$scope.LIMIT = 5, // items per page 
		$scope.initalPageLoad = true, // the first load is a different limit than the next because of limitations with firebase
		$scope.currentPage = 0, // start with page 0
		$scope.numPages = -1, // the total number of pages - this value increases as we load pages
		$scope.pages = [], // an array to hold arrays of pages
		$scope.colors, // the colors currently displayed to the user
		$scope.resetPage0 = false; // when an item is added. if the user is on page 0 or navigates the page 0, a load can be triggered.
		
		$scope.setDefaultsForPagination = function () {
			$scope.initalPageLoad = true, // the first load is a different limit than the next because of limitations with firebase
			$scope.currentPage = 0, // start with page 0
			$scope.numPages = -1, // the total number of pages - this value increases as we load pages
			$scope.pages = [],
			$scope.lastRecordName = null; // an array to hold arrays of pages
		}
			
		$scope.loadPage = function () {
			// the limit is increased by one with subsequent page loads to accomodat the fact the endAt includes the child who's name is passed
			var limit = ($scope.initalPageLoad) ? $scope.LIMIT : $scope.LIMIT + 1;
			if( $scope.initalPageLoad ) {
				$scope.query = NYFCFirebase.endAt().limit(limit);
			} else {
				$scope.query = NYFCFirebase.endAt(null, $scope.lastRecordName).limit(limit);
			}
			$scope.query.on('value', function (snapshot) {
				var data = snapshot.val();
				$scope.setKey(data);
				$scope.createPage(data);
				$scope.initalPageLoad = false;
			});
		}
		// set the name that is going to be used with the next call to firebase to retrieve documents
		$scope.setKey = function (data) {
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			    $scope.lastRecordName = key;
			  }
				break;
			}
		}
		// create an array of colors from the object returned from firebase
		$scope.createPage = function (data) {
			var key,
				i = 0,
				arr = [];
			for (key in data) {
			  if (data.hasOwnProperty(key)) {
			    arr.unshift(data[key]);
			  }
				i++;
			}
			// if these cases are met, there are no more documents to retrieve
			if (i === 1 && key === $scope.lastRecordName) {
				$scope.currentPage = $scope.pages.length - 1;
				return;
			}
			if (!$scope.initalPageLoad) {
				arr.splice(0, 1);
			}
			$scope.pages.push(arr);
			$scope.numPages++;
			$scope.setPage();
			$scope.safeApply();
		}
		
		$scope.getPage = function ( page ) {
			if ( page > $scope.pages.length-1) {
				$scope.loadPage();
				return null;
			} else {
				return $scope.pages[page];
			}
		}
		
		$scope.nextPage = function () {
			$scope.currentPage++;
			$scope.setPage();
		}
		
		$scope.previousPage = function () {
			if( $scope.currentPage != 0 ) {
				$scope.currentPage--;
			} else {
				return;
			}
			$scope.setPage();
		}
		
		$scope.setPage = function () {
			var colors = $scope.getPage($scope.currentPage);
			if ( colors ) {
				$scope.colors = colors;
			}
		}
		
		$scope.getPage($scope.currentPage);
		
		
    $scope.submitColor = function (event) {
			// maybe a randow value to identify?
			var ranValue = Math.random();
      NYFCFirebase.push({ 
				name: $scope.colorName,
				color: $scope.colorValue,
				created_at: Firebase.ServerValue.TIMESTAMP,
				updated_at: Firebase.ServerValue.TIMESTAMP,
				ranValue: ranValue
				});
				/*NYFCFirebase.on('child_added', function (snapshot) {
					var data = snapshot.val();
					if( ranValue === data.ranValue ) {
						$scope.pages[0].pop();
						$scope.pages[0].unshift(data);
					}
					console.log('hello world data', data);
					NYFCFirebase.off('child_added');
				});*/
    };


		
    //a monkey patch that checks to see if an $apply is in process before calling it
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  });
