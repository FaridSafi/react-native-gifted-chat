'use strict';

var fs = require('fs');
var path = require('path');

var typeHandlers = require('./types');
var detector = require('./detector');

// Maximum buffer size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
var MaxBufferSize = 512*1024;

/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @param {String} filepath
 * @returns {Object}
 */
function lookup (buffer, filepath) {
  // detect the file type.. don't rely on the extension
  var type = detector(buffer, filepath);

  // find an appropriate handler for this file type
  if (type in typeHandlers) {
    var size = typeHandlers[type].calculate(buffer, filepath);
    if (size !== false) {
      size.type = type;
      return size;
    }
  }

  // throw up, if we don't understand the file
  throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')');
}

/**
 * Reads a file into a buffer.
 *
 * The callback will be called after the process has completed. The
 * callback's first argument will be an error (or null). The second argument
 * will be the Buffer, if the operation was successful.
 *
 * @param {String} filepath
 * @param {Function} callback
 */
function asyncFileToBuffer (filepath, callback) {
  // open the file in read only mode
  fs.open(filepath, 'r', function (err, descriptor) {
    if (err) { return callback(err); }
    fs.fstat(descriptor, function (err, stats) {
      if (err) { return callback(err); }
      var size = stats.size;
      if (size <= 0) {
        return callback(new Error('File size is not greater than 0 —— ' + filepath));
      }
      var bufferSize = Math.min(size, MaxBufferSize);
      var buffer = new Buffer(bufferSize);
      // read first buffer block from the file, asynchronously
      fs.read(descriptor, buffer, 0, bufferSize, 0, function (err) {
        if (err) { return callback(err); }
        // close the file, we are done
        fs.close(descriptor, function (err) {
          callback(err, buffer);
        });
      });
    });
  });
}

/**
 * Synchronously reads a file into a buffer, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Buffer}
 */
function syncFileToBuffer (filepath) {
  // read from the file, synchronously
  var descriptor = fs.openSync(filepath, 'r');
  var size = fs.fstatSync(descriptor).size;
  var bufferSize = Math.min(size, MaxBufferSize);
  var buffer = new Buffer(bufferSize);
  fs.readSync(descriptor, buffer, 0, bufferSize, 0);
  fs.closeSync(descriptor);
  return buffer;
}

/**
 * @param {Buffer|string} input - buffer or relative/absolute path of the image file
 * @param {Function} callback - optional function for async detection
 */
module.exports = function (input, callback) {

  // Handle buffer input
  if (Buffer.isBuffer(input)) {
    return lookup(input);
  }

  // input should be a string at this point
  if (typeof input !== 'string') {
    throw new TypeError('invalid invocation');
  }

  // resolve the file path
  var filepath = path.resolve(input);

  if (typeof callback === 'function') {
    asyncFileToBuffer(filepath, function (err, buffer) {
      if (err) { return callback(err); }

      // return the dimensions
      var dimensions;
      try {
        dimensions = lookup(buffer, filepath);
      } catch (e) {
        err = e;
      }
      callback(err, dimensions);
    });
  } else {
    var buffer = syncFileToBuffer(filepath);
    return lookup(buffer, filepath);
  }
};

module.exports.types = Object.keys(typeHandlers);
