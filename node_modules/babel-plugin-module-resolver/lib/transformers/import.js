"use strict";

exports.__esModule = true;
exports.default = transformImport;

var _utils = require("../utils");

function transformImport(nodePath, state) {
  if (state.moduleResolverVisited.has(nodePath)) {
    return;
  }

  state.moduleResolverVisited.add(nodePath);
  (0, _utils.mapPathString)(nodePath.get('source'), state);
}