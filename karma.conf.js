module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['jasmine'],
    files: [
			'app/bower_components/underscore/underscore.js',
			'app/bower_components/jquery/jquery.js',
			'app/vendor/spectrum.js',
			'app/bower_components/angular/angular.js',
			'app/bower_components/angular-mocks/angular-mocks.js',
			'app/bower_components/angular-cookies/angular-cookies.js',
			'app/bower_components/angular-resource/angular-resource.js',
			'app/bower_components/angular-sanitize/angular-sanitize.js',
			'app/bower_components/angular-route/angular-route.js',
			'app/scripts/**/*.js'
    ],
    browsers: ['PhantomJS'],
		
    //reporters: ['progress', 'coverage'],
		//preprocessors: { 'app/scripts/**/*.js': ['coverage']},
    //preprocessors: { 'app/scripts/test/*.js': ['coverage'] },

    singleRun: true
  });
};
