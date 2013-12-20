'use strict';

// firebase is a scale-able real time backend
// http://www.firebase.com
angular.module('nyfcApp')
  .factory('NyfcStyles', function() {
	
		//returns an object with css styles
		// takes an array of strings and a lightness value
		var _stylesFromArr = function (arr, lightness) {
			
			// an object that contains some style properties
			var size,
			
			// returns the longest string
			max = (_.max(arr, function(str){return str.length;})).length,
			
			// an object that will be returned
			stylesObj = {
				font: 'bold 18px sans-serif',
				color: ( lightness > .85) ? '#191919' : '#ffffff',
				textAlign: 'left',
				textBaseline: 'bottom',
				lineheight: 16.25
			},
			
			// the sizes to choose from
			sizes = {
				extrasmall: {
					fontSize: 12.25,
					lineheight: 12.25
				},
				small: {
					fontSize: 16.25,
					lineheight: 16.25
				},
				medium: {
					fontSize: 20,
					lineheight: 20
				},
				large: {
					fontSize: 30,
					lineheight: 30
				},
				xlarge: {
					fontSize: 36,
					lineheight: 36
				}
			};
			
			//this is total heuristics. Will probbaly revisit this many times
			if ( max >= 16 ) {
				size = sizes.extrasmall;
			} else if( max >= 10 ) {
				size = sizes.small;
			} else if ( max >= 7 && max < 10 || arr.length > 3) {
				size = sizes.medium;
			} else if ( max >= 4 && max < 7  ) {
				size = sizes.large;
			} else {
				size = sizes.xlarge;
			}
			
			stylesObj.font = 'bold ' + size.fontSize  + 'px sans-serif';
			stylesObj.lineheight = size.lineheight;
			
			return stylesObj;
		}
		
		return {
			stylesFromArr: _stylesFromArr
		}
		
  });