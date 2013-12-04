'use strict';

// Set up the service factory to create our Items interface to the
// server-side database
angular.module('nyfcApp')
  .factory('NYFCCouchDBService', function() {
    var service = {};
    service.query = function() {
      // In real apps, we'd pull this data from the server...
      return [
        {name: 'Paint', color: 'yellow'},
        {name: 'Polka dots', color: 'pink'},
        {name: 'Pebbles', color: 'blue'}
      ];
    };
  	//service.get string
  	//service.post string obj
    return service;
  });
