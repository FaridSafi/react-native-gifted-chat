import { IFilter, Entry } from '../types';
export default class IosFilter implements IFilter {
    private readonly minPriority;
    private filter;
    constructor(minPriority?: number);
    setFilterByTag(tags: string[]): void;
    setFilterByMatch(regexes: RegExp[]): void;
    shouldInclude(entry: Entry): boolean;
}
//# sourceMappingURL=IosFilter.d.ts.map