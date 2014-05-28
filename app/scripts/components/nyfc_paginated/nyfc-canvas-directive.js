var nyfc = angular.module('nyfcApp');

nyfc.controller('nyfcCanvasController', function ($scope, $element, $attrs, nyfcCanvasService) {	

	$scope.$watch('colorObj', function(newValue, oldValue){

		if(!newValue){
			return;
		}
		
		var canvas = nyfcCanvasService.getNyfcCanvas(newValue.name, newValue.color, newValue.l),
			// create an image and add it to the DOM
			img = new Image();
		
		$(img).attr('title', 'Right-click to download.');
		img.src = canvas.toDataURL("image/png");
		// can have a shim that maintains a consistent height and prevents the DOM from jumping
		//$($element[0]).find('.shim').remove();
		$($element[0]).prepend(img);
		
	});
	
});

nyfc.directive('nyfcCanvas', function(){
	
	return {
		restrict: 'EA',
		replace: false,
		template: '',
		scope: {
			colorObj: '='
		},
		controller: 'nyfcCanvasController'
	};
	
});
