var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcUser', function($scope){
	
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
	
	// handles the FB share function
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
	
});
