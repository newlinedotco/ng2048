'use strict';

describe('Service: GridService', function () {

  // load the service's module
  beforeEach(module('twentyfourtyeightApp'));

  // instantiate service
  var GridService;
  beforeEach(inject(function (_GridService_) {
    GridService = _GridService_;
  }));

  it('should do something', function () {
    expect(!!GridService).toBe(true);
  });

});
