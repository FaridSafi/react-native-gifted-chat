import { Dayjs } from 'dayjs';
export declare type Platform = 'ios' | 'android';
export declare type Entry = {
    date: Dayjs;
    pid: number;
    priority: number;
    tag?: string;
    appId?: string;
    messages: string[];
    platform: Platform;
};
export interface IParser {
    splitMessages(data: string): string[];
    parseMessages(messages: string[]): Entry[];
}
export interface IFilter {
    shouldInclude(entry: Entry): boolean;
}
//# sourceMappingURL=types.d.ts.map