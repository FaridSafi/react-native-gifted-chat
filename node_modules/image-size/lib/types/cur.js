'use strict';

var TYPE_CURSOR = 2;

function isCUR (buffer) {
  var type;
  if (buffer.readUInt16LE(0) !== 0) {
    return false;
  }
  type = buffer.readUInt16LE(2);
  return type === TYPE_CURSOR;
}

module.exports = {
  'detect': isCUR,
  'calculate': require('./ico').calculate
};
