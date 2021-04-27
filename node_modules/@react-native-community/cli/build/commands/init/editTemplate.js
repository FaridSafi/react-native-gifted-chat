"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePlaceholderInTemplate = changePlaceholderInTemplate;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _walk = _interopRequireDefault(require("../../tools/walk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  TODO: This is a default placeholder for title in react-native template.
  We should get rid of this once custom templates adapt `placeholderTitle` in their configurations.
*/
const DEFAULT_TITLE_PLACEHOLDER = 'Hello App Display Name';

function replaceNameInUTF8File(filePath, projectName, templateName) {
  _cliTools().logger.debug(`Replacing in ${filePath}`);

  const fileContent = _fs().default.readFileSync(filePath, 'utf8');

  const replacedFileContent = fileContent.replace(new RegExp(templateName, 'g'), projectName).replace(new RegExp(templateName.toLowerCase(), 'g'), projectName.toLowerCase());

  if (fileContent !== replacedFileContent) {
    _fs().default.writeFileSync(filePath, replacedFileContent, 'utf8');
  }
}

function renameFile(filePath, oldName, newName) {
  const newFileName = _path().default.join(_path().default.dirname(filePath), _path().default.basename(filePath).replace(new RegExp(oldName, 'g'), newName));

  _cliTools().logger.debug(`Renaming ${filePath} -> file:${newFileName}`);

  _fs().default.renameSync(filePath, newFileName);
}

function shouldRenameFile(filePath, nameToReplace) {
  return _path().default.basename(filePath).includes(nameToReplace);
}

function shouldIgnoreFile(filePath) {
  return filePath.match(/node_modules|yarn.lock|package-lock.json/g);
}

const UNDERSCORED_DOTFILES = ['buckconfig', 'eslintrc.js', 'flowconfig', 'gitattributes', 'gitignore', 'prettierrc.js', 'watchmanconfig'];

function processDotfiles(filePath) {
  const dotfile = UNDERSCORED_DOTFILES.find(e => filePath.includes(`_${e}`));

  if (dotfile === undefined) {
    return;
  }

  renameFile(filePath, `_${dotfile}`, `.${dotfile}`);
}

function changePlaceholderInTemplate({
  projectName,
  placeholderName,
  placeholderTitle = DEFAULT_TITLE_PLACEHOLDER,
  projectTitle = projectName
}) {
  _cliTools().logger.debug(`Changing ${placeholderName} for ${projectName} in template`);

  (0, _walk.default)(process.cwd()).reverse().forEach(filePath => {
    if (shouldIgnoreFile(filePath)) {
      return;
    }

    if (!_fs().default.statSync(filePath).isDirectory()) {
      replaceNameInUTF8File(filePath, projectName, placeholderName);
      replaceNameInUTF8File(filePath, projectTitle, placeholderTitle);
    }

    if (shouldRenameFile(filePath, placeholderName)) {
      renameFile(filePath, placeholderName, projectName);
    }

    if (shouldRenameFile(filePath, placeholderName.toLowerCase())) {
      renameFile(filePath, placeholderName.toLowerCase(), projectName.toLowerCase());
    }

    processDotfiles(filePath);
  });
}