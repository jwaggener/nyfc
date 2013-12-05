'use strict';
//the main controller for the app
angular.module('nyfcApp')
  .controller('MainCtrl', function ($scope, NYFCFirebase) {
    $scope.title = 'Name Your Favorite Color';
    NYFCFirebase.on('value', function (snapshot) {
      var data = snapshot.val();
      $scope.colors = data;
      $scope.safeApply();
    });
    $scope.submitColor = function (event) {
      NYFCFirebase.push({ name: $scope.colorName, color: $scope.colorValue});
    }
    //a monkey patch that checks to see if an $apply is in process before calling it
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  });
