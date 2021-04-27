"use strict";

exports.listTagNames = void 0;

var _Collection = require("./schema/Collection");

var _Pair = require("./schema/Pair");

var _Scalar = require("./schema/Scalar");

const visit = (node, tags) => {
  if (node && typeof node === 'object') {
    const {
      tag
    } = node;

    if (node instanceof _Collection.Collection) {
      if (tag) tags[tag] = true;
      node.items.forEach(n => visit(n, tags));
    } else if (node instanceof _Pair.Pair) {
      visit(node.key, tags);
      visit(node.value, tags);
    } else if (node instanceof _Scalar.Scalar) {
      if (tag) tags[tag] = true;
    }
  }

  return tags;
};

const listTagNames = node => Object.keys(visit(node, {}));

exports.listTagNames = listTagNames;