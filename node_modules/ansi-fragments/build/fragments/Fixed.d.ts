import IFragment from './IFragment';
declare type Bias = 'start' | 'end';
export declare function fixed(value: number, bias: Bias, ...children: Array<string | IFragment>): Fixed;
export declare class Fixed implements IFragment {
    private readonly width;
    private readonly bias;
    private readonly children;
    constructor(width: number, bias: Bias, children: Array<string | IFragment>);
    build(): string;
}
export {};
//# sourceMappingURL=Fixed.d.ts.map