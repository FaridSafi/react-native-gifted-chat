'use strict';

// tests are adapted from https://github.com/TooTallNate/node-plist

const assert = require('assert');
const path = require('path');
const bplist = require('../');

describe('bplist-parser', function () {
  it('iTunes Small', async function () {
    const file = path.join(__dirname, "iTunes-small.bplist");
    const startTime1 = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime1) + 'ms');
    assert.equal(dict['Application Version'], "9.0.3");
    assert.equal(dict['Library Persistent ID'], "6F81D37F95101437");
  });

  it('sample1', async function () {
    const file = path.join(__dirname, "sample1.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['CFBundleIdentifier'], 'com.apple.dictionary.MySample');
  });

  it('sample2', async function () {
    const file = path.join(__dirname, "sample2.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['PopupMenu'][2]['Key'], "\n        #import <Cocoa/Cocoa.h>\n\n#import <MacRuby/MacRuby.h>\n\nint main(int argc, char *argv[])\n{\n  return macruby_main(\"rb_main.rb\", argc, argv);\n}\n");
  });

  it('airplay', async function () {
    const file = path.join(__dirname, "airplay.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['duration'], 5555.0495000000001);
    assert.equal(dict['position'], 4.6269989039999997);
  });

  it('utf16', async function () {
    const file = path.join(__dirname, "utf16.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['CFBundleName'], 'sellStuff');
    assert.equal(dict['CFBundleShortVersionString'], '2.6.1');
    assert.equal(dict['NSHumanReadableCopyright'], '©2008-2012, sellStuff, Inc.');
  });

  it('utf16chinese', async function () {
    const file = path.join(__dirname, "utf16_chinese.plist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['CFBundleName'], '天翼阅读');
    assert.equal(dict['CFBundleDisplayName'], '天翼阅读');
  });

  it('uid', async function () {
    const file = path.join(__dirname, "uid.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.deepEqual(dict['$objects'][1]['NS.keys'], [{UID:2}, {UID:3}, {UID:4}]);
    assert.deepEqual(dict['$objects'][1]['NS.objects'], [{UID: 5}, {UID:6}, {UID:7}]);
    assert.deepEqual(dict['$top']['root'], {UID:1});
  });

  it('int64', async function () {
    const file = path.join(__dirname, "int64.bplist");
    const startTime = new Date();

    const [dict] = await bplist.parseFile(file);
    const endTime = new Date();
    console.log('Parsed "' + file + '" in ' + (endTime - startTime) + 'ms');

    assert.equal(dict['zero'], '0');
    assert.equal(dict['int64item'], '12345678901234567890');
  });
});
