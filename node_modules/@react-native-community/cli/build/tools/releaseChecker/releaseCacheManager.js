"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
    return data;
  };

  return data;
}

function _mkdirp() {
  const data = _interopRequireDefault(require("mkdirp"));

  _mkdirp = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCache(name) {
  try {
    const cacheRaw = _fs().default.readFileSync(_path().default.resolve(getCacheRootPath(), name), 'utf8');

    const cache = JSON.parse(cacheRaw);
    return cache;
  } catch (e) {
    if (e.code === 'ENOENT') {
      // Create cache file since it doesn't exist.
      saveCache(name, {});
    }

    _cliTools().logger.debug('No release cache found');

    return undefined;
  }
}

function saveCache(name, cache) {
  _fs().default.writeFileSync(_path().default.resolve(getCacheRootPath(), name), JSON.stringify(cache, null, 2));
}
/**
 * Returns the path string of `$HOME/.react-native-cli`.
 *
 * In case it doesn't exist, it will be created.
 */


function getCacheRootPath() {
  const cachePath = _path().default.resolve(_os().default.homedir(), '.react-native-cli', 'cache');

  if (!_fs().default.existsSync(cachePath)) {
    _mkdirp().default.sync(cachePath);
  }

  return cachePath;
}

function get(name, key) {
  const cache = loadCache(name);

  if (cache) {
    return cache[key];
  }

  return undefined;
}

function set(name, key, value) {
  const cache = loadCache(name);

  if (cache) {
    cache[key] = value;
    saveCache(name, cache);
  }
}

var _default = {
  get,
  set
};
exports.default = _default;