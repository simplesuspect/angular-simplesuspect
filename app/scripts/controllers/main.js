'use strict';

/**
 * @ngdoc function
 * @name angularSimplesuspectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularSimplesuspectApp
 */
angular.module('angularSimplesuspectApp')
	.controller('MainCtrl', function ($scope, $interval) {


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
			hiddenCanvas.width = 1280 || _video.width;
			hiddenCanvas.height = 720 || _video.height;
			var ctx = hiddenCanvas.getContext('2d');
			ctx.drawImage(_video, 0, 0, _video.width, _video.height);
			return ctx.getImageData(x, y, w, h);
		};

		/**
		 * This function could be used to send the image data
		 * to a backend server that expects base64 encoded images.
		 *
		 * In this example, we simply store it in the scope for display.
		 */
		var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
			$scope.snapshotData = imgBase64;
			console.log('captured image!');
		};

		$interval(function () {
			// sendSnapshotToServer()
			$scope.makeSnapshot();
		}, 1000);


		//select camera


		var videoElement = document.querySelector('video');
		var audioInputSelect = document.querySelector('select#audioSource');
		var audioOutputSelect = document.querySelector('select#audioOutput');
		var videoSelect = document.querySelector('select#videoSource');
		var selectors = [audioInputSelect, audioOutputSelect, videoSelect];

		function gotDevices(deviceInfos) {
			// Handles being called several times to update labels. Preserve values.
			var values = selectors.map(function (select) {
				return select.value;
			});
			selectors.forEach(function (select) {
				while (select.firstChild) {
					select.removeChild(select.firstChild);
				}
			});
			for (var i = 0; i !== deviceInfos.length; ++i) {
				var deviceInfo = deviceInfos[i];
				var option = document.createElement('option');
				option.value = deviceInfo.deviceId;
				if (deviceInfo.kind === 'audioinput') {
					option.text = deviceInfo.label ||
						'microphone ' + (audioInputSelect.length + 1);
					audioInputSelect.appendChild(option);
				} else if (deviceInfo.kind === 'audiooutput') {
					option.text = deviceInfo.label || 'speaker ' +
						(audioOutputSelect.length + 1);
					audioOutputSelect.appendChild(option);
				} else if (deviceInfo.kind === 'videoinput') {
					option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
					videoSelect.appendChild(option);
				} else {
					console.log('Some other kind of source/device: ', deviceInfo);
				}
			}
			selectors.forEach(function (select, selectorIndex) {
				if (Array.prototype.slice.call(select.childNodes).some(function (n) {
						return n.value === values[selectorIndex];
					})) {
					select.value = values[selectorIndex];
				}
			});
		}

		navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

		// Attach audio output device to video element using device/sink ID.
		function attachSinkId(element, sinkId) {
			if (typeof element.sinkId !== 'undefined') {
				element.setSinkId(sinkId)
					.then(function () {
						console.log('Success, audio output device attached: ' + sinkId);
					})
					.catch(function (error) {
						var errorMessage = error;
						if (error.name === 'SecurityError') {
							errorMessage = 'You need to use HTTPS for selecting audio output ' +
								'device: ' + error;
						}
						console.error(errorMessage);
						// Jump back to first output device in the list as it's the default.
						audioOutputSelect.selectedIndex = 0;
					});
			} else {
				console.warn('Browser does not support output device selection.');
			}
		}

		function changeAudioDestination() {
			var audioDestination = audioOutputSelect.value;
			attachSinkId(videoElement, audioDestination);
		}

		function gotStream(stream) {
			window.stream = stream; // make stream available to console
			videoElement.srcObject = stream;
			// Refresh button list in case labels have become available
			return navigator.mediaDevices.enumerateDevices();
		}

		function start() {
			if (window.stream) {
				window.stream.getTracks().forEach(function (track) {
					track.stop();
				});
			}
			var audioSource = audioInputSelect.value;
			var videoSource = videoSelect.value;
			var constraints = {
				audio: {
					deviceId: audioSource ? {
						exact: audioSource
					} : undefined
				},
				video: {
					deviceId: videoSource ? {
						exact: videoSource
					} : undefined
				}
			};
			navigator.mediaDevices.getUserMedia(constraints).
			then(gotStream).then(gotDevices).catch(handleError);
		}

		audioInputSelect.onchange = start;
		audioOutputSelect.onchange = changeAudioDestination;
		videoSelect.onchange = start;

		start();

		function handleError(error) {
			console.log('navigator.getUserMedia error: ', error);
		}



	});
