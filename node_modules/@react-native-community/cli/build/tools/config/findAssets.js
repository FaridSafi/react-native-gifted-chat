"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findAssets;

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

const findAssetsInFolder = folder => {
  const assets = _glob().default.sync(_path().default.join(folder, '**'), {
    nodir: true
  });

  if (process.platform === 'win32') {
    return assets.map(asset => asset.split('/').join('\\'));
  }

  return assets;
};
/**
 * Given an array of assets folders, e.g. ['Fonts', 'Images'],
 * it globs in them to find all files that can be copied.
 *
 * It returns an array of absolute paths to files found.
 */


function findAssets(folder, assets) {
  return (assets || []).map(asset => _path().default.join(folder, asset)).reduce((acc, assetPath) => acc.concat(findAssetsInFolder(assetPath)), []);
}