'use strict';

describe('Controller: StereoCtrl', function () {

  // load the controller's module
  beforeEach(module('angularSimplesuspectApp'));

  var StereoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StereoCtrl = $controller('StereoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StereoCtrl.awesomeThings.length).toBe(3);
  });
});
