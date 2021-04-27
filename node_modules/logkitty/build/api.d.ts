/// <reference types="node" />
import { EventEmitter } from 'events';
import { IFilter, Platform } from './types';
export { Priority as AndroidPriority } from './android/constants';
export { Priority as IosPriority } from './ios/constants';
export { formatEntry, formatError } from './formatters';
export { Entry } from './types';
export declare type LogkittyOptions = {
    platform: Platform;
    adbPath?: string;
    priority?: number;
    filter?: FilterCreator;
};
export declare type FilterCreator = (platform: Platform, minPriority?: number, adbPath?: string) => IFilter;
export declare function makeTagsFilter(...tags: string[]): FilterCreator;
export declare function makeAppFilter(appIdentifier: string): FilterCreator;
export declare function makeMatchFilter(...regexes: RegExp[]): FilterCreator;
export declare function makeCustomFilter(...patterns: string[]): FilterCreator;
export declare function logkitty(options: LogkittyOptions): EventEmitter;
//# sourceMappingURL=api.d.ts.map