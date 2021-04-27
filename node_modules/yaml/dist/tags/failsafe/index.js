"use strict";

exports.failsafe = void 0;

var _map = require("./map");

var _seq = require("./seq");

var _string = require("./string");

const failsafe = [_map.map, _seq.seq, _string.string];
exports.failsafe = failsafe;