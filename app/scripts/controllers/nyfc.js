'use strict';
//the main controller for the app
angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, AppState, NYFCFirebase) {
    $scope.title = 'Name Your Favorite Color';
		
		$scope.getNyfcColor = function (id) {
			$http.get(
				'https://nyfc.firebaseio.com/colors/' + $routeParams.id + '.json'
			).success(function(data, status, headers, config){
				$scope.detailobj = data;
				$scope.showDetail = true;
				$scope.safeApply();
			}).error(function(data, status, headers, config){
				console.log('status', status);
			});
		}
		
		//pagination...
		//create a query for the initial load - grab the last 5 objects  NYFCFirebase.endAt().limit(5);
		//load that query and save the key for the first object of the next page; increase the limit by one
		//retrieve the next page by using that key like this... NYFCFirebase.endAt(null, '-JA3MuTS_xHMe8TymKwR').limit(6);
		//you'll have to discard the repeated object
		$scope.LIMIT = 20, // items per page 
		$scope.colors = []; // the colors currently displayed to the user
		$scope.loadPage = function () {
			// the limit is increased by one with page loads for pages other than than the first page
			var limit = (AppState.getCurrentPage()) ? $scope.LIMIT + 1 : $scope.LIMIT;
			//if the current page is any other than 0, we have to retrieve with a record name
			if( AppState.getCurrentPage() ) {
				$scope.query = NYFCFirebase.endAt(null, AppState.getKey(AppState.getCurrentPage())).limit(limit);
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
		
		// set the name that is going to be used with the next call to firebase to retrieve documents
		$scope.setKey = function (data) {
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
					AppState.addKey(key);
			  }
				break;
			}
		}
		
		// create an array of colors from the object returned from firebase
		$scope.addColors = function (data) {
			var arr = [];
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
					data[key].id = key;
			    arr.unshift(data[key]);
			  }
			}
			//any other page than the first page, 0
			if (AppState.getCurrentPage()) {
				arr.splice(0,1);
			}
			$scope.colors = arr;
			$scope.safeApply();
		}
		
		$scope.nextPage = function () {
			AppState.setCurrentPage(AppState.getCurrentPage() + 1);
			$scope.loadPage();
		}
		
		$scope.previousPage = function () {
			if (AppState.getCurrentPage() - 1 < 0 ){
				return;
			}
			AppState.setCurrentPage(AppState.getCurrentPage() - 1);
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
		
		//start the app by checking to see if an individual color needs to be displayed and then loading the page
		if ($routeParams.id) {
			$scope.getNyfcColor($routeParams.id);
		}
		$scope.showDetail = ($routeParams.id);
		$scope.loadPage();
		
  });
