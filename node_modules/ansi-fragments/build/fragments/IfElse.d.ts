import IFragment from './IFragment';
export declare type ConditionValue = boolean | string | number | null | undefined;
export declare type Condition = ConditionValue | (() => ConditionValue);
export declare function ifElse(condition: Condition, ifTrueFragment: string | IFragment, elseFragment?: string | IFragment): IfElse;
export declare class IfElse implements IFragment {
    private readonly ifTrueFragment;
    private readonly elseFragment?;
    private readonly condition;
    constructor(condition: Condition, ifTrueFragment: string | IFragment, elseFragment?: string | IFragment);
    build(): string;
}
//# sourceMappingURL=IfElse.d.ts.map