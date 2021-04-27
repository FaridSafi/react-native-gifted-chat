'use strict';

var typeHandlers = require('./types');

module.exports = function (buffer, filepath) {
  var type, result;
  for (type in typeHandlers) {
    result = typeHandlers[type].detect(buffer, filepath);
    if (result) {
      return type;
    }
  }
};
