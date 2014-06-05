describe('service draws an image of the color with its name', function(){
	
	var $scope, _nyfcCanvasService;
	
	beforeEach(module('nyfcApp'));
	
	beforeEach(inject(function(nyfcCanvasService){
		_nyfcCanvasService = nyfcCanvasService;
	}));
	
	it('should have a property color with a value of #191919 when the lightness value passed in is over 0.85 ', function(){
		var str = 'hello world',
			lightness = 0.86;
		_nyfcCanvasService.setContextStyles(str, lightness);
		expect(_nyfcCanvasService.context.fillStyle).toBe('#191919');
	});
	
	describe('selecting the correct size', function(){
			
		it('should select xlarge if longest string size is 1-3 in length', function(){
			var obj = _nyfcCanvasService.selectSize('xl ooo oo');
			expect(obj).toBe(FormattingOptions.xlarge);
		});
		
		it('should select large if longest string size is 4-6 in length', function(){
			var obj = _nyfcCanvasService.selectSize('larg large largel la');
			expect(obj).toBe(FormattingOptions.large);
		});

		it('should select medium if longest string size is 7-9 in length', function(){
			var obj = _nyfcCanvasService.selectSize('mediumm mediumme mediummed me');
			expect(obj).toBe(FormattingOptions.medium);
		});

		it('should select small if longest string size is 10-15 in length', function(){
			var obj = _nyfcCanvasService.selectSize('smallsmall smallsmallsmall sm');
			expect(obj).toBe(FormattingOptions.small);
		});

		it('should select small if longest string size is 10-15 in length', function(){
			var obj = _nyfcCanvasService.selectSize('smallsmall smallsmallsmall sm');
			expect(obj).toBe(FormattingOptions.small);
		});

		it('should select xsmall if longest string size is 16 and up in length', function(){
			var obj = _nyfcCanvasService.selectSize('smallsmall smallsmallsmalls sm');
			expect(obj).toBe(FormattingOptions.xsmall);
		});
		
	});

	it('should get the number of nodes needed to draw text in the box', function(){
		var nodes = _nyfcCanvasService.getNodes('smallsmall smallsmallsmall sm', _nyfcCanvasService.context);
		expect(_.isArray(nodes)).toBe(true);
	});
	
});
