"use strict";

exports.YAML = void 0;

var _parse = require("./cst/parse");

var _Document = require("./Document");

var _errors = require("./errors");

var _schema = require("./schema");

var _options = require("./tags/options");

var _warnings = require("./warnings");

const defaultOptions = {
  anchorPrefix: 'a',
  customTags: null,
  indent: 2,
  indentSeq: true,
  keepCstNodes: false,
  keepNodeTypes: true,
  keepBlobsInJSON: true,
  mapAsMap: false,
  maxAliasCount: 100,
  prettyErrors: false,
  // TODO Set true in v2
  simpleKeys: false,
  version: '1.2'
};
const scalarOptions = {
  get binary() {
    return _options.binaryOptions;
  },

  set binary(opt) {
    Object.assign(_options.binaryOptions, opt);
  },

  get bool() {
    return _options.boolOptions;
  },

  set bool(opt) {
    Object.assign(_options.boolOptions, opt);
  },

  get int() {
    return _options.intOptions;
  },

  set int(opt) {
    Object.assign(_options.intOptions, opt);
  },

  get null() {
    return _options.nullOptions;
  },

  set null(opt) {
    Object.assign(_options.nullOptions, opt);
  },

  get str() {
    return _options.strOptions;
  },

  set str(opt) {
    Object.assign(_options.strOptions, opt);
  }

};

function createNode(value, wrapScalars = true, tag) {
  if (tag === undefined && typeof wrapScalars === 'string') {
    tag = wrapScalars;
    wrapScalars = true;
  }

  const options = Object.assign({}, _Document.Document.defaults[defaultOptions.version], defaultOptions);
  const schema = new _schema.Schema(options);
  return schema.createNode(value, wrapScalars, tag);
}

class Document extends _Document.Document {
  constructor(options) {
    super(Object.assign({}, defaultOptions, options));
  }

}

function parseAllDocuments(src, options) {
  const stream = [];
  let prev;

  for (const cstDoc of (0, _parse.parse)(src)) {
    const doc = new Document(options);
    doc.parse(cstDoc, prev);
    stream.push(doc);
    prev = doc;
  }

  return stream;
}

function parseDocument(src, options) {
  const cst = (0, _parse.parse)(src);
  const doc = new Document(options).parse(cst[0]);

  if (cst.length > 1) {
    const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
    doc.errors.unshift(new _errors.YAMLSemanticError(cst[1], errMsg));
  }

  return doc;
}

function parse(src, options) {
  const doc = parseDocument(src, options);
  doc.warnings.forEach(warning => (0, _warnings.warn)(warning));
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJSON();
}

function stringify(value, options) {
  const doc = new Document(options);
  doc.contents = value;
  return String(doc);
}

const YAML = {
  createNode,
  defaultOptions,
  Document,
  parse,
  parseAllDocuments,
  parseCST: _parse.parse,
  parseDocument,
  scalarOptions,
  stringify
};
exports.YAML = YAML;