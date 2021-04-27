"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _minimist() {
  const data = _interopRequireDefault(require("minimist"));

  _minimist = function () {
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

function _process() {
  const data = _interopRequireDefault(require("process"));

  _process = function () {
    return data;
  };

  return data;
}

var _printRunInstructions = _interopRequireDefault(require("./printRunInstructions"));

var _templates = require("../../tools/generator/templates");

var PackageManager = _interopRequireWildcard(require("../../tools/packageManager"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _installPods = _interopRequireDefault(require("../../tools/installPods"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Creates the template for a React Native project given the provided
 * parameters:
 * @param projectDir Templates will be copied here.
 * @param argsOrName Project name or full list of custom arguments
 *                   for the generator.
 * @param options Command line options passed from the react-native-cli directly.
 *                E.g. `{ version: '0.43.0', template: 'navigation' }`
 */
async function initCompat(projectDir, argsOrName) {
  const args = Array.isArray(argsOrName) ? argsOrName // argsOrName was e.g. ['AwesomeApp', '--verbose']
  : [argsOrName].concat(_process().default.argv.slice(4)); // argsOrName was e.g. 'AwesomeApp'
  // args array is e.g. ['AwesomeApp', '--verbose', '--template', 'navigation']

  if (!args || args.length === 0) {
    _cliTools().logger.error('react-native init requires a project name.');

    return;
  }

  const newProjectName = args[0];
  const options = (0, _minimist().default)(args);

  _cliTools().logger.info(`Setting up new React Native app in ${projectDir}`);

  await generateProject(projectDir, newProjectName, options);
}
/**
 * Generates a new React Native project based on the template.
 * @param Absolute path at which the project folder should be created.
 * @param options Command line arguments parsed by minimist.
 */


async function generateProject(destinationRoot, newProjectName, options) {
  const pkgJson = require('react-native/package.json');

  const reactVersion = pkgJson.peerDependencies.react;
  await (0, _templates.createProjectFromTemplate)(destinationRoot, newProjectName, options.template);

  _cliTools().logger.info('Adding required dependencies');

  await PackageManager.install([`react@${reactVersion}`], {
    root: destinationRoot
  });

  _cliTools().logger.info('Adding required dev dependencies');

  await PackageManager.installDev(['@babel/core', '@babel/runtime', '@react-native-community/eslint-config', 'eslint', 'jest', 'babel-jest', 'metro-react-native-babel-preset', `react-test-renderer@${reactVersion}`], {
    root: destinationRoot
  });
  addJestToPackageJson(destinationRoot);

  if (_process().default.platform === 'darwin') {
    _cliTools().logger.info('Installing required CocoaPods dependencies');

    await (0, _installPods.default)({
      projectName: newProjectName
    });
  }

  (0, _printRunInstructions.default)(destinationRoot, newProjectName);
}
/**
 * Add Jest-related stuff to package.json, which was created by the react-native-cli.
 */


function addJestToPackageJson(destinationRoot) {
  const packageJSONPath = _path().default.join(destinationRoot, 'package.json');

  const packageJSON = JSON.parse(_fs().default.readFileSync(packageJSONPath).toString());
  packageJSON.scripts.test = 'jest';
  packageJSON.scripts.lint = 'eslint .';
  packageJSON.jest = {
    preset: 'react-native'
  };

  _fs().default.writeFileSync(packageJSONPath, `${JSON.stringify(packageJSON, null, 2)}\n`);
}

var _default = initCompat;
exports.default = _default;