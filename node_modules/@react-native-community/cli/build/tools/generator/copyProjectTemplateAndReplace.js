"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

var _copyAndReplace = _interopRequireDefault(require("../copyAndReplace"));

var _promptSync = _interopRequireDefault(require("./promptSync"));

var _walk = _interopRequireDefault(require("../walk"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
const prompt = (0, _promptSync.default)();

/**
 * Util for creating a new React Native project.
 * Copy the project from a template and use the correct project name in
 * all files.
 * @param srcPath e.g. '/Users/martin/AwesomeApp/node_modules/react-native/template'
 * @param destPath e.g. '/Users/martin/AwesomeApp'
 * @param newProjectName e.g. 'AwesomeApp'
 * @param options e.g. {
 *          upgrade: true,
 *          force: false,
 *          displayName: 'Hello World',
 *          ignorePaths: ['template/file/to/ignore.md'],
 *        }
 */
function copyProjectTemplateAndReplace(srcPath, destPath, newProjectName, options = {}) {
  if (!srcPath) {
    throw new Error('Need a path to copy from');
  }

  if (!destPath) {
    throw new Error('Need a path to copy to');
  }

  if (!newProjectName) {
    throw new Error('Need a project name');
  }

  (0, _walk.default)(srcPath).forEach(absoluteSrcFilePath => {
    // 'react-native upgrade'
    if (options.upgrade) {
      // Don't upgrade these files
      const fileName = _path().default.basename(absoluteSrcFilePath); // This also includes __tests__/index.*.js


      if (fileName === 'index.ios.js') {
        return;
      }

      if (fileName === 'index.android.js') {
        return;
      }

      if (fileName === 'index.js') {
        return;
      }

      if (fileName === 'App.js') {
        return;
      }
    }

    const relativeFilePath = translateFilePath(_path().default.relative(srcPath, absoluteSrcFilePath)).replace(/HelloWorld/g, newProjectName).replace(/helloworld/g, newProjectName.toLowerCase()); // Templates may contain files that we don't want to copy.
    // Examples:
    // - Dummy package.json file included in the template only for publishing to npm
    // - Docs specific to the template (.md files)

    if (options.ignorePaths) {
      if (!Array.isArray(options.ignorePaths)) {
        throw new Error('options.ignorePaths must be an array');
      }

      if (options.ignorePaths.some(ignorePath => ignorePath === relativeFilePath)) {
        // Skip copying this file
        return;
      }
    }

    let contentChangedCallback = null;

    if (options.upgrade && !options.force) {
      contentChangedCallback = (_destPath, contentChanged) => upgradeFileContentChangedCallback(absoluteSrcFilePath, relativeFilePath, contentChanged);
    }

    (0, _copyAndReplace.default)(absoluteSrcFilePath, _path().default.resolve(destPath, relativeFilePath), {
      'Hello App Display Name': options.displayName || newProjectName,
      HelloWorld: newProjectName,
      helloworld: newProjectName.toLowerCase()
    }, contentChangedCallback);
  });
}
/**
 * There are various files in the templates folder in the RN repo. We want
 * these to be ignored by tools when working with React Native itself.
 * Example: _babelrc file is ignored by Babel, renamed to .babelrc inside
 *          a real app folder.
 * This is especially important for .gitignore because npm has some special
 * behavior of automatically renaming .gitignore to .npmignore.
 */


function translateFilePath(filePath) {
  if (!filePath) {
    return filePath;
  }

  return filePath.replace('_BUCK', 'BUCK').replace('_gitignore', '.gitignore').replace('_gitattributes', '.gitattributes').replace('_babelrc', '.babelrc').replace('_eslintrc.js', '.eslintrc.js').replace('_flowconfig', '.flowconfig').replace('_buckconfig', '.buckconfig').replace('_prettierrc.js', '.prettierrc.js').replace('_watchmanconfig', '.watchmanconfig');
}

function upgradeFileContentChangedCallback(absoluteSrcFilePath, relativeDestPath, contentChanged) {
  if (contentChanged === 'new') {
    _cliTools().logger.info(`${_chalk().default.bold('new')} ${relativeDestPath}`);

    return 'overwrite';
  }

  if (contentChanged === 'changed') {
    _cliTools().logger.info(`${_chalk().default.bold(relativeDestPath)} ` + `has changed in the new version.\nDo you want to keep your ${relativeDestPath} or replace it with the ` + 'latest version?\nIf you ever made any changes ' + "to this file, you'll probably want to keep it.\n" + `You can see the new version here: ${absoluteSrcFilePath}\n` + `Do you want to replace ${relativeDestPath}? ` + 'Answer y to replace, n to keep your version: ');

    const answer = prompt();

    if (answer === 'y') {
      _cliTools().logger.info(`Replacing ${relativeDestPath}`);

      return 'overwrite';
    }

    _cliTools().logger.info(`Keeping your ${relativeDestPath}`);

    return 'keep';
  }

  if (contentChanged === 'identical') {
    return 'keep';
  }

  throw new Error(`Unknown file changed state: ${relativeDestPath}, ${contentChanged}`);
}

var _default = copyProjectTemplateAndReplace;
exports.default = _default;