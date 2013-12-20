'use strict';

angular.module('nyfcApp')
	.directive('nyfcPreview', function(){
		return {
			restrict: 'EA',
			template: '<div style="position:relative;background-color:{{model.selectedRgbString}};color:{{model.color}};font:{{model.font}};line-height:{{model.lineheight}}px;vertical-align:text-bottom;"><span style="position: absolute; bottom: 0; left: 0;">{{model.name}}</span></div>',
			replace: true,
			scope: {
          options: '=',
          model: '=ngModel'
      },
			link: function ($scope, element, attrs) {
			}
		}
		
	});
