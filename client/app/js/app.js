'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'MasjidTimesCtrl'});
    $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutPageCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
