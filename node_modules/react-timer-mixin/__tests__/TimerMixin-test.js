/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

global.setImmediate = jest.genMockFunction();
global.clearImmediate = jest.genMockFunction();
global.requestAnimationFrame = jest.genMockFunction();
global.cancelAnimationFrame = jest.genMockFunction();

jest.dontMock('../TimerMixin');
var TimerMixin = require('../TimerMixin');

describe('TimerMixin', function() {
  var component;
  beforeEach(function() {
    component = Object.create(TimerMixin);
    // Simulate React auto-binding
    [
      'setTimeout', 'clearTimeout',
      'setInterval', 'clearInterval',
      'setImmediate', 'clearImmediate',
      'requestAnimationFrame', 'cancelAnimationFrame'
    ].forEach(function(key) {
      component[key] = component[key].bind(component);
    });
  });

  [
    {setter: 'setTimeout', clearer: 'clearTimeout', array: 'TimerMixin_timeouts'},
    {setter: 'setInterval', clearer: 'clearInterval', array: 'TimerMixin_intervals'},
    {setter: 'setImmediate', clearer: 'clearImmediate', array: 'TimerMixin_immediates'},
    {setter: 'requestAnimationFrame', clearer: 'cancelAnimationFrame', array: 'TimerMixin_rafs'},
  ].forEach(function(type) {
    it('should apply basic ' + type.setter + ' correctly', function() {
      expect(component[type.array]).toEqual(undefined);

      global[type.setter].mockClear();
      global[type.setter].mockReturnValue(1);
      global[type.clearer].mockClear();
      var cb = jest.genMockFunction();
      var id = component[type.setter](cb, 10);

      expect(global[type.setter]).toBeCalledWith(cb, 10);
      expect(global[type.clearer]).not.toBeCalled();
      expect(component[type.array]).toEqual([id]);

      component.componentWillUnmount();

      expect(global[type.clearer]).toBeCalledWith(id);
      expect(component[type.array]).toEqual(null);
    });

    it('should apply ' + type.clearer + ' correctly', function() {
      var id = 1;
      global[type.setter].mockClear();
      global[type.setter].mockImpl(function() { return id++; });
      global[type.clearer].mockClear();
      var cb = jest.genMockFunction();

      var id1 = component[type.setter](cb, 10);
      var id2 = component[type.setter](cb, 10);
      var id3 = component[type.setter](cb, 10);
      component[type.clearer](id2);
      expect(global[type.clearer]).toBeCalledWith(id2);
      var id4 = component[type.setter](cb, 10);
      component[type.clearer](id1);
      expect(global[type.clearer]).toBeCalledWith(id1);
      var id5 = component[type.setter](cb, 10);
      component[type.clearer](id5);
      expect(global[type.clearer]).toBeCalledWith(id5);
      component[type.clearer](id3);
      expect(global[type.clearer]).toBeCalledWith(id3);

      expect(component[type.array]).toEqual([id4]);
      component.componentWillUnmount();
      expect(global[type.clearer]).toBeCalledWith(id4);
      expect(component[type.array]).toEqual(null);
    });

    it('should remove bookeeping when callback is called for ' + type.setter, function() {
      global[type.setter].mockClear();
      global[type.setter].mockReturnValue(1);
      global[type.clearer].mockClear();
      var cb = jest.genMockFunction();
      var id = component[type.setter](cb, 10);
      expect(cb).not.toBeCalled();
      global[type.setter].mock.calls[0][0]();
      expect(cb).toBeCalled();

      if (type.setter !== 'setInterval') {
        expect(global[type.clearer]).toBeCalledWith(id);
        expect(component[type.array]).toEqual([]);
      } else {
        expect(global[type.clearer]).not.toBeCalled();
        expect(component[type.array]).toEqual([id]);
      }
    });
  });

});
