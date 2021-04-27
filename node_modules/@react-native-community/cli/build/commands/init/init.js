"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
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

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
    return data;
  };

  return data;
}

function _inquirer() {
  const data = _interopRequireDefault(require("inquirer"));

  _inquirer = function () {
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

var _validate = require("./validate");

var _DirectoryAlreadyExistsError = _interopRequireDefault(require("./errors/DirectoryAlreadyExistsError"));

var _printRunInstructions = _interopRequireDefault(require("./printRunInstructions"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _template = require("./template");

var _editTemplate = require("./editTemplate");

var PackageManager = _interopRequireWildcard(require("../../tools/packageManager"));

var _installPods = _interopRequireDefault(require("../../tools/installPods"));

var _templateName = require("./templateName");

var _banner = _interopRequireDefault(require("./banner"));

var _loader = require("../../tools/loader");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore untyped
const DEFAULT_VERSION = 'latest';

function doesDirectoryExist(dir) {
  return _fsExtra().default.existsSync(dir);
}

async function setProjectDirectory(directory) {
  const directoryExists = doesDirectoryExist(directory);

  if (directoryExists) {
    const {
      shouldReplaceprojectDirectory
    } = await _inquirer().default.prompt([{
      type: 'confirm',
      name: 'shouldReplaceprojectDirectory',
      message: `Directory "${directory}" already exists, do you want to replace it?`,
      default: false
    }]);

    if (!shouldReplaceprojectDirectory) {
      throw new _DirectoryAlreadyExistsError.default(directory);
    }

    _fsExtra().default.emptyDirSync(directory);
  }

  try {
    _mkdirp().default.sync(directory);

    process.chdir(directory);
  } catch (error) {
    throw new (_cliTools().CLIError)(`Error occurred while trying to ${directoryExists ? 'replace' : 'create'} project directory.`, error);
  }

  return process.cwd();
}

function adjustNameIfUrl(name, cwd) {
  // We use package manager to infer the name of the template module for us.
  // That's why we get it from temporary package.json, where the name is the
  // first and only dependency (hence 0).
  if (name.match(/https?:/)) {
    name = Object.keys(JSON.parse(_fsExtra().default.readFileSync(_path().default.join(cwd, './package.json'), 'utf8')).dependencies)[0];
  }

  return name;
}

async function createFromTemplate({
  projectName,
  templateName,
  npm,
  directory,
  projectTitle
}) {
  _cliTools().logger.debug('Initializing new project');

  _cliTools().logger.log(_banner.default);

  const projectDirectory = await setProjectDirectory(directory);
  const Loader = (0, _loader.getLoader)();
  const loader = new Loader({
    text: 'Downloading template'
  });

  const templateSourceDir = _fsExtra().default.mkdtempSync(_path().default.join(_os().default.tmpdir(), 'rncli-init-template-'));

  try {
    loader.start();
    let {
      uri,
      name
    } = await (0, _templateName.processTemplateName)(templateName);
    await (0, _template.installTemplatePackage)(uri, templateSourceDir, npm);
    loader.succeed();
    loader.start('Copying template');
    name = adjustNameIfUrl(name, templateSourceDir);
    const templateConfig = (0, _template.getTemplateConfig)(name, templateSourceDir);
    await (0, _template.copyTemplate)(name, templateConfig.templateDir, templateSourceDir);
    loader.succeed();
    loader.start('Processing template');
    (0, _editTemplate.changePlaceholderInTemplate)({
      projectName,
      projectTitle,
      placeholderName: templateConfig.placeholderName,
      placeholderTitle: templateConfig.titlePlaceholder
    });
    loader.succeed();
    const {
      postInitScript
    } = templateConfig;

    if (postInitScript) {
      // Leaving trailing space because there may be stdout from the script
      loader.start('Executing post init script ');
      await (0, _template.executePostInitScript)(name, postInitScript, templateSourceDir);
      loader.succeed();
    }

    await installDependencies({
      projectName,
      npm,
      loader,
      root: projectDirectory
    });
  } catch (e) {
    loader.fail();
    throw new Error(e);
  } finally {
    _fsExtra().default.removeSync(templateSourceDir);
  }
}

async function installDependencies({
  projectName,
  npm,
  loader,
  root
}) {
  loader.start('Installing dependencies');
  await PackageManager.installAll({
    preferYarn: !npm,
    silent: true,
    root
  });

  if (process.platform === 'darwin') {
    await (0, _installPods.default)({
      projectName,
      loader,
      shouldUpdatePods: false
    });
  }

  loader.succeed();
}

async function createProject(projectName, directory, version, options) {
  const templateName = options.template || `react-native@${version}`;

  if (version !== DEFAULT_VERSION && _semver().default.valid(version) && !_semver().default.gte(version, '0.60.0-rc.0')) {
    throw new Error('Cannot use React Native CLI to initialize project with version lower than 0.60.0.');
  }

  return createFromTemplate({
    projectName,
    templateName,
    npm: options.npm,
    directory,
    projectTitle: options.title
  });
}

var initialize = async function initialize([projectName], options) {
  const root = process.cwd();
  (0, _validate.validateProjectName)(projectName);
  /**
   * Commander is stripping `version` from options automatically.
   * We have to use `minimist` to take that directly from `process.argv`
   */

  const version = (0, _minimist().default)(process.argv).version || DEFAULT_VERSION;

  const directoryName = _path().default.relative(root, options.directory || projectName);

  try {
    await createProject(projectName, directoryName, version, options);

    const projectFolder = _path().default.join(root, directoryName);

    (0, _printRunInstructions.default)(projectFolder, projectName);
  } catch (e) {
    _cliTools().logger.error(e.message);
  }
};

exports.default = initialize;