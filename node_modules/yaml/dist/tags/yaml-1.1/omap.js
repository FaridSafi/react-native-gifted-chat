"use strict";

exports.omap = exports.YAMLOMap = void 0;

var _errors = require("../../errors");

var _toJSON = require("../../toJSON");

var _Map = require("../../schema/Map");

var _Pair = require("../../schema/Pair");

var _Scalar = require("../../schema/Scalar");

var _Seq = require("../../schema/Seq");

var _pairs = require("./pairs");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class YAMLOMap extends _Seq.YAMLSeq {
  constructor() {
    super();

    _defineProperty(this, "add", _Map.YAMLMap.prototype.add.bind(this));

    _defineProperty(this, "delete", _Map.YAMLMap.prototype.delete.bind(this));

    _defineProperty(this, "get", _Map.YAMLMap.prototype.get.bind(this));

    _defineProperty(this, "has", _Map.YAMLMap.prototype.has.bind(this));

    _defineProperty(this, "set", _Map.YAMLMap.prototype.set.bind(this));

    this.tag = YAMLOMap.tag;
  }

  toJSON(_, ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const pair of this.items) {
      let key, value;

      if (pair instanceof _Pair.Pair) {
        key = (0, _toJSON.toJSON)(pair.key, '', ctx);
        value = (0, _toJSON.toJSON)(pair.value, key, ctx);
      } else {
        key = (0, _toJSON.toJSON)(pair, '', ctx);
      }

      if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
      map.set(key, value);
    }

    return map;
  }

}

exports.YAMLOMap = YAMLOMap;

_defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  const pairs = (0, _pairs.parsePairs)(doc, cst);
  const seenKeys = [];

  for (const {
    key
  } of pairs.items) {
    if (key instanceof _Scalar.Scalar) {
      if (seenKeys.includes(key.value)) {
        const msg = 'Ordered maps must not include duplicate keys';
        throw new _errors.YAMLSemanticError(cst, msg);
      } else {
        seenKeys.push(key.value);
      }
    }
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  const pairs = (0, _pairs.createPairs)(schema, iterable, ctx);
  const omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

const omap = {
  identify: value => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};
exports.omap = omap;