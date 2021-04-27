'use strict';

var fs = require('fs');
var path = require('path');
var nodeunit = require('nodeunit');
var bplistParser = require('bplist-parser');
var bplistCreator = require('../');

module.exports = {
//  'iTunes Small': function(test) {
//    var file = path.join(__dirname, "iTunes-small.bplist");
//    testFile(test, file);
//  },

  'sample1': function(test) {
    var file = path.join(__dirname, "sample1.bplist");
    testFile(test, file);
  },

  'sample2': function(test) {
    var file = path.join(__dirname, "sample2.bplist");
    testFile(test, file);
  },

  'binary data': function(test) {
    var file = path.join(__dirname, "binaryData.bplist");
    testFile(test, file);
  },

  'airplay': function(test) {
    var file = path.join(__dirname, "airplay.bplist");
    testFile(test, file);
  },

//  'utf16': function(test) {
//    var file = path.join(__dirname, "utf16.bplist");
//    testFile(test, file);
//  },

//  'uid': function(test) {
//    var file = path.join(__dirname, "uid.bplist");
//    testFile(test, file);
//  }
};

function testFile(test, file) {
  fs.readFile(file, function(err, fileData) {
    if (err) {
      return test.done(err);
    }

    bplistParser.parseFile(file, function(err, dicts) {
      if (err) {
        return test.done(err);
      }

      // airplay overrides
      if (dicts && dicts[0] && dicts[0].loadedTimeRanges && dicts[0].loadedTimeRanges[0] && dicts[0].loadedTimeRanges[0].hasOwnProperty('start')) {
        dicts[0].loadedTimeRanges[0].start = {
          bplistOverride: true,
          type: 'double',
          value: dicts[0].loadedTimeRanges[0].start
        };
      }
      if (dicts && dicts[0] && dicts[0].loadedTimeRanges && dicts[0].seekableTimeRanges[0] && dicts[0].seekableTimeRanges[0].hasOwnProperty('start')) {
        dicts[0].seekableTimeRanges[0].start = {
          bplistOverride: true,
          type: 'double',
          value: dicts[0].seekableTimeRanges[0].start
        };
      }
      if (dicts && dicts[0] && dicts[0].hasOwnProperty('rate')) {
        dicts[0].rate = {
          bplistOverride: true,
          type: 'double',
          value: dicts[0].rate
        };
      }

      // utf16
      if (dicts && dicts[0] && dicts[0].hasOwnProperty('NSHumanReadableCopyright')) {
        dicts[0].NSHumanReadableCopyright = {
          bplistOverride: true,
          type: 'string-utf16',
          value: dicts[0].NSHumanReadableCopyright
        };
      }
      if (dicts && dicts[0] && dicts[0].hasOwnProperty('CFBundleExecutable')) {
        dicts[0].CFBundleExecutable = {
          bplistOverride: true,
          type: 'string',
          value: dicts[0].CFBundleExecutable
        };
      }
      if (dicts && dicts[0] && dicts[0].CFBundleURLTypes && dicts[0].CFBundleURLTypes[0] && dicts[0].CFBundleURLTypes[0].hasOwnProperty('CFBundleURLSchemes')) {
        dicts[0].CFBundleURLTypes[0].CFBundleURLSchemes[0] = {
          bplistOverride: true,
          type: 'string',
          value: dicts[0].CFBundleURLTypes[0].CFBundleURLSchemes[0]
        };
      }
      if (dicts && dicts[0] && dicts[0].hasOwnProperty('CFBundleDisplayName')) {
        dicts[0].CFBundleDisplayName = {
          bplistOverride: true,
          type: 'string',
          value: dicts[0].CFBundleDisplayName
        };
      }
      if (dicts && dicts[0] && dicts[0].hasOwnProperty('DTPlatformBuild')) {
        dicts[0].DTPlatformBuild = {
          bplistOverride: true,
          type: 'string',
          value: dicts[0].DTPlatformBuild
        };
      }

      var buf = bplistCreator(dicts);
      compareBuffers(test, buf, fileData);
      return test.done();
    });
  });
}

function compareBuffers(test, buf1, buf2) {
  if (buf1.length !== buf2.length) {
    printBuffers(buf1, buf2);
    return test.fail("buffer size mismatch. found: " + buf1.length + ", expected: " + buf2.length + ".");
  }
  for (var i = 0; i < buf1.length; i++) {
    if (buf1[i] !== buf2[i]) {
      printBuffers(buf1, buf2);
      return test.fail("buffer mismatch at offset 0x" + i.toString(16) + ". found: 0x" + buf1[i].toString(16) + ", expected: 0x" + buf2[i].toString(16) + ".");
    }
  }
}

function printBuffers(buf1, buf2) {
  var i, t;
  for (var lineOffset = 0; lineOffset < buf1.length || lineOffset < buf2.length; lineOffset += 16) {
    var line = '';

    t = ('000000000' + lineOffset.toString(16));
    line += t.substr(t.length - 8) + ': ';

    for (i = 0; i < 16; i++) {
      if (i == 8) {
        line += ' ';
      }
      if (lineOffset + i < buf1.length) {
        t = ('00' + buf1[lineOffset + i].toString(16));
        line += t.substr(t.length - 2) + ' ';
      } else {
        line += '   ';
      }
    }
    line += ' ';
    for (i = 0; i < 16; i++) {
      if (lineOffset + i < buf1.length) {
        t = String.fromCharCode(buf1[lineOffset + i]);
        if (t < ' ' || t > '~') {
          t = '.';
        }
        line += t;
      } else {
        line += ' ';
      }
    }

    line += ' - ';

    for (i = 0; i < 16; i++) {
      if (i == 8) {
        line += ' ';
      }
      if (lineOffset + i < buf2.length) {
        t = ('00' + buf2[lineOffset + i].toString(16));
        line += t.substr(t.length - 2) + ' ';
      } else {
        line += '   ';
      }
    }
    line += ' ';
    for (i = 0; i < 16; i++) {
      if (lineOffset + i < buf2.length) {
        t = String.fromCharCode(buf2[lineOffset + i]);
        if (t < ' ' || t > '~') {
          t = '.';
        }
        line += t;
      } else {
        line += ' ';
      }
    }

    console.log(line);
  }
}
