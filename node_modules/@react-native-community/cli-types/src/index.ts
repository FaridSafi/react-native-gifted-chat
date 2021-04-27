import {
  IOSProjectConfig,
  IOSProjectParams,
  IOSDependencyConfig,
  IOSDependencyParams,
} from './ios';
import {
  AndroidProjectConfig,
  AndroidProjectParams,
  AndroidDependencyConfig,
  AndroidDependencyParams,
} from './android';

export type InquirerPrompt = any;

export type CommandFunction<Args = Object> = (
  argv: Array<string>,
  ctx: Config,
  args: Args,
) => Promise<void> | void;

export type OptionValue = string | boolean | number;

export type CommandOption<T = (ctx: Config) => OptionValue> = {
  name: string;
  description?: string;
  parse?: (val: string) => any;
  default?: OptionValue | T;
};

export type DetachedCommandFunction<Args = Object> = (
  argv: string[],
  args: Args,
) => Promise<void> | void;

export type Command<IsDetached extends boolean = false> = {
  name: string;
  description?: string;
  detached?: IsDetached;
  examples?: Array<{
    desc: string;
    cmd: string;
  }>;
  pkg?: {
    name: string;
    version: string;
  };
  func: IsDetached extends true
    ? DetachedCommandFunction<Object>
    : CommandFunction<Object>;
  options?: Array<
    CommandOption<
      IsDetached extends true ? () => OptionValue : (ctx: Config) => OptionValue
    >
  >;
};

export type DetachedCommand = Command<true>;

interface PlatformConfig<
  ProjectConfig,
  ProjectParams,
  DependencyConfig,
  DependencyParams
> {
  projectConfig: (
    projectRoot: string,
    projectParams: ProjectParams | void,
  ) => ProjectConfig | void;
  dependencyConfig: (
    dependency: string,
    params: DependencyParams,
  ) => DependencyConfig | void;
  linkConfig: () => {
    isInstalled: (
      projectConfig: ProjectConfig,
      packageName: string,
      dependencyConfig: DependencyConfig,
    ) => boolean;
    register: (
      name: string,
      dependencyConfig: DependencyConfig,
      params: Object,
      projectConfig: ProjectConfig,
    ) => void;
    unregister: (
      name: string,
      dependencyConfig: DependencyConfig,
      projectConfig: ProjectConfig,
      otherDependencies: Array<DependencyConfig>,
    ) => void;
    copyAssets: (assets: string[], projectConfig: ProjectConfig) => void;
    unlinkAssets: (assets: string[], projectConfig: ProjectConfig) => void;
  };
}

export interface Dependency {
  name: string;
  root: string;
  platforms: {
    android?: AndroidDependencyConfig | null;
    ios?: IOSDependencyConfig | null;
    [key: string]: any;
  };
  assets: string[];
  hooks: {
    prelink?: string;
    postlink?: string;
    preunlink?: string;
    postunlink?: string;
  };
  params: InquirerPrompt[];
}

export type ProjectConfig = {
  android?: AndroidProjectConfig;
  ios?: IOSProjectConfig;
  [key: string]: any;
};

/**
 * @property root - Root where the configuration has been resolved from
 * @property reactNativePath - Path to React Native source
 * @property project - Object that contains configuration for a project (null, when platform not available)
 * @property assets - An array of assets as defined by the user
 * @property dependencies - Map of the dependencies that are present in the project
 * @property platforms - Map of available platforms (build-ins and dynamically loaded)
 * @property commands - An array of commands that are present in 3rd party packages
 * @property haste - Haste configuration resolved based on available plugins
 */
export type Config = {
  root: string;
  reactNativePath: string;
  project: ProjectConfig;
  assets: string[];
  dependencies: {[key: string]: Dependency};
  platforms: {
    android: PlatformConfig<
      AndroidProjectConfig,
      AndroidProjectParams,
      AndroidDependencyConfig,
      AndroidDependencyParams
    >;
    ios: PlatformConfig<
      IOSProjectConfig,
      IOSProjectParams,
      IOSDependencyConfig,
      IOSDependencyParams
    >;
    [name: string]: PlatformConfig<any, any, any, any>;
  };
  commands: Command[];
  haste: {
    platforms: Array<string>;
    providesModuleNodeModules: Array<string>;
  };
};

/**
 * Shares some structure with Config, except that haste and root
 * are calculated and can't be defined
 */

export type UserConfig = Omit<Config, 'root' | 'haste'> & {
  reactNativePath: string | void;
  // Additional project settings
  project: {
    android?: AndroidProjectParams;
    ios?: IOSProjectParams;
    [key: string]: any;
  };
};

export type UserDependencyConfig = {
  // Additional dependency settings
  dependency: Omit<Dependency, 'name' | 'root'>;
  // An array of commands that ship with the dependency
  commands: Command[];
  // An array of extra platforms to load
  platforms: Config['platforms'];
  // Haste config defined by legacy `rnpm`
  haste?: {
    platforms: string[];
    providesModuleNodeModules: string[];
  };
};

export {
  IOSProjectConfig,
  IOSProjectParams,
  IOSDependencyConfig,
  IOSDependencyParams,
};

export {
  AndroidProjectConfig,
  AndroidProjectParams,
  AndroidDependencyConfig,
  AndroidDependencyParams,
};
