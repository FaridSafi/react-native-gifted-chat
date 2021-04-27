/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
import * as Lint from "..";
interface Options {
    enforceShorthandMethods: boolean;
    enforceShorthandProperties: boolean;
}
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static LONGHAND_PROPERTY: string;
    static LONGHAND_METHOD: string;
    static SHORTHAND_ASSIGNMENT: string;
    static getLonghandPropertyErrorMessage(nodeText: string): string;
    static getLonghandMethodErrorMessage(nodeText: string): string;
    static getDisallowedShorthandErrorMessage(options: Options): "Shorthand property assignments have been disallowed." | "Shorthand method assignments have been disallowed." | "Shorthand property and method assignments have been disallowed.";
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
    private parseOptions;
}
export {};
