"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processTemplateName = processTemplateName;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _url() {
  const data = require("url");

  _url = function () {
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

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FILE_PROTOCOL = /file:/;
const TARBALL = /\.tgz$/;
const VERSION_POSTFIX = /(.*)(-\d+\.\d+\.\d+)/;
const VERSIONED_PACKAGE = /(@?.+)(@)(.+)/;

function handleFileProtocol(filePath) {
  let uri = new (_url().URL)(filePath).pathname;

  if (process.platform === 'win32') {
    // On Windows, the pathname has an extra / at the start, so remove that
    uri = uri.substring(1);
  }

  if (!_fs().default.existsSync(uri)) {
    throw new (_cliTools().CLIError)(`Failed to retrieve template name. The specified template directory path "${uri}" does not exist or is invalid.`);
  }

  const packageJsonPath = _path().default.join(uri, 'package.json');

  let packageJson;

  try {
    packageJson = JSON.parse(_fs().default.readFileSync(packageJsonPath, {
      encoding: 'utf8'
    }));
  } catch (_unused) {
    throw new (_cliTools().CLIError)('Failed to retrieve template name. We expect the template directory to include "package.json" file, but it was not found.');
  }

  if (!packageJson || !packageJson.name) {
    throw new (_cliTools().CLIError)(`Failed to retrieve template name. We expect the "package.json" of the template to include the "name" property, but we found "${packageJson ? packageJson.name : 'undefined'}" which is invalid.`);
  }

  return {
    uri,
    name: packageJson.name
  };
}

function handleTarball(filePath) {
  if (!_fs().default.existsSync(filePath)) {
    throw new (_cliTools().CLIError)(`Failed to retrieve tarball name. The specified tarball path "${filePath}" does not exist or is invalid.`);
  }

  const nameWithVersion = _path().default.parse(_path().default.basename(filePath)).name;

  const tarballVersionMatch = nameWithVersion.match(VERSION_POSTFIX);

  if (!tarballVersionMatch) {
    throw new (_cliTools().CLIError)(`Failed to retrieve tarball name. We expect the tarball to include package name and version, e.g.: "template-name-1.2.3-rc.0.tgz", but received: "${nameWithVersion}".`);
  }

  return {
    uri: filePath,
    name: tarballVersionMatch[1]
  };
}

function handleVersionedPackage(versionedPackage) {
  const versionedPackageMatch = versionedPackage.match(VERSIONED_PACKAGE);

  if (!versionedPackageMatch) {
    throw new (_cliTools().CLIError)(`Failed to retrieve package name. We expect the package to include name and version, e.g.: "template-name@1.2.3-rc.0", but received: "${versionedPackage}".`);
  }

  return {
    uri: versionedPackage,
    name: versionedPackageMatch[1]
  };
}

function processTemplateName(templateName) {
  if (templateName.match(TARBALL)) {
    return handleTarball(templateName);
  }

  if (templateName.match(FILE_PROTOCOL)) {
    return handleFileProtocol(templateName);
  }

  if (templateName.match(VERSIONED_PACKAGE)) {
    return handleVersionedPackage(templateName);
  }

  return {
    uri: templateName,
    name: templateName
  };
}