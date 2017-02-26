'use strict';

/**
 * @ngdoc service
 * @name angularSimplesuspectApp.upload
 * @description
 * # upload
 * Service in the angularSimplesuspectApp.
 */
angular.module('angularSimplesuspectApp')
	.service('upload', function ($http) {
		this.uploadFileToUrl = function (file, uploadUrl, params) {
			var json = {
				"data": file
			};
			promise = $http.post(uploadUrl, JSON.stringify(json), {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': "application/json"
				},
				params: params
			});

			return promise;
		}
	});
