declare const _default: ({
    name: string;
    description: string;
    func: () => Promise<void>;
} | {
    name: string;
    description: string;
    func: (_argv: string[], config: import("@react-native-community/cli-types").Config, args: import("./runAndroid").Flags) => Promise<void>;
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
})[];
export default _default;
//# sourceMappingURL=index.d.ts.map