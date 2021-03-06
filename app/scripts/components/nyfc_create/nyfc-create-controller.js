// controller for creating a new NYFC color
var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcCreateController', function($scope, $http, NyfcFirebaseService, NyfcCanvasService, NyfcImageService){
	
	$scope.h, $scope.s, $scope.l, $scope.name = '',
	$scope.rgbString = 'hello world';
	
	// 
	$scope.user;
	
	$scope.stylesStr = 'background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px';
	
	$scope.localeStrings = {
		create: "CREATE!",
		creating: "CREATING..."
	};

	$scope.textSubmit = $scope.localeStrings.create;
	
	$scope.hslToStyles = function() {
		var tc = tinycolor({ h: $scope.h, s: $scope.s, l: $scope.l}), //https://github.com/bgrins/TinyColor
		bgColor = tc.toRgbString();
		
		$scope.stylesStr = NyfcCanvasService.getStyleString($scope.name, tc.toRgbString(), $scope.l);
		//styles will end up looking like this
		//background-color:rgb(255, 255, 255);color:#191919;font:bold 20px sans-serif;line-height:16.25px'	
	};
	
	$scope.showError = function(ngModelController, error) {
		return ngModelController.$error[error];
  };
	
	$scope.validate = function() {
		var valid = true;
		valid = ($scope.h >= 0 && $scope.h <= 360) && valid;
		valid = ($scope.s >= 0 && $scope.s <= 1) && valid;
		valid = ($scope.l >= 0 && $scope.l <= 1) && valid;
		valid = ($scope.name && $scope.name.length && $scope.name.length <= 140) && valid;
		return Boolean(valid);
	};
	
	$scope.submit = function() {
		if(!$scope.validate()){
			return;
		}
		// displays a message to encourage the user to create another
		$scope.encouragement = true;
		
		// create a color object to submit to firebase service
		var color = {
			name: $scope.name, // the name
			color: $scope.rgbString, // the color as a string rgb(val,val,val)
			created_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
			updated_at: Firebase.ServerValue.TIMESTAMP, //creates a timestamp on firebase
			adult_content: false, // naughty?
			h: $scope.h,
			s: $scope.s,
			l: $scope.l,
			user: $scope.user || null
		};
		
		//reset name
		$scope.name = null;
		
		// submit the color to the service
		// push to /colors
	  NyfcFirebaseService.colors('').push(color);
		// a combination of the name and the HSL made safe for Firebase
		var uniqueName = encodeURI(color.name),
			num = "" + color.h + color.s + color.l;
		uniqueName = uniqueName + String(num).replace(/\./g, '_');
		//set all the searchable names
		NyfcFirebaseService.names('/' + uniqueName).setWithPriority(color, color.name);
		NyfcFirebaseService.hues('/' + uniqueName).setWithPriority(color, color.h);
		NyfcFirebaseService.saturations('/' + uniqueName).setWithPriority(color, color.s);
		NyfcFirebaseService.lightnesses('/' + uniqueName).setWithPriority(color, color.l);
		
		NyfcImageService.createImage(color);
		
		//user
		// if there is a user check to see is that user exists and if not, add that user
		if ($scope.user && $scope.user.id) {
			$http.get(
				'https://nyfc.firebaseIO.com/users/' + $scope.user.id + '.json'
			).success(function(data, status, headers, config){
				// if data is null, then add the user
				if ( data === null) {
					// add colors to user
					$scope.user.colors = [color];
					// add user
					firebase.setWithPriority($scope.user, $scope.user.id);
				} else {
					// assume user and colors array are present and add
					NyfcFirebaseService.user('/' + $scope.user.id + '/colors').push(color);
				}
			}).error(function(data, status, headers, config){
				console.log('status', status);
			});
		}
	};
	
	//watch for changes in the hue, saturation, or lightness
	$scope.$watch('name', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
	//watch for changes in the hue, saturation, or lightness
	$scope.$watch('h', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
	$scope.$watch('s', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
	$scope.$watch('l', function(newValue, oldValue) {
		$scope.hslToStyles();
	});
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
