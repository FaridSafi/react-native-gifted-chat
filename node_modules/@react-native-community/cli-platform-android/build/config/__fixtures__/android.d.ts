/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const valid: {
    src: {
        'AndroidManifest.xml': any;
        main: {
            com: {
                some: {
                    example: {
                        [x: string]: any;
                        'Main.java': any;
                    };
                };
            };
        };
    };
};
export declare const validKotlin: {
    src: {
        'AndroidManifest.xml': any;
        main: {
            com: {
                some: {
                    example: {
                        [x: string]: any;
                        'Main.java': any;
                    };
                };
            };
        };
    };
};
export declare const userConfigManifest: {
    src: {
        main: {
            'AndroidManifest.xml': any;
            com: {
                some: {
                    example: {
                        'Main.java': any;
                        'ReactPackage.java': any;
                    };
                };
            };
        };
        debug: {
            'AndroidManifest.xml': any;
        };
    };
};
export declare const corrupted: {
    src: {
        'AndroidManifest.xml': any;
        main: {
            com: {
                some: {
                    example: {};
                };
            };
        };
    };
};
export declare const noPackage: {
    src: {
        'AndroidManifest.xml': any;
        main: {
            com: {
                some: {
                    example: {
                        'Main.java': any;
                    };
                };
            };
        };
    };
};
export declare const findPackagesClassNameKotlinValid: string[];
export declare const findPackagesClassNameKotlinNotValid: string[];
export declare const findPackagesClassNameJavaValid: string[];
export declare const findPackagesClassNameJavaNotValid: string[];
//# sourceMappingURL=android.d.ts.map