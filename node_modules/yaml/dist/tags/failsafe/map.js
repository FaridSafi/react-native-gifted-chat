"use strict";

exports.map = void 0;

var _Map = require("../../schema/Map");

var _parseMap = require("../../schema/parseMap");

function createMap(schema, obj, ctx) {
  const map = new _Map.YAMLMap(schema);

  if (obj instanceof Map) {
    for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
  }

  if (typeof schema.sortMapEntries === 'function') {
    map.items.sort(schema.sortMapEntries);
  }

  return map;
}

const map = {
  createNode: createMap,
  default: true,
  nodeClass: _Map.YAMLMap,
  tag: 'tag:yaml.org,2002:map',
  resolve: _parseMap.parseMap
};
exports.map = map;