"use strict";

exports.seq = void 0;

var _parseSeq = require("../../schema/parseSeq");

var _Seq = require("../../schema/Seq");

function createSeq(schema, obj, ctx) {
  const seq = new _Seq.YAMLSeq(schema);

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

const seq = {
  createNode: createSeq,
  default: true,
  nodeClass: _Seq.YAMLSeq,
  tag: 'tag:yaml.org,2002:seq',
  resolve: _parseSeq.parseSeq
};
exports.seq = seq;