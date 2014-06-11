var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcPaginatedController', function($scope, NYFCFirebase){
	
	$scope.currentPage = null;
	$scope.LIMIT = 20, // items per page
	$scope.colors = []; // the colors currently displayed to the user
	$scope.pageKeys = [];//keys used to navigate back and forth through the pages
	$scope.queryStr = 'colors';
	$scope.path = '';
	
	$scope.localeStrings = {
		previous: "Previous",
		previousLoading: "loading...",
		next: "Next",
		nextLoading: "loading..."
	};
	
	$scope.textPrevious = $scope.localeStrings.previous;
	$scope.textNext = $scope.localeStrings.next;
	
	// set the name that is going to be used with the next call to firebase to retrieve documents
	$scope.setPageKey = function(data) {
		var arr = _.keys(data)
		$scope.pageKeys.push(arr[0]);
		$scope.pageKeys = _.uniq($scope.pageKeys);
	};
	
	// set the name that is going to be used with the next call to firebase to retrieve documents
	$scope.getPageKey = function(page) {
		return $scope.pageKeys[page - 1];
	};
	
	// the limit is increased by one with page loads for pages other than than the first page
	$scope.getLimit = function() {
		return ($scope.currentPage) ? $scope.LIMIT + 1 : $scope.LIMIT;
	}
	
	// pagination...
	// create a query for the initial load - grab the last 5 objects  NYFCFirebase.colors.endAt().limit(5);
	// load that query and save the key for the first object of the next page; increase the limit by one
	// retrieve the next page by using that key like this... NYFCFirebase.colors.endAt(null, '-JA3MuTS_xHMe8TymKwR').limit(6);
	// you'll have to discard the repeated object
	$scope.loadPage = function () {
		//protecting my tests
		if(!NYFCFirebase.query){
			return;
		}
		//remove any listeners before creating a new firebase object
		if ($scope.query) {
			$scope.query.off('value');
		}
		// the limit is increased by one with page loads for pages other than than the first page
		var limit = ($scope.currentPage) ? $scope.LIMIT + 1 : $scope.LIMIT;
		//if the current page is any other than 0, we have to retrieve with a record name
		if( $scope.currentPage ) {
			$scope.query = NYFCFirebase.query($scope.queryStr, $scope.path).endAt(null, $scope.getPageKey($scope.currentPage)).limit(limit);
		} else {
			$scope.query = NYFCFirebase.query($scope.queryStr, $scope.path).endAt().limit(limit);
		}
		$scope.query.on('value', function (snapshot) {
			var data = snapshot.val();
			$scope.setButtonText();
			$scope.addColors(data);
			$scope.setPageKey(data);
		});
	};
	
	$scope.setButtonText = function(){
		$scope.textPrevious = $scope.localeStrings.previous;
		$scope.textNext = $scope.localeStrings.next;
	}
	
	// create an array of colors from the object returned from firebase
	$scope.addColors = function (data) {
		var arr = [];
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				data[key].id = key;
				if (data[key].name) {
					if(data[key].name.length > 30) {
						data[key].shortName = $scope.truncate(data[key].name);
					} else {
						data[key].shortName = data[key].name;
					}
				}
				arr.unshift(data[key]);
			}
		}
		// any other page than the first page, 0
		if ($scope.currentPage) {
			arr.splice(0,1);
		}
		$scope.colors = arr;
		$scope.safeApply();
	};
	
	$scope.truncate = function (str) {
		return (str.substr(0,29) + '...');
	};
	
	//toggle to use only the colors created by the user
	$scope.myColors = function () {
		if ($scope.onlyMyColors) {
			$scope.queryStr = 'user';
			$scope.path = '/' + $scope.user.id + '/colors';
		} else {
			$scope.queryStr = 'colors';
			$scope.path = '';
		}
		$scope.currentPage = null;
		$scope.pageKeys = [];
		$scope.loadPage();
	};
	
	//advance
	$scope.nextPage = function () {
		$scope.textNext = $scope.localeStrings.nextLoading;
		$scope.currentPage = $scope.currentPage + 1;
		$scope.loadPage();
	};
	
	//regress
	$scope.previousPage = function () {
		if ($scope.currentPage - 1 < 0 ){
			return;
		}
		$scope.textPrevious = $scope.localeStrings.previousLoading;
		$scope.currentPage = $scope.currentPage - 1;
		$scope.loadPage();
	};
	
	// a monkey patch that checks to see if an $apply is in process before calling it
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
	
	//load the page
	$scope.loadPage();
	
});
