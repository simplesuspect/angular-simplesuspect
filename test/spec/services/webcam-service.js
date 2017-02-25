'use strict';

describe('Service: webcamService', function () {

  // load the service's module
  beforeEach(module('angularSimplesuspectApp'));

  // instantiate service
  var webcamService;
  beforeEach(inject(function (_webcamService_) {
    webcamService = _webcamService_;
  }));

  it('should do something', function () {
    expect(!!webcamService).toBe(true);
  });

});
