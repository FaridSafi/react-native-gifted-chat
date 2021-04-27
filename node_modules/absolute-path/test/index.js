var assert = require('assert');
var isAbsolute = require('../');

isAbsolute.setPlatform('win32');

assert.equal(isAbsolute('//server/file'), true);
assert.equal(isAbsolute('\\\\server\\file'), true);
assert.equal(isAbsolute('C:/Users/'), true);
assert.equal(isAbsolute('C:\\Users\\'), true);
assert.equal(isAbsolute('C:cwd/another'), false);
assert.equal(isAbsolute('C:cwd\\another'), false);
assert.equal(isAbsolute('directory/directory'), false);
assert.equal(isAbsolute('directory\\directory'), false);

isAbsolute.setPlatform('');

assert.equal(isAbsolute('/home/foo'), true);
assert.equal(isAbsolute('/home/foo/..'), true);
assert.equal(isAbsolute('bar/'), false);
assert.equal(isAbsolute('./baz'), false);