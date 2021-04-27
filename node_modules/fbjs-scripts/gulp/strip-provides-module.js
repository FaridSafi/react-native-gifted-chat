/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var PluginError = require('plugin-error');
var through = require('through2');
var PM_REGEXP = require('./shared/provides-module').regexp;

module.exports = function(opts) {
  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('module-map', 'Streaming not supported'));
      return;
    }

    // Get the @providesModule piece out of the file and save that.
    var contents = file.contents.toString().replace(PM_REGEXP, '');
    file.contents = new Buffer(contents);
    this.push(file);
    cb();
  }

  return through.obj(transform);
};
