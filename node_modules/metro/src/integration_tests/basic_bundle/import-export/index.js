/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "namedDefaultExported", {
  enumerable: true,
  get: function() {
    return _export3.default;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function() {
    return _export4.foo;
  }
});
exports.asyncImportESM = exports.asyncImportCJS = exports.extraData = void 0;

var _export = _interopRequireWildcard(require("./export-1"));

var importStar = _interopRequireWildcard(require("./export-2"));

var _exportNull = require("./export-null");

var _exportPrimitiveDefault = _interopRequireWildcard(
  require("./export-primitive-default")
);

var _export3 = _interopRequireDefault(require("./export-3"));

var _export4 = require("./export-4");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

const extraData = {
  foo: _exportNull.foo,
  importStar,
  myDefault: _export.default,
  myFoo: _export.foo,
  myFunction: (0, _export.myFunction)(),
  primitiveDefault: _exportPrimitiveDefault.default,
  primitiveFoo: _exportPrimitiveDefault.foo
};
exports.extraData = extraData;
const asyncImportCJS = import("./export-5");
exports.asyncImportCJS = asyncImportCJS;
const asyncImportESM = import("./export-6");
exports.asyncImportESM = asyncImportESM;
