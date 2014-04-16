// An example configuration file.
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  //chromeOnly: true,
  //chromeDriver: './node_modules/protractor/selenium/chromedriver',

	//use the selenium server
	seleniumAddress: 'http://0.0.0.0:4444/wd/hub',
	
	baseUrl: 'http://localhost:9000/',
	
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*_spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
