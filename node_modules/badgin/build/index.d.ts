import * as favicon from './favicon';
import * as title from './title';
export declare type Value = number | undefined;
export interface Interface {
    set: (value: Value) => void;
    clear: () => void;
}
export declare type Method = 'Badging' | 'Favicon' | 'Title';
export interface Options {
    method: Method;
    favicon: Partial<favicon.Options>;
    title: Partial<title.Options>;
}
/**
 * Sets badge
 */
export declare function set(value: Value, options?: Partial<Options>): void;
/**
 * Clears badge
 */
export declare function clear(): void;
//# sourceMappingURL=index.d.ts.map