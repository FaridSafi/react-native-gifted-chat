"use strict";

exports.parsePairs = parsePairs;
exports.createPairs = createPairs;
exports.pairs = void 0;

var _errors = require("../../errors");

var _Map = require("../../schema/Map");

var _Pair = require("../../schema/Pair");

var _parseSeq = require("../../schema/parseSeq");

var _Seq = require("../../schema/Seq");

function parsePairs(doc, cst) {
  const seq = (0, _parseSeq.parseSeq)(doc, cst);

  for (let i = 0; i < seq.items.length; ++i) {
    let item = seq.items[i];
    if (item instanceof _Pair.Pair) continue;else if (item instanceof _Map.YAMLMap) {
      if (item.items.length > 1) {
        const msg = 'Each pair must have its own sequence indicator';
        throw new _errors.YAMLSemanticError(cst, msg);
      }

      const pair = item.items[0] || new _Pair.Pair();
      if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
      if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
      item = pair;
    }
    seq.items[i] = item instanceof _Pair.Pair ? item : new _Pair.Pair(item);
  }

  return seq;
}

function createPairs(schema, iterable, ctx) {
  const pairs = new _Seq.YAMLSeq(schema);
  pairs.tag = 'tag:yaml.org,2002:pairs';

  for (const it of iterable) {
    let key, value;

    if (Array.isArray(it)) {
      if (it.length === 2) {
        key = it[0];
        value = it[1];
      } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    } else if (it && it instanceof Object) {
      const keys = Object.keys(it);

      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
    } else {
      key = it;
    }

    const pair = schema.createPair(key, value, ctx);
    pairs.items.push(pair);
  }

  return pairs;
}

const pairs = {
  default: false,
  tag: 'tag:yaml.org,2002:pairs',
  resolve: parsePairs,
  createNode: createPairs
};
exports.pairs = pairs;