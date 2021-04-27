"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installTemplatePackage = installTemplatePackage;
exports.getTemplateConfig = getTemplateConfig;
exports.copyTemplate = copyTemplate;
exports.executePostInitScript = executePostInitScript;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
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

var PackageManager = _interopRequireWildcard(require("../../tools/packageManager"));

var _copyFiles = _interopRequireDefault(require("../../tools/copyFiles"));

var _replacePathSepForRegex = _interopRequireDefault(require("../../tools/replacePathSepForRegex"));

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installTemplatePackage(templateName, root, npm) {
  _cliTools().logger.debug(`Installing template from ${templateName}`);

  return PackageManager.install([templateName], {
    preferYarn: !npm,
    silent: true,
    root
  });
}

function getTemplateConfig(templateName, templateSourceDir) {
  const configFilePath = _path().default.resolve(templateSourceDir, 'node_modules', templateName, 'template.config.js');

  _cliTools().logger.debug(`Getting config from ${configFilePath}`);

  if (!_fs().default.existsSync(configFilePath)) {
    throw new (_cliTools().CLIError)(`Couldn't find the "${configFilePath} file inside "${templateName}" template. Please make sure the template is valid.
      Read more: ${_chalk().default.underline.dim('https://github.com/react-native-community/cli/blob/master/docs/init.md#creating-custom-template')}`);
  }

  return require(configFilePath);
}

async function copyTemplate(templateName, templateDir, templateSourceDir) {
  const templatePath = _path().default.resolve(templateSourceDir, 'node_modules', templateName, templateDir);

  _cliTools().logger.debug(`Copying template from ${templatePath}`);

  let regexStr = _path().default.resolve(templatePath, 'node_modules');

  await (0, _copyFiles.default)(templatePath, process.cwd(), {
    exclude: [new RegExp((0, _replacePathSepForRegex.default)(regexStr))]
  });
}

function executePostInitScript(templateName, postInitScript, templateSourceDir) {
  const scriptPath = _path().default.resolve(templateSourceDir, 'node_modules', templateName, postInitScript);

  _cliTools().logger.debug(`Executing post init script located ${scriptPath}`);

  return (0, _execa().default)(scriptPath, {
    stdio: 'inherit'
  });
}