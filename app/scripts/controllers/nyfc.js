'use strict';
//the main controller for the app
angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, NYFCFirebase) {
    $scope.title = 'Name Your Favorite Color';
		$scope.disabled = false;
		$scope.selectedRgbString = 'ccc';
		//create a query for the initial load - grab the last 5 objects  NYFCFirebase.endAt().limit(5);
		//load that query and save the key for the first object of the next page; increase the limit by one
		//retrieve the next page by using that key like this... NYFCFirebase.endAt(null, '-JA3MuTS_xHMe8TymKwR').limit(6);
		//you'll have to discard the repeated object
		$scope.pageKeys = [null],
		$scope.LIMIT = 20, // items per page 
		$scope.currentPage = 0,
		$scope.colors = []; // the colors currently displayed to the user
		$scope.loadPage = function () {
			// the limit is increased by one with page loads for pages other than than the first page
			var limit = ($scope.currentPage) ? $scope.LIMIT + 1 : $scope.LIMIT;
			//if the current page is any other than 0, we have to retrieve with a record name
			if( $scope.currentPage ) {
				$scope.query = NYFCFirebase.endAt(null, $scope.pageKeys[$scope.currentPage]).limit(limit);
			} else {
				$scope.query = NYFCFirebase.endAt().limit(limit);
			}
			$scope.query.on('value', function (snapshot) {
				var data = snapshot.val();
				$scope.addColors(data);
				$scope.setKey(data);
				$scope.initalPageLoad = false;
			});
		}
		
		//start the app by loading the page
		$scope.loadPage();
		
		// set the name that is going to be used with the next call to firebase to retrieve documents
		$scope.setKey = function (data) {
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
					$scope.pageKeys.push(key);
			  }
				break;
			}
			$scope.pageKeys = _.uniq($scope.pageKeys);
		}
		
		// create an array of colors from the object returned from firebase
		$scope.addColors = function (data) {
			var arr = [];
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			    arr.unshift(data[key]);
			  }
			}
			//any other page than the first page, 0
			if ($scope.currentPage) {
				arr.splice(0,1);
			}
			$scope.colors = arr;
			$scope.safeApply();
		}
		
		$scope.nextPage = function () {
			$scope.currentPage++;
			$scope.loadPage();
		}
		
		$scope.previousPage = function () {
			if ($scope.currentPage - 1 < 0 ){
				return;
			}
			$scope.currentPage--;
			$scope.loadPage();
		}
		
    $scope.submitColor = function (event) {
      NYFCFirebase.push({ 
				name: $scope.colorName, // the name
				color: $scope.selectedRgbString, // the color as a string rgb(val,val,val)
				created_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
				updated_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
				adult_content: false, // naughty?
				h: Math.round($scope.selectedHsl.h * 1000)/1000,
				s: Math.round($scope.selectedHsl.s * 1000)/1000,
				l: Math.round($scope.selectedHsl.l * 1000)/1000
				});
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
