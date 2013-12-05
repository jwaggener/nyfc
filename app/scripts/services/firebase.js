'use strict';
// firebase is a scalable real time backend
// http://www.firebase.com
angular.module('nyfcApp')
  .factory('NYFCFirebase', function() {
    //hard coded to firebase nyfc data source
    return new Firebase('https://nyfc.firebaseIO.com/colors');
  });
  