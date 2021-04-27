"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectConfig = exports.dependencyConfig = void 0;

function t() {
  const data = _interopRequireWildcard(require("@hapi/joi"));

  t = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const map = (key, value) => t().object().unknown(true).pattern(key, value);
/**
 * Schema for CommandT
 */


const command = t().object({
  name: t().string().required(),
  description: t().string(),
  usage: t().string(),
  func: t().func().required(),
  options: t().array().items(t().object({
    name: t().string().required(),
    description: t().string(),
    parse: t().func(),
    default: t().alternatives().try([t().bool(), t().number(), t().string().allow(''), t().func()])
  }).rename('command', 'name', {
    ignoreUndefined: true
  })),
  examples: t().array().items(t().object({
    desc: t().string().required(),
    cmd: t().string().required()
  }))
});
/**
 * Schema for UserDependencyConfigT
 */

const dependencyConfig = t().object({
  dependency: t().object({
    platforms: map(t().string(), t().any()).keys({
      ios: t().object({
        project: t().string(),
        podspecPath: t().string(),
        sharedLibraries: t().array().items(t().string()),
        libraryFolder: t().string(),
        scriptPhases: t().array().items(t().object())
      }).default({}),
      android: t().object({
        sourceDir: t().string(),
        manifestPath: t().string(),
        packageImportPath: t().string(),
        packageInstance: t().string()
      }).default({})
    }).default(),
    assets: t().array().items(t().string()).default([]),
    hooks: map(t().string(), t().string()).default({}),
    params: t().array().items(t().object({
      name: t().string(),
      type: t().string(),
      message: t().string()
    })).default([])
  }).default(),
  platforms: map(t().string(), t().object({
    dependencyConfig: t().func(),
    projectConfig: t().func(),
    linkConfig: t().func()
  })).default({}),
  commands: t().array().items(command).default([])
}).unknown(true).default();
/**
 * Schema for ProjectConfigT
 */

exports.dependencyConfig = dependencyConfig;
const projectConfig = t().object({
  dependencies: map(t().string(), t().object({
    root: t().string(),
    platforms: map(t().string(), t().any()).keys({
      ios: t().object({
        sourceDir: t().string(),
        folder: t().string(),
        pbxprojPath: t().string(),
        podfile: t().string(),
        podspecPath: t().string(),
        projectPath: t().string(),
        projectName: t().string(),
        libraryFolder: t().string(),
        sharedLibraries: t().array().items(t().string())
      }).allow(null),
      android: t().object({
        sourceDir: t().string(),
        folder: t().string(),
        packageImportPath: t().string(),
        packageInstance: t().string()
      }).allow(null)
    }),
    assets: t().array().items(t().string()),
    hooks: map(t().string(), t().string()),
    params: t().array().items(t().object({
      name: t().string(),
      type: t().string(),
      message: t().string()
    }))
  }).allow(null)).default({}),
  reactNativePath: t().string(),
  project: map(t().string(), t().any()).keys({
    ios: t().object({
      project: t().string(),
      sharedLibraries: t().array().items(t().string()),
      libraryFolder: t().string()
    }).default({}),
    android: t().object({
      sourceDir: t().string(),
      manifestPath: t().string(),
      packageName: t().string(),
      packageFolder: t().string(),
      mainFilePath: t().string(),
      stringsPath: t().string(),
      settingsGradlePath: t().string(),
      assetsPath: t().string(),
      buildGradlePath: t().string()
    }).default({})
  }).default(),
  assets: t().array().items(t().string()).default([]),
  commands: t().array().items(command).default([]),
  platforms: map(t().string(), t().object({
    dependencyConfig: t().func(),
    projectConfig: t().func(),
    linkConfig: t().func()
  })).default({})
}).unknown(true).default();
exports.projectConfig = projectConfig;