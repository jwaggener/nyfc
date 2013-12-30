'use strict';

angular.module('nyfcApp')
	.directive('nyfcPreview', function(){
		return {
			restrict: 'EA',
			templateUrl: 'views/preview.html',
			replace: true,
			scope: {
          options: '=',
          model: '=ngModel'
      }
		}
		
	});
