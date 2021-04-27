import IFragment from './IFragment';
export declare type AnsiModifier = 'dim' | 'bold' | 'hidden' | 'italic' | 'underline' | 'strikethrough' | 'none';
export declare function modifier(ansiModifier: AnsiModifier, ...children: Array<string | IFragment>): Modifier;
export declare class Modifier implements IFragment {
    private readonly modifier;
    private readonly children;
    constructor(ansiModifier: AnsiModifier, children: Array<string | IFragment>);
    build(): string;
}
//# sourceMappingURL=Modifier.d.ts.map