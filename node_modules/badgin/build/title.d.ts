import { Value } from './index';
export declare type Options = {
    indicator: string;
};
declare type Title = string | null;
export declare const defaultOptions: Options;
export declare function changeTitle(title: Title, value: Value, options: Options): void;
export declare function set(value: Value, options?: Partial<Options>): boolean;
export declare function clear(): void;
export {};
//# sourceMappingURL=title.d.ts.map