'use strict';

/**
 * @ngdoc overview
 * @name angularSimplesuspectApp
 * @description
 * # angularSimplesuspectApp
 *
 * Main module of the application.
 */
angular
	.module('angularSimplesuspectApp', [
		'ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'webcam'
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
