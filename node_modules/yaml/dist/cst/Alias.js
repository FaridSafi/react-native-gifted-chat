"use strict";

exports.Alias = void 0;

var _Node = require("./Node");

var _Range = require("./Range");

class Alias extends _Node.Node {
  /**
   * Parses an *alias from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;

    let offset = _Node.Node.endOfIdentifier(src, start + 1);

    this.valueRange = new _Range.Range(start + 1, offset);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.Alias = Alias;