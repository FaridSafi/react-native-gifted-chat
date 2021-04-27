"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-null-undefined-union",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Disallows explicitly declared or implicitly returned union types with both `null` and\n            `undefined` as members.\n        "], ["\n            Disallows explicitly declared or implicitly returned union types with both \\`null\\` and\n            \\`undefined\\` as members.\n        "]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            A union type that includes both `null` and `undefined` is either redundant or fragile.\n            Enforcing the choice between the two allows the `triple-equals` rule to exist without\n            exceptions, and is essentially a more flexible version of the `no-null-keyword` rule.\n            Optional parameters are not considered to have the type `undefined`.\n        "], ["\n            A union type that includes both \\`null\\` and \\`undefined\\` is either redundant or fragile.\n            Enforcing the choice between the two allows the \\`triple-equals\\` rule to exist without\n            exceptions, and is essentially a more flexible version of the \\`no-null-keyword\\` rule.\n            Optional parameters are not considered to have the type \\`undefined\\`.\n        "]))),
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Union type cannot include both 'null' and 'undefined'.";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, tc) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        var type = getType(node, tc);
        if (type !== undefined && isNullUndefinedUnion(type)) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
function getType(node, tc) {
    if (tsutils_1.isUnionTypeNode(node)) {
        return tc.getTypeAtLocation(node);
    }
    else if (tsutils_1.isSignatureDeclaration(node) && node.type === undefined) {
        // Explicit types should be handled by the first case.
        var signature = tc.getSignatureFromDeclaration(node);
        return signature === undefined ? undefined : signature.getReturnType();
    }
    else {
        return undefined;
    }
}
function isNullUndefinedUnion(type) {
    if (tsutils_1.isTypeReference(type) && type.typeArguments !== undefined) {
        return type.typeArguments.some(isNullUndefinedUnion);
    }
    if (tsutils_1.isUnionType(type)) {
        var hasNull = false;
        var hasUndefined = false;
        for (var _i = 0, _a = type.types; _i < _a.length; _i++) {
            var subType = _a[_i];
            hasNull = hasNull || subType.getFlags() === ts.TypeFlags.Null;
            hasUndefined = hasUndefined || subType.getFlags() === ts.TypeFlags.Undefined;
            if (hasNull && hasUndefined) {
                return true;
            }
        }
    }
    return false;
}
var templateObject_1, templateObject_2;
