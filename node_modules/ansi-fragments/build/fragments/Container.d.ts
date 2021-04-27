import IFragment from './IFragment';
export declare function container(...children: Array<string | IFragment>): Container;
export declare class Container implements IFragment {
    private readonly children;
    constructor(children: Array<string | IFragment>);
    build(): string;
}
//# sourceMappingURL=Container.d.ts.map