/**
 * Settings that user can define in the project configuration for iOS.
 * Same for dependency - we share the type.
 *
 * See UserDependencyConfigT and UserConfigT for details
 */
export interface IOSProjectParams {
    project?: string;
    podspecPath?: string;
    sharedLibraries?: string[];
    libraryFolder?: string;
    plist: Array<any>;
    scriptPhases?: Array<any>;
}
export interface IOSDependencyParams extends IOSProjectParams {
}
export interface IOSProjectConfig {
    sourceDir: string;
    folder: string;
    pbxprojPath: string;
    podfile: string;
    podspecPath: string;
    projectPath: string;
    projectName: string;
    libraryFolder: string;
    sharedLibraries: Array<any>;
    plist: Array<any>;
}
export interface IOSDependencyConfig extends IOSProjectConfig {
}
//# sourceMappingURL=ios.d.ts.map