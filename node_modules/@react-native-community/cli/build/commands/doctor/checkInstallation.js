"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doesSoftwareNeedToBeFixed = exports.isSoftwareNotInstalled = exports.PACKAGE_MANAGERS = void 0;

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
    return data;
  };

  return data;
}

function _commandExists() {
  const data = _interopRequireDefault(require("command-exists"));

  _commandExists = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let PACKAGE_MANAGERS;
exports.PACKAGE_MANAGERS = PACKAGE_MANAGERS;

(function (PACKAGE_MANAGERS) {
  PACKAGE_MANAGERS["YARN"] = "YARN";
  PACKAGE_MANAGERS["NPM"] = "NPM";
})(PACKAGE_MANAGERS || (exports.PACKAGE_MANAGERS = PACKAGE_MANAGERS = {}));

const isSoftwareNotInstalled = async command => {
  try {
    await (0, _commandExists().default)(command);
    return false;
  } catch (_ignored) {
    return true;
  }
};

exports.isSoftwareNotInstalled = isSoftwareNotInstalled;

const doesSoftwareNeedToBeFixed = ({
  version,
  versionRange
}) => {
  const coercedVersion = _semver().default.coerce(version);

  return version === 'Not Found' || coercedVersion === null || !_semver().default.satisfies(coercedVersion, versionRange);
};

exports.doesSoftwareNeedToBeFixed = doesSoftwareNeedToBeFixed;