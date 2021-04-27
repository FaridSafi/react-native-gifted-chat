"use strict";

exports.BlankLine = void 0;

var _constants = require("../constants");

var _Node = require("./Node");

var _Range = require("./Range");

class BlankLine extends _Node.Node {
  constructor() {
    super(_constants.Type.BLANK_LINE);
  }
  /* istanbul ignore next */


  get includesTrailingLines() {
    // This is never called from anywhere, but if it were,
    // this is the value it should return.
    return true;
  }
  /**
   * Parses a blank line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first \n character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    this.range = new _Range.Range(start, start + 1);
    return start + 1;
  }

}

exports.BlankLine = BlankLine;