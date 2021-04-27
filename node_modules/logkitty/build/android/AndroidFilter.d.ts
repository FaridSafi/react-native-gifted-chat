import { IFilter, Entry } from '../types';
export default class AndroidFilter implements IFilter {
    private readonly minPriority;
    private filter;
    constructor(minPriority?: number);
    setFilterByTag(tags: string[]): void;
    setFilterByApp(applicationId: string, adbPath?: string): void;
    setFilterByMatch(regexes: RegExp[]): void;
    setCustomFilter(patterns: string[]): void;
    shouldInclude(entry: Entry): boolean;
}
//# sourceMappingURL=AndroidFilter.d.ts.map