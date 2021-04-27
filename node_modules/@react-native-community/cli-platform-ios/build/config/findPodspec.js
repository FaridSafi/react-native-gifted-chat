"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findPodspec;

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findPodspec(folder) {
  const podspecs = _glob().default.sync('*.podspec', {
    cwd: folder
  });

  if (podspecs.length === 0) {
    return null;
  }

  const packagePodspec = _path().default.basename(folder) + '.podspec';
  const podspecFile = podspecs.includes(packagePodspec) ? packagePodspec : podspecs[0];
  return _path().default.join(folder, podspecFile);
}