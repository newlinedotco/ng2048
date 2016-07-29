describe('Keyboard', function() {

  beforeEach(module('Keyboard'));

  describe('KeyboardService', function() {

    var keyboardService, _document, _event;
    beforeEach( inject( function(_KeyboardService_, $document) {
      keyboardService = _KeyboardService_;
      _document = $document;
    }));

    describe('.init', function() {
      
      beforeEach(function() {
        // create keyboard event
        _event = new window.KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          shiftKey: true
        });

        delete _event.which;
        // define property 'which' with UP keyboard code
        Object.defineProperty(_event, 'which', {'value': 38});
      });
      it('should bind keydown event listener to document DOM', function() {
        // call method to be tested
        keyboardService.init();
        // spy on a follow up method
        spyOn(keyboardService, '_handleKeyEvent').andCallThrough();
        // dispatch the event
        _document[0].dispatchEvent(_event);
        // check if it was called
        expect(keyboardService._handleKeyEvent).toHaveBeenCalled();
      });

    });

  });

});