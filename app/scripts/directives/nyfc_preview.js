// this is preview that is drawn as the user is creating their color
angular.module('nyfcApp')
	.directive('nyfcPreview', function(){
		return {
			restrict: 'EA',
			templateUrl: 'views/partials/preview.html',
			replace: true,
			scope: {
          options: '=',
          model: '=ngModel'
      }
		};
		
	});
