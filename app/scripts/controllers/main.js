'use strict';

/**
 * @ngdoc function
 * @name angularSimplesuspectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularSimplesuspectApp
 */
angular.module('angularSimplesuspectApp')
	.controller('MainCtrl', function ($scope, $interval, $routeParams, upload, $http) {

		$scope.cameraId = $routeParams.cameraId;


		var _video = null;
		var patData = null;

		$scope.showDemos = false;
		$scope.edgeDetection = false;
		$scope.mono = false;
		$scope.invert = false;

		$scope.patOpts = {
			x: 0,
			y: 0,
			w: 1280,
			h: 720
		};

		// Setup a channel to receive a video property
		// with a reference to the video element
		// See the HTML binding in main.html
		$scope.channel = {};

		$scope.webcamError = false;
		$scope.onError = function (err) {
			$scope.$apply(
				function () {
					$scope.webcamError = err;
				}
			);
		};

		$scope.onSuccess = function () {
			// The video element contains the captured camera data
			_video = $scope.channel.video;
			$scope.$apply(function () {
				$scope.patOpts.w = _video.width;
				$scope.patOpts.h = _video.height;
				$scope.showDemos = true;
			});
		};

		$scope.onStream = function (stream) {
			// You could do something manually with the stream.
		};


		/**
		 * Make a snapshot of the camera data and show it in another canvas.
		 */
		$scope.makeSnapshot = function makeSnapshot() {
			if (_video) {
				var patCanvas = document.querySelector('#snapshot');
				if (!patCanvas) return;

				patCanvas.width = _video.width;
				patCanvas.height = _video.height;
				var ctxPat = patCanvas.getContext('2d');

				var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
				ctxPat.putImageData(idata, 0, 0);

				sendSnapshotToServer(patCanvas.toDataURL());

				patData = idata;
			}
		};

		/**
		 * Redirect the browser to the URL given.
		 * Used to download the image by passing a dataURL string
		 */
		$scope.downloadSnapshot = function downloadSnapshot(dataURL) {
			window.location.href = dataURL;
		};

		var getVideoData = function getVideoData(x, y, w, h) {
			var hiddenCanvas = document.createElement('canvas');
			hiddenCanvas.width = _video.width;
			hiddenCanvas.height = _video.height;
			var ctx = hiddenCanvas.getContext('2d');
			ctx.drawImage(_video, 0, 0, _video.width, _video.height);
			return ctx.getImageData(x, y, w, h);
		};



		var sendToServer = function (imgBase64) {
			$scope.status = 'checking';
			var req = {
				method: 'POST',
				url: 'https://simplesuspect.herokuapp.com/s',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					data: imgBase64
				}
			}

			$http(req).then(function (resp) {
				$scope.status = 'facefound';
				$scope.person = resp.data;
				console.log(resp.data);
				setTimeout(function () {
					$scope.makeSnapshot();
				}, 500);
			}, function (resp) {
				$scope.person = '';
				$scope.status = 'noface';
				setTimeout(function () {
					$scope.makeSnapshot();
				}, 500);
			});


			// 	var uploadUrl = 'https://simplesuspect.herokuapp.com/s';
			// 	upload.uploadFileToUrl(
			// 		imgBase64, uploadUrl, {}).then(function (resp) {
			// 		console.log(resp);
			// 	}).fail(function (resp) {
			// 		console.log(resp);
			// 	})
		};

		/**
		 * This function could be used to send the image data
		 * to a backend server that expects base64 encoded images.
		 *
		 * In this example, we simply store it in the scope for display.
		 */
		var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
			$scope.snapshotData = imgBase64;
			sendToServer(imgBase64);
			// console.log('captured image!\n', imgBase64);
		};
		setTimeout(function () {
			$scope.makeSnapshot();
		}, 2000);

		// var setSnapShotInterval = $interval(function () {
		// 	$scope.makeSnapshot();
		// }, 5000);


		$scope.$on('$destroy', function () {
			// Make sure that the interval is destroyed too
			$interval.cancel(setSnapShotInterval);
		});

	});
