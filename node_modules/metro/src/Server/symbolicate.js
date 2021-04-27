/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const _require = require("metro-source-map/src/Consumer/search"),
  greatestLowerBound = _require.greatestLowerBound;

const _require2 = require("metro-symbolicate/src/Symbolication"),
  SourceMetadataMapConsumer = _require2.SourceMetadataMapConsumer;

function createFunctionNameGetter(module) {
  const consumer = new SourceMetadataMapConsumer(
    {
      version: 3,
      mappings: "",
      sources: ["dummy"],
      names: [],
      x_facebook_sources: [[module.functionMap]]
    },
    name => name
    /* no normalization needed */
  );
  return _ref => {
    let line1Based = _ref.line1Based,
      column0Based = _ref.column0Based;
    return consumer.functionNameFor({
      line: line1Based,
      column: column0Based,
      source: "dummy"
    });
  };
}

function symbolicate(_x, _x2, _x3) {
  return _symbolicate.apply(this, arguments);
}

function _symbolicate() {
  _symbolicate = _asyncToGenerator(function*(stack, maps, config) {
    const mapsByUrl = new Map();

    for (const _ref2 of maps) {
      var _ref3 = _slicedToArray(_ref2, 2);

      const url = _ref3[0];
      const map = _ref3[1];
      mapsByUrl.set(url, map);
    }

    const functionNameGetters = new Map();

    function findModule(frame) {
      const map = mapsByUrl.get(frame.file);

      if (!map || frame.lineNumber == null) {
        return null;
      }

      const moduleIndex = greatestLowerBound(
        map,
        frame.lineNumber,
        (target, candidate) => target - candidate.firstLine1Based
      );

      if (moduleIndex == null) {
        return null;
      }

      return map[moduleIndex];
    }

    function findOriginalPos(frame, module) {
      if (
        module.map == null ||
        frame.lineNumber == null ||
        frame.column == null
      ) {
        return null;
      }

      const generatedPosInModule = {
        line1Based: frame.lineNumber - module.firstLine1Based + 1,
        column0Based: frame.column
      };
      const mappingIndex = greatestLowerBound(
        module.map,
        generatedPosInModule,
        (target, candidate) => {
          if (target.line1Based === candidate[0]) {
            return target.column0Based - candidate[1];
          }

          return target.line1Based - candidate[0];
        }
      );

      if (mappingIndex == null) {
        return null;
      }

      const mapping = module.map[mappingIndex];

      if (
        mapping[0] !== generatedPosInModule.line1Based ||
        mapping.length < 4
        /* no source line/column info */
      ) {
        return null;
      }

      return {
        // $FlowFixMe: Length checks do not refine tuple unions.
        line1Based: mapping[2],
        // $FlowFixMe: Length checks do not refine tuple unions.
        column0Based: mapping[3]
      };
    }

    function findFunctionName(originalPos, module) {
      if (module.functionMap) {
        let getFunctionName = functionNameGetters.get(module);

        if (!getFunctionName) {
          getFunctionName = createFunctionNameGetter(module);
          functionNameGetters.set(module, getFunctionName);
        }

        return getFunctionName(originalPos);
      }

      return null;
    }

    function symbolicateFrame(frame) {
      var _findFunctionName;

      const module = findModule(frame);

      if (!module) {
        return frame;
      }

      if (!Array.isArray(module.map)) {
        throw new Error(
          `Unexpected module with serialized source map found: ${module.path}`
        );
      }

      const originalPos = findOriginalPos(frame, module);

      if (!originalPos) {
        return frame;
      }

      const methodName =
        (_findFunctionName = findFunctionName(originalPos, module)) !== null &&
        _findFunctionName !== void 0
          ? _findFunctionName
          : frame.methodName;
      return _objectSpread({}, frame, {
        methodName,
        file: module.path,
        lineNumber: originalPos.line1Based,
        column: originalPos.column0Based
      });
    }

    function customizeFrame(_x4) {
      return _customizeFrame.apply(this, arguments);
    }

    function _customizeFrame() {
      _customizeFrame = _asyncToGenerator(function*(frame) {
        const customizations =
          (yield config.symbolicator.customizeFrame(frame)) || {};
        return _objectSpread(
          {},
          frame,
          {
            collapse: false
          },
          customizations
        );
      });
      return _customizeFrame.apply(this, arguments);
    }

    return Promise.all(stack.map(symbolicateFrame).map(customizeFrame));
  });
  return _symbolicate.apply(this, arguments);
}

module.exports = symbolicate;
