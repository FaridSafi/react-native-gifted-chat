/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*eslint-disable max-len*/
'use strict';

var fs = require('fs');
var assert = require('assert');
var exec = require('child_process').exec;
var semver = require('semver');
var f = require('util').format;

// Make sure we have a package.json to parse. Take it as the first argument
// (actually the 3rd for argv).
assert(
  process.argv.length >= 3,
  'Expected to receive a package.json file argument to parse'
);

var packageFilePath = process.argv[2];
var packageData;
try {
  var packageFile = fs.readFileSync(packageFilePath, {encoding: 'utf-8'});
  packageData = JSON.parse(packageFile);
} catch (e) {
  assert(
    false,
    f('Expected to be able to parse %s as JSON but we got this error instead: %s', packageFilePath, e)
  );
}

var devEngines = packageData.devEngines;

if (devEngines.node !== undefined) {
  // First check that devEngines are valid semver
  assert(
    semver.validRange(devEngines.node),
    f('devEngines.node (%s) is not a valid semver range', devEngines.node)
  );
  // Then actually check that our version satisfies
  var nodeVersion = process.versions.node;
  assert(
    semver.satisfies(nodeVersion, devEngines.node),
    f('Current node version is not supported for development, expected "%s" to satisfy "%s".', nodeVersion, devEngines.node)
  );
}

if (devEngines.npm !== undefined) {
  // First check that devEngines are valid semver
  assert(
    semver.validRange(devEngines.npm),
    f('devEngines.npm (%s) is not a valid semver range', devEngines.npm)
  );

  // Then actually check that our version satisfies
  exec('npm --version', function(err, stdout, stderr) {
    assert(err === null, f('Failed to get npm version... %s'), stderr);

    var npmVersion = stdout.trim();
    assert(
      semver.satisfies(npmVersion, devEngines.npm),
      f('Current npm version is not supported for development, expected "%s" to satisfy "%s".', npmVersion, devEngines.npm)
    );
  });
}
