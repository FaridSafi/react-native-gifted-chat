"use strict";

exports.tags = exports.schemas = void 0;

var _core = require("./core");

var _failsafe = require("./failsafe");

var _json = require("./json");

var _yaml = require("./yaml-1.1");

var _map = require("./failsafe/map");

var _seq = require("./failsafe/seq");

var _binary = require("./yaml-1.1/binary");

var _omap = require("./yaml-1.1/omap");

var _pairs = require("./yaml-1.1/pairs");

var _set = require("./yaml-1.1/set");

var _timestamp = require("./yaml-1.1/timestamp");

const schemas = {
  core: _core.core,
  failsafe: _failsafe.failsafe,
  json: _json.json,
  yaml11: _yaml.yaml11
};
exports.schemas = schemas;
const tags = {
  binary: _binary.binary,
  bool: _core.boolObj,
  float: _core.floatObj,
  floatExp: _core.expObj,
  floatNaN: _core.nanObj,
  floatTime: _timestamp.floatTime,
  int: _core.intObj,
  intHex: _core.hexObj,
  intOct: _core.octObj,
  intTime: _timestamp.intTime,
  map: _map.map,
  null: _core.nullObj,
  omap: _omap.omap,
  pairs: _pairs.pairs,
  seq: _seq.seq,
  set: _set.set,
  timestamp: _timestamp.timestamp
};
exports.tags = tags;