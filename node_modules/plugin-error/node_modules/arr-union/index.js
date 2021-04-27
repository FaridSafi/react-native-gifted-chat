/*!
 * arr-union <https://github.com/jonschlinkert/arr-union>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function union(arr) {
  var len = arguments.length;
  var res = [], i = 0;

  while (len--) {
    var arg = arrayify(arguments[i++]);

    for (var j = 0; j < arg.length; j++) {
      var ele = arg[j];

      if (res.indexOf(ele) === -1) {
        res.push(ele);
      }
    }
  }
  return res;
};

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}
