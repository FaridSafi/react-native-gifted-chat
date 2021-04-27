"use strict";

exports.Scalar = void 0;

var _toJSON = require("../toJSON");

var _Node = require("./Node");

// Published as 'yaml/scalar'
class Scalar extends _Node.Node {
  constructor(value) {
    super();
    this.value = value;
  }

  toJSON(arg, ctx) {
    return ctx && ctx.keep ? this.value : (0, _toJSON.toJSON)(this.value, arg, ctx);
  }

  toString() {
    return String(this.value);
  }

}

exports.Scalar = Scalar;