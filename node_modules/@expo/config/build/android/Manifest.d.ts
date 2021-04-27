declare type Document = {
    [key: string]: any;
};
export declare function removePermissions(doc: Document, permissionNames?: string[]): void;
export declare function addPermission(doc: Document, permissionName: string): void;
export declare function ensurePermissions(doc: Document, permissionNames: string[]): {
    [permission: string]: boolean;
};
export declare function ensurePermission(doc: Document, permissionName: string): boolean;
export declare function ensurePermissionNameFormat(permissionName: string): string;
export declare function getPermissionAttributes(doc: Document): Document[];
export declare function getPermissions(doc: Document): string[];
export declare function logManifest(doc: Document): void;
export declare function format(manifest: any, { indentLevel, newline }?: {
    indentLevel?: number | undefined;
    newline?: string | undefined;
}): string;
export declare function writeAndroidManifestAsync(manifestPath: string, manifest: any): Promise<void>;
export declare function getProjectAndroidManifestPathAsync(projectDir: string): Promise<string | null>;
export declare function readAsync(manifestPath: string): Promise<Document>;
export declare function persistAndroidPermissionsAsync(projectDir: string, permissions: string[]): Promise<boolean>;
export declare const UnimodulePermissions: {
    [key: string]: string;
};
export {};
