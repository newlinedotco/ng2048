'use strict';

describe('Service: Gameservice', function () {

  // load the service's module
  beforeEach(module('twentyfourtyeightApp'));

  // instantiate service
  var Gameservice;
  beforeEach(inject(function (_Gameservice_) {
    Gameservice = _Gameservice_;
  }));

  it('should do something', function () {
    expect(!!Gameservice).toBe(true);
  });

});
