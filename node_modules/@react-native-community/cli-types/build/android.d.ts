export interface AndroidProjectConfig {
    sourceDir: string;
    isFlat: boolean;
    folder: string;
    stringsPath: string;
    manifestPath: string;
    buildGradlePath: string;
    settingsGradlePath: string;
    assetsPath: string;
    mainFilePath: string;
    packageName: string;
}
export interface AndroidProjectParams {
    sourceDir?: string;
    manifestPath?: string;
    packageName?: string;
    packageFolder?: string;
    mainFilePath?: string;
    stringsPath?: string;
    settingsGradlePath?: string;
    assetsPath?: string;
    buildGradlePath?: string;
}
export interface AndroidDependencyConfig {
    sourceDir: string;
    folder: string;
    packageImportPath: string;
    packageInstance: string;
}
export interface AndroidDependencyParams {
    packageName?: string;
    sourceDir?: string;
    manifestPath?: string;
    packageImportPath?: string;
    packageInstance?: string;
}
//# sourceMappingURL=android.d.ts.map