// this is preview that is drawn as the user is creating their color
angular.module('nyfcApp')
	.directive('nyfcPreview', function(){
		return {
			restrict: 'EA',
			templateUrl: 'components/nyfc_create/nyfc-preview.html',
			scope: {
					nyfc: '=nyfc'
      }
		};
		
	});
