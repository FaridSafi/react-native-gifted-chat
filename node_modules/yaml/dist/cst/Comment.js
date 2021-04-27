"use strict";

exports.Comment = void 0;

var _constants = require("../constants");

var _Node = require("./Node");

var _Range = require("./Range");

class Comment extends _Node.Node {
  constructor() {
    super(_constants.Type.COMMENT);
  }
  /**
   * Parses a comment line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const offset = this.parseComment(start);
    this.range = new _Range.Range(start, offset);
    return offset;
  }

}

exports.Comment = Comment;