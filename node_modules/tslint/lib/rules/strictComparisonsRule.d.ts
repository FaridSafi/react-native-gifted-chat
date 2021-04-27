/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as ts from "typescript";
import * as Lint from "../index";
declare const enum TypeKind {
    Any = 0,
    Number = 1,
    Enum = 2,
    String = 3,
    Boolean = 4,
    Null = 5,
    Undefined = 6,
    Object = 7
}
export declare class Rule extends Lint.Rules.TypedRule {
    static metadata: Lint.IRuleMetadata;
    static INVALID_TYPES(types1: TypeKind[], types2: TypeKind[]): string;
    static INVALID_TYPE_FOR_OPERATOR(type: TypeKind, comparator: string): string;
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[];
    private getRuleOptions;
}
export {};
