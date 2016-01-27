'use strict';

angular
.module('app', [
	'ngResource',
	'ngRoute',
	'ngCookies'
	])
.config(function ($routeProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'views/states.html',
		controller: 'MainController',
		controllerAs: 'vm'
	})
	.when('/messages', {
		templateUrl: 'views/messages.html',
		controller: 'MainController',
		controllerAs: 'vm'
	})
	.otherwise({
		redirectTo: '/'
	});
});