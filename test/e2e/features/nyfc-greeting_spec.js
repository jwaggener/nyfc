'use strict';

describe('nyfc has a title and a welcome message', function() {
	var ptor;
		
  beforeEach(function() {
		browser.get('index.html');
		ptor = protractor.getInstance();
		ptor.ignoreSynchronization = true;
  });

	it("there to be one h1 element", function () {
		var ele = by.tagName('h1');
		expect(ptor.isElementPresent(ele)).toBe(true);
	});
	
	it("there to be one welcome class", function () {
		var ele = by.className('welcome');
		expect(ptor.isElementPresent(ele)).toBe(true);
	});
	
});
