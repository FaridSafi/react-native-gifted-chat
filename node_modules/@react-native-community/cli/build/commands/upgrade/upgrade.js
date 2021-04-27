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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

var PackageManager = _interopRequireWildcard(require("../../tools/packageManager"));

var _installPods = _interopRequireDefault(require("../../tools/installPods"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://react-native-community.github.io/upgrade-helper/?from=0.59.10&to=0.60.0-rc.3
const webDiffUrl = 'https://react-native-community.github.io/upgrade-helper';
const rawDiffUrl = 'https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs';

const isConnected = output => {
  // there is no reliable way of checking for internet connectivity, so we should just
  // read the output from npm (to check for connectivity errors) which is faster and relatively more reliable.
  return !output.includes('the host is inaccessible');
};

const checkForErrors = output => {
  if (!output) {
    return;
  }

  if (!isConnected(output)) {
    throw new (_cliTools().CLIError)('Upgrade failed. You do not seem to have an internet connection.');
  }

  if (output.includes('npm ERR')) {
    throw new (_cliTools().CLIError)(`Upgrade failed with the following errors:\n${output}`);
  }

  if (output.includes('npm WARN')) {
    _cliTools().logger.warn(output);
  }
};

const getLatestRNVersion = async () => {
  _cliTools().logger.info('No version passed. Fetching latest...');

  const {
    stdout,
    stderr
  } = await (0, _execa().default)('npm', ['info', 'react-native', 'version']);
  checkForErrors(stderr);
  return stdout;
};

const getRNPeerDeps = async version => {
  const {
    stdout,
    stderr
  } = await (0, _execa().default)('npm', ['info', `react-native@${version}`, 'peerDependencies', '--json']);
  checkForErrors(stderr);
  return JSON.parse(stdout);
};

const getPatch = async (currentVersion, newVersion, config) => {
  let patch;

  _cliTools().logger.info(`Fetching diff between v${currentVersion} and v${newVersion}...`);

  try {
    const {
      data
    } = await (0, _cliTools().fetch)(`${rawDiffUrl}/${currentVersion}..${newVersion}.diff`);
    patch = data;
  } catch (error) {
    _cliTools().logger.error(error.message);

    _cliTools().logger.error(`Failed to fetch diff for react-native@${newVersion}. Maybe it's not released yet?`);

    _cliTools().logger.info(`For available releases to diff see: ${_chalk().default.underline.dim('https://github.com/react-native-community/rn-diff-purge#diff-table-full-table-here')}`);

    return null;
  }

  let patchWithRenamedProjects = patch;
  Object.keys(config.project).forEach(platform => {
    if (!config.project[platform]) {
      return;
    }

    if (platform === 'ios') {
      patchWithRenamedProjects = patchWithRenamedProjects.replace(new RegExp('RnDiffApp', 'g'), config.project[platform].projectName.replace('.xcodeproj', ''));
    } else if (platform === 'android') {
      patchWithRenamedProjects = patchWithRenamedProjects.replace(new RegExp('com\\.rndiffapp', 'g'), config.project[platform].packageName).replace(new RegExp('com\\.rndiffapp'.split('.').join('/'), 'g'), config.project[platform].packageName.split('.').join('/'));
    } else {
      _cliTools().logger.warn(`Unsupported platform: "${platform}". \`upgrade\` only supports iOS and Android.`);
    }
  });
  return patchWithRenamedProjects;
};

const getVersionToUpgradeTo = async (argv, currentVersion, projectDir) => {
  const argVersion = argv[0];

  const semverCoercedVersion = _semver().default.coerce(argVersion);

  const newVersion = argVersion ? _semver().default.valid(argVersion) || (semverCoercedVersion ? semverCoercedVersion.version : null) : await getLatestRNVersion();

  if (!newVersion) {
    _cliTools().logger.error(`Provided version "${argv[0]}" is not allowed. Please pass a valid semver version`);

    return null;
  }

  if (_semver().default.gt(currentVersion, newVersion)) {
    _cliTools().logger.error(`Trying to upgrade from newer version "${currentVersion}" to older "${newVersion}"`);

    return null;
  }

  if (_semver().default.eq(currentVersion, newVersion)) {
    const {
      dependencies: {
        'react-native': version
      }
    } = require(_path().default.join(projectDir, 'package.json'));

    if (_semver().default.satisfies(newVersion, version)) {
      _cliTools().logger.warn(`Specified version "${newVersion}" is already installed in node_modules and it satisfies "${version}" semver range. No need to upgrade`);

      return null;
    }

    _cliTools().logger.error(`Dependency mismatch. Specified version "${newVersion}" is already installed in node_modules and it doesn't satisfy "${version}" semver range of your "react-native" dependency. Please re-install your dependencies`);

    return null;
  }

  return newVersion;
};

const installDeps = async (root, newVersion) => {
  _cliTools().logger.info(`Installing "react-native@${newVersion}" and its peer dependencies...`);

  const peerDeps = await getRNPeerDeps(newVersion);
  const deps = [`react-native@${newVersion}`, ...Object.keys(peerDeps).map(module => `${module}@${peerDeps[module]}`)];
  await PackageManager.install(deps, {
    silent: true,
    root
  });
  await (0, _execa().default)('git', ['add', 'package.json']);

  try {
    await (0, _execa().default)('git', ['add', 'yarn.lock']);
  } catch (error) {// ignore
  }

  try {
    await (0, _execa().default)('git', ['add', 'package-lock.json']);
  } catch (error) {// ignore
  }
};

const installCocoaPodsDeps = async (projectDir, thirdPartyIOSDeps) => {
  if (process.platform === 'darwin') {
    try {
      _cliTools().logger.info(`Installing CocoaPods dependencies ${_chalk().default.dim('(this may take a few minutes)')}`);

      await (0, _installPods.default)({
        projectName: projectDir.split('/').pop() || '',
        shouldUpdatePods: thirdPartyIOSDeps.length > 0
      });
    } catch (error) {
      if (error.stderr) {
        _cliTools().logger.debug(`"pod install" or "pod repo update" failed. Error output:\n${error.stderr}`);
      }

      _cliTools().logger.error('Installation of CocoaPods dependencies failed. Try to install them manually by running "pod install" in "ios" directory after finishing upgrade');
    }
  }
};

const applyPatch = async (currentVersion, newVersion, tmpPatchFile) => {
  const defaultExcludes = ['package.json'];
  let filesThatDontExist = [];
  let filesThatFailedToApply = [];
  const {
    stdout: relativePathFromRoot
  } = await (0, _execa().default)('git', ['rev-parse', '--show-prefix']);

  try {
    try {
      const excludes = defaultExcludes.map(e => `--exclude=${_path().default.join(relativePathFromRoot, e)}`);
      await (0, _execa().default)('git', ['apply', // According to git documentation, `--binary` flag is turned on by
      // default. However it's necessary when running `git apply --check` to
      '--binary', '--check', tmpPatchFile, ...excludes, '-p2', '--3way', `--directory=${relativePathFromRoot}`]);

      _cliTools().logger.info('Applying diff...');
    } catch (error) {
      const errorLines = error.stderr.split('\n');
      filesThatDontExist = [...errorLines.filter(x => x.includes('does not exist in index')).map(x => x.replace(/^error: (.*): does not exist in index$/, '$1'))].filter(Boolean);
      filesThatFailedToApply = errorLines.filter(x => x.includes('patch does not apply')).map(x => x.replace(/^error: (.*): patch does not apply$/, '$1')).filter(Boolean);

      _cliTools().logger.info('Applying diff...');

      _cliTools().logger.warn(`Excluding files that exist in the template, but not in your project:\n${filesThatDontExist.map(file => `  - ${_chalk().default.bold(file)}`).join('\n')}`);

      if (filesThatFailedToApply.length) {
        _cliTools().logger.error(`Excluding files that failed to apply the diff:\n${filesThatFailedToApply.map(file => `  - ${_chalk().default.bold(file)}`).join('\n')}\nPlease make sure to check the actual changes after the upgrade command is finished.\nYou can find them in our Upgrade Helper web app: ${_chalk().default.underline.dim(`${webDiffUrl}/?from=${currentVersion}&to=${newVersion}`)}`);
      }
    } finally {
      const excludes = [...defaultExcludes, ...filesThatDontExist, ...filesThatFailedToApply].map(e => `--exclude=${_path().default.join(relativePathFromRoot, e)}`);
      await (0, _execa().default)('git', ['apply', tmpPatchFile, ...excludes, '-p2', '--3way', `--directory=${relativePathFromRoot}`]);
    }
  } catch (error) {
    if (error.stderr) {
      _cliTools().logger.debug(`"git apply" failed. Error output:\n${error.stderr}`);
    }

    _cliTools().logger.error('Automatically applying diff failed. We did our best to automatically upgrade as many files as possible');

    return false;
  }

  return true;
};
/**
 * Upgrade application to a new version of React Native.
 */


async function upgrade(argv, ctx) {
  const tmpPatchFile = 'tmp-upgrade-rn.patch';
  const projectDir = ctx.root;

  const {
    version: currentVersion
  } = require(_path().default.join(projectDir, 'node_modules/react-native/package.json'));

  const thirdPartyIOSDeps = Object.values(ctx.dependencies).filter(dependency => dependency.platforms.ios);
  const newVersion = await getVersionToUpgradeTo(argv, currentVersion, projectDir);

  if (!newVersion) {
    return;
  }

  const patch = await getPatch(currentVersion, newVersion, ctx);

  if (patch === null) {
    return;
  }

  if (patch === '') {
    _cliTools().logger.info('Diff has no changes to apply, proceeding further');

    await installDeps(projectDir, newVersion);
    await installCocoaPodsDeps(projectDir, thirdPartyIOSDeps);

    _cliTools().logger.success(`Upgraded React Native to v${newVersion} 🎉. Now you can review and commit the changes`);

    return;
  }

  let patchSuccess;

  try {
    _fs().default.writeFileSync(tmpPatchFile, patch);

    patchSuccess = await applyPatch(currentVersion, newVersion, tmpPatchFile);
  } catch (error) {
    throw new Error(error.stderr || error);
  } finally {
    try {
      _fs().default.unlinkSync(tmpPatchFile);
    } catch (e) {// ignore
    }

    const {
      stdout
    } = await (0, _execa().default)('git', ['status', '-s']);

    if (!patchSuccess) {
      if (stdout) {
        _cliTools().logger.warn('Continuing after failure. Some of the files are upgraded but you will need to deal with conflicts manually');

        await installDeps(projectDir, newVersion);

        _cliTools().logger.info('Running "git status" to check what changed...');

        await (0, _execa().default)('git', ['status'], {
          stdio: 'inherit'
        });
      } else {
        _cliTools().logger.error('Patch failed to apply for unknown reason. Please fall back to manual way of upgrading');
      }
    } else {
      await installDeps(projectDir, newVersion);
      await installCocoaPodsDeps(projectDir, thirdPartyIOSDeps);

      _cliTools().logger.info('Running "git status" to check what changed...');

      await (0, _execa().default)('git', ['status'], {
        stdio: 'inherit'
      });
    }

    if (!patchSuccess) {
      if (stdout) {
        _cliTools().logger.warn('Please run "git diff" to review the conflicts and resolve them');
      }

      if (process.platform === 'darwin') {
        _cliTools().logger.warn('After resolving conflicts don\'t forget to run "pod install" inside "ios" directory');
      }

      _cliTools().logger.info(`You may find these resources helpful:
• Release notes: ${_chalk().default.underline.dim(`https://github.com/facebook/react-native/releases/tag/v${newVersion}`)}
• Manual Upgrade Helper: ${_chalk().default.underline.dim(`${webDiffUrl}/?from=${currentVersion}&to=${newVersion}`)}
• Git diff: ${_chalk().default.underline.dim(`${rawDiffUrl}/${currentVersion}..${newVersion}.diff`)}`);

      throw new (_cliTools().CLIError)('Upgrade failed. Please see the messages above for details');
    }
  }

  _cliTools().logger.success(`Upgraded React Native to v${newVersion} 🎉. Now you can review and commit the changes`);
}

const upgradeCommand = {
  name: 'upgrade [version]',
  description: "Upgrade your app's template files to the specified or latest npm version using `rn-diff-purge` project. Only valid semver versions are allowed.",
  func: upgrade
};
var _default = upgradeCommand;
exports.default = _default;