import IFragment from './IFragment';
export declare function pad(count: number, separator?: string): Pad;
export declare class Pad implements IFragment {
    private readonly count;
    private readonly separator;
    constructor(count: number, separator?: string);
    build(): string;
}
//# sourceMappingURL=Pad.d.ts.map