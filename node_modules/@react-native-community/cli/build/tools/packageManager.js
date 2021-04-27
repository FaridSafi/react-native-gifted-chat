"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.installDev = installDev;
exports.uninstall = uninstall;
exports.installAll = installAll;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
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

var _yarn = require("./yarn");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const packageManagers = {
  yarn: {
    install: ['add'],
    installDev: ['add', '-D'],
    uninstall: ['remove'],
    installAll: ['install']
  },
  npm: {
    install: ['install', '--save', '--save-exact'],
    installDev: ['install', '--save-dev', '--save-exact'],
    uninstall: ['uninstall', '--save'],
    installAll: ['install']
  }
};

function configurePackageManager(packageNames, action, options) {
  const pm = shouldUseYarn(options) ? 'yarn' : 'npm';
  const [executable, ...flags] = packageManagers[pm][action];
  const args = [executable, ...flags, ...packageNames];
  return executeCommand(pm, args, options);
}

function executeCommand(command, args, options) {
  return (0, _execa().default)(command, args, {
    stdio: options.silent && !_cliTools().logger.isVerbose() ? 'pipe' : 'inherit',
    cwd: options.root
  });
}

function shouldUseYarn(options) {
  if (options && options.preferYarn !== undefined) {
    return options.preferYarn && (0, _yarn.getYarnVersionIfAvailable)();
  }

  return (0, _yarn.isProjectUsingYarn)(options.root) && (0, _yarn.getYarnVersionIfAvailable)();
}

function install(packageNames, options) {
  return configurePackageManager(packageNames, 'install', options);
}

function installDev(packageNames, options) {
  return configurePackageManager(packageNames, 'installDev', options);
}

function uninstall(packageNames, options) {
  return configurePackageManager(packageNames, 'uninstall', options);
}

function installAll(options) {
  return configurePackageManager([], 'installAll', options);
}