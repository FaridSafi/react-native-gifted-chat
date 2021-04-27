/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Config } from '@react-native-community/cli-types';
declare type FlagsT = {
    simulator: string;
    configuration: string;
    scheme?: string;
    projectPath: string;
    device?: string | true;
    udid?: string;
    packager: boolean;
    verbose: boolean;
    port: number;
    terminal: string | undefined;
};
declare function runIOS(_: Array<string>, ctx: Config, args: FlagsT): void | Promise<void>;
declare const _default: {
    name: string;
    description: string;
    func: typeof runIOS;
    examples: {
        desc: string;
        cmd: string;
    }[];
    options: ({
        name: string;
        description: string;
        default: string;
        parse?: undefined;
    } | {
        name: string;
        description: string;
        default?: undefined;
        parse?: undefined;
    } | {
        name: string;
        default: string | number;
        parse: (val: string) => number;
        description?: undefined;
    } | {
        name: string;
        description: string;
        default: () => string | undefined;
        parse?: undefined;
    })[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map