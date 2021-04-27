import IFragment from './IFragment';
export declare type AnsiColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'brightBlack' | 'brightRed' | 'brightGreen' | 'brightYellow' | 'brightBlue' | 'brightMagenta' | 'brightCyan' | 'brightWhite' | 'gray' | 'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite' | 'bgBrightBlack' | 'bgBrightRed' | 'bgBrightGreen' | 'bgBrightYellow' | 'bgBrightBlue' | 'bgBrightMagenta' | 'bgBrightCyan' | 'bgBrightWhite' | 'none';
export declare function color(ansiColor: AnsiColor, ...children: Array<string | IFragment>): Color;
export declare class Color implements IFragment {
    private readonly color;
    private readonly children;
    constructor(ansiColor: AnsiColor, children: Array<string | IFragment>);
    build(): string;
}
//# sourceMappingURL=Color.d.ts.map