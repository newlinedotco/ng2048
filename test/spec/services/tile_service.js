'use strict';

describe('Service: TileService', function () {

  // load the service's module
  beforeEach(module('twentyfourtyeightApp'));

  // instantiate service
  var TileService;
  beforeEach(inject(function (_TileService_) {
    TileService = _TileService_;
  }));

  it('should do something', function () {
    expect(!!TileService).toBe(true);
  });

});
