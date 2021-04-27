#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var imageSize = require('..');

var files = process.argv.slice(2);

if (!files.length) {
  console.error('Usage: image-size image1 [image2] [image3] ...');
  process.exit(-1);
}

var red = ['\x1B[31m', '\x1B[39m'];
// var bold = ['\x1B[1m',  '\x1B[22m'];
var grey = ['\x1B[90m', '\x1B[39m'];
var green = ['\x1B[32m', '\x1B[39m'];

function colorize(text, color) {
  return color[0] + text + color[1]
}

files.forEach(function (image) {
  try {
    if (fs.existsSync(path.resolve(image))) {
      var size = imageSize(image);
        var greyX = colorize('x', grey);
        var greyImage = colorize(image, grey);
      (size.images || [size]).forEach(function (size) {
        var greyType = '';
        if (size.type) {
            greyType = colorize(' (' + size.type + ')', grey);
        }
        console.info(
            colorize(size.width, green) + greyX + colorize(size.height, green)
            + ' - ' + greyImage + greyType
        );
      });
    } else {
      console.error('file doesn\'t exist - ', image);
    }
  } catch (e) {
    // console.error(e.stack);
    console.error(colorize(e.message, red), '-', image);
  }
});
