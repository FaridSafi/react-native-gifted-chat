import { Config } from '@react-native-community/cli-types';
export interface Flags {
    tasks?: Array<string>;
    root: string;
    variant: string;
    appFolder: string;
    appId: string;
    appIdSuffix: string;
    mainActivity: string;
    deviceId?: string;
    packager: boolean;
    port: number;
    terminal: string;
    jetifier: boolean;
}
/**
 * Starts the app on a connected Android emulator or device.
 */
declare function runAndroid(_argv: Array<string>, config: Config, args: Flags): Promise<void>;
declare const _default: {
    name: string;
    description: string;
    func: typeof runAndroid;
    options: ({
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
        default: string | undefined;
        parse?: undefined;
    } | {
        name: string;
        description: string;
        parse: (val: string) => string[];
        default?: undefined;
    } | {
        name: string;
        description: string;
        default: boolean;
        parse?: undefined;
    })[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map