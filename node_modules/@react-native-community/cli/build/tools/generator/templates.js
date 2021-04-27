"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProjectFromTemplate = createProjectFromTemplate;

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _copyProjectTemplateAndReplace = _interopRequireDefault(require("./copyProjectTemplateAndReplace"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var PackageManager = _interopRequireWildcard(require("../packageManager"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param destPath Create the new project at this path.
 * @param newProjectName For example 'AwesomeApp'.
 * @param template Template to use, for example 'navigation'.
 * @param yarnVersion Version of yarn available on the system, or null if
 *                    yarn is not available. For example '0.18.1'.
 */
async function createProjectFromTemplate(destPath, newProjectName, template) {
  const templatePath = _path().default.dirname(require.resolve('react-native/template'));

  (0, _copyProjectTemplateAndReplace.default)(templatePath, destPath, newProjectName);

  if (template === undefined) {
    // No specific template, use just the react-native template above
    return;
  } // Keep the files from the react-native template, and overwrite some of them
  // with the specified project template.
  // The react-native template contains the native files (these are used by
  // all templates) and every other template only contains additional JS code.
  // Reason:
  // This way we don't have to duplicate the native files in every template.
  // If we duplicated them we'd make RN larger and risk that people would
  // forget to maintain all the copies so they would go out of sync.


  await createFromRemoteTemplate(template, destPath, newProjectName);
}
/**
 * The following formats are supported for the template:
 * - 'demo' -> Fetch the package react-native-template-demo from npm
 * - git://..., http://..., file://... or any other URL supported by npm
 */


async function createFromRemoteTemplate(template, destPath, newProjectName) {
  let installPackage;
  let templateName;

  if (template.includes(':/')) {
    // URL, e.g. git://, file://, file:/
    installPackage = template;
    templateName = template.substr(template.lastIndexOf('/') + 1);
  } else {
    // e.g 'demo'
    installPackage = `react-native-template-${template}`;
    templateName = installPackage;
  } // Check if the template exists


  _cliTools().logger.info(`Fetching template ${installPackage}...`);

  try {
    await PackageManager.install([installPackage], {
      root: destPath
    });

    const templatePath = _path().default.resolve('node_modules', templateName);

    (0, _copyProjectTemplateAndReplace.default)(templatePath, destPath, newProjectName, {
      // Every template contains a dummy package.json file included
      // only for publishing the template to npm.
      // We want to ignore this dummy file, otherwise it would overwrite
      // our project's package.json file.
      ignorePaths: ['package.json', 'dependencies.json', 'devDependencies.json']
    });
    await installTemplateDependencies(templatePath, destPath);
    await installTemplateDevDependencies(templatePath, destPath);
  } finally {
    // Clean up the temp files
    try {
      await PackageManager.uninstall([templateName], {
        root: destPath
      });
    } catch (err) {
      // Not critical but we still want people to know and report
      // if this the clean up fails.
      _cliTools().logger.warn(`Failed to clean up template temp files in node_modules/${templateName}. ` + 'This is not a critical error, you can work on your app.');
    }
  }
}

async function installTemplateDependencies(templatePath, root) {
  // dependencies.json is a special file that lists additional dependencies
  // that are required by this template
  const dependenciesJsonPath = _path().default.resolve(templatePath, 'dependencies.json');

  _cliTools().logger.info('Adding dependencies for the project...');

  if (!_fs().default.existsSync(dependenciesJsonPath)) {
    _cliTools().logger.info('No additional dependencies.');

    return;
  }

  let dependencies;

  try {
    dependencies = require(dependenciesJsonPath);
  } catch (err) {
    throw new Error(`Could not parse the template's dependencies.json: ${err.message}`);
  }

  const dependenciesToInstall = Object.keys(dependencies).map(depName => `${depName}@${dependencies[depName]}`);
  await PackageManager.install(dependenciesToInstall, {
    root
  });

  _cliTools().logger.info("Linking native dependencies into the project's build files...");

  (0, _child_process().execSync)('react-native link', {
    cwd: root,
    stdio: 'inherit'
  });
}

async function installTemplateDevDependencies(templatePath, root) {
  // devDependencies.json is a special file that lists additional develop dependencies
  // that are required by this template
  const devDependenciesJsonPath = _path().default.resolve(templatePath, 'devDependencies.json');

  _cliTools().logger.info('Adding develop dependencies for the project...');

  if (!_fs().default.existsSync(devDependenciesJsonPath)) {
    _cliTools().logger.info('No additional develop dependencies.');

    return;
  }

  let dependencies;

  try {
    dependencies = require(devDependenciesJsonPath);
  } catch (err) {
    throw new Error(`Could not parse the template's devDependencies.json: ${err.message}`);
  }

  const dependenciesToInstall = Object.keys(dependencies).map(depName => `${depName}@${dependencies[depName]}`);
  await PackageManager.installDev(dependenciesToInstall, {
    root
  });
}