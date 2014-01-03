// the main controller for the app
angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, AppState, NyfcStyles, NYFCFirebase) {
		
		// after the user craetes one color, I'm encouranging them to make another!
		$scope.encouragement = false;
		
		// if the user is not logged in, and they use one of the links on the page to login
		// this event listener fires
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			if (response.status === 'connected') {
				FB.api('/me', function(response) {
					$scope.user = response;
					$scope.safeApply();
					//window.FBme = response;
					// save these attributes from facebook
					// id
					// name
					// first_name
					// last_name
					// link
					// locale
					// username
					// gender
				});
			}
		});
		
		// making sure this fires. The event previous does not always fire on page load. Not sure why.
		// the idea here is that if they are a user, and the load the page, and they are logged in
		// I want to make sure they are greeted!
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				FB.api('/me', function(response) {
					$scope.user = response;
					$scope.safeApply();
				});
			}
		});
		
		// handles the share function
		$scope.handleShare = function (id, name) {
			var url = window.location.origin + window.location.pathname + '#' + id;
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					FB.ui(
						{
							method: 'feed',
							name: 'Name Your Favorite Color',
							link: url,
							picture: 'http://nameyourfavoritecolor.com/images/398d2afa.nyfc_logo_large.png',
							caption: name,
							description: 'Follow the link to check it out and name your favorite color!'
						},
						function(response) {
							if (response && response.post_id) {
								alert('Post was published.');
							} else {
								alert('Post was not published.');
							}
						}
					);
				} else if (response.status === 'not_authorized') {
					FB.login();
				} else {
					FB.login();
				}
			});

		};
		
		// login to facebook
		$scope.fbLogin = function () {
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					FB.api('/me', function(response) {
						$scope.user = response;
						$scope.safeApply();
					});
				} else if (response.status === 'not_authorized') {
					FB.login();
				} else {
					FB.login();
				}
			});
		};
		
		// logout of facebook
		$scope.fbLogout = function () {
			$scope.user = null;
			FB.logout();
		};
		
		// retrieves an individual nyfc color object
		$scope.getNyfcColor = function () {
			$http.get(
				'https://nyfc.firebaseio.com/colors/' + $routeParams.id + '.json'
			).success(function(data, status, headers, config){
				$scope.detailobj = data;
				$scope.detailobj.id = $routeParams.id;
				$scope.showDetail = true;
				$scope.safeApply();
			}).error(function(data, status, headers, config){
				console.log('status', status);
			});
		};

		// pagination...
		// create a query for the initial load - grab the last 5 objects  NYFCFirebase.endAt().limit(5);
		// load that query and save the key for the first object of the next page; increase the limit by one
		// retrieve the next page by using that key like this... NYFCFirebase.endAt(null, '-JA3MuTS_xHMe8TymKwR').limit(6);
		// you'll have to discard the repeated object
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
		};

		// set the name that is going to be used with the next call to firebase to retrieve documents
		$scope.setKey = function (data) {
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					AppState.addKey(key);
				}
				break;
			}
		};
		
		$scope.truncate = function (str) {
			return (str.substr(0,29) + '...');
		};
		
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
			if (AppState.getCurrentPage()) {
				arr.splice(0,1);
			}
			$scope.colors = arr;
			$scope.safeApply();
		};
		
		$scope.nextPage = function () {
			AppState.setCurrentPage(AppState.getCurrentPage() + 1);
			$scope.loadPage();
		};
		
		$scope.previousPage = function () {
			if (AppState.getCurrentPage() - 1 < 0 ){
				return;
			}
			AppState.setCurrentPage(AppState.getCurrentPage() - 1);
			$scope.loadPage();
		};
		
		// the nyfc object being created by the submit form
		$scope.newNyfc = AppState.getNewNyfc();
		
		// as the input for the name changes, this is called
		$scope.changeName = function () {
			//calculate the styles
			var stylesObj = NyfcStyles.stylesFromArr(AppState.getNewNyfc().name, AppState.getNewNyfc().selectedHsl.l);
			AppState.setStyles(stylesObj);
		};
		
		// submit the color to the database
    $scope.submitColor = function (event) {
			$scope.encouragement = true;
			var newNyfc = AppState.getNewNyfc();
      NYFCFirebase.push({ 
				name: newNyfc.name, // the name
				color: newNyfc.selectedRgbString, // the color as a string rgb(val,val,val)
				created_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
				updated_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
				adult_content: false, // naughty?
				h: newNyfc.selectedHsl.h,
				s: newNyfc.selectedHsl.s,
				l: newNyfc.selectedHsl.l,
				user: $scope.user || null
				});
				newNyfc.name = '';
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
		
		// start the app by checking to see if an individual color needs to be displayed and then loading the page
		if ($routeParams.id) {
			$scope.getNyfcColor($routeParams.id);
		}
		
		// if there is an id passed as a param, show the detail section
		$scope.showDetail = ($routeParams.id);
		
		// load the page
		$scope.loadPage();
		
  });
