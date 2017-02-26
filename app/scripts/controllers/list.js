'use strict';

/**
 * @ngdoc function
 * @name angularSimplesuspectApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the angularSimplesuspectApp
 */
angular.module('angularSimplesuspectApp')
	.controller('ListCtrl', function ($scope) {


		var videoSources = [];

		function gotSources(sourceInfos) {
			console.log('videoSources\n', sourceInfos);

			for (var i = 0; i !== sourceInfos.length; ++i) {
				var sourceInfo = sourceInfos[i];
				console.log('videoSource\n', sourceInfo);
				videoSources.push(sourceInfo);
			}

			setInterval(function () {
				$scope.$apply(function () {
					$scope.mediaDeviceList = videoSources;

				});
			}, 0);

			var mediaConstraint;

			if ($scope.cameraid) {
				console.log('videoSources\n', videoSources);
				console.log('cameraid', $scope.cameraid);

				mediaConstraint = {
					video: {
						optional: [{
							sourceId: videoSources[$scope.cameraid].id
						}]
					},
					audio: false
				};
			} else {
				mediaConstraint = {
					video: true,
					audio: false
				};
			}
			navigator.getUserMedia(mediaConstraint, onSuccess, onFailure);
		}
		navigator.mediaDevices.enumerateDevices().then(gotSources);

		if (typeof MediaStreamTrack !== 'undefined') {
			// MediaStreamTrack.getSources(gotSources);
			// navigator.mediaDevices.enumerateDevices().then(gotSources);
		}


	});
