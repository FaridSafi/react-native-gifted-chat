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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var OPTION_ALLOW_GENERICS = "allow-generics";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, {
            // tslint:disable-next-line:no-object-literal-type-assertion
            allowGenerics: this.getAllowGenerics(this.ruleArguments[0]),
        });
    };
    Rule.prototype.getAllowGenerics = function (rawArgument) {
        if (rawArgument == undefined) {
            return true;
        }
        var allowGenerics = rawArgument[OPTION_ALLOW_GENERICS];
        return allowGenerics instanceof Array ? new Set(allowGenerics) : Boolean(allowGenerics);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "invalid-void",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Disallows usage of `void` type outside of generic or return types.\n            If `void` is used as return type, it shouldn't be a part of intersection/union type."], ["\n            Disallows usage of \\`void\\` type outside of generic or return types.\n            If \\`void\\` is used as return type, it shouldn't be a part of intersection/union type."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            The `void` type means \"nothing\" or that a function does not return any value,\n            in contra with implicit `undefined` type which means that a function returns a value `undefined`.\n            So \"nothing\" cannot be mixed with any other types.\n            If you need this - use `undefined` type instead."], ["\n            The \\`void\\` type means \"nothing\" or that a function does not return any value,\n            in contra with implicit \\`undefined\\` type which means that a function returns a value \\`undefined\\`.\n            So \"nothing\" cannot be mixed with any other types.\n            If you need this - use \\`undefined\\` type instead."]))),
        hasFix: false,
        optionsDescription: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            If `", "` is specified as `false`, then generic types will no longer be allowed to to be `void`.\n            Alternately, provide an array of strings for `", "` to exclusively allow generic types by those names."], ["\n            If \\`", "\\` is specified as \\`false\\`, then generic types will no longer be allowed to to be \\`void\\`.\n            Alternately, provide an array of strings for \\`", "\\` to exclusively allow generic types by those names."])), OPTION_ALLOW_GENERICS, OPTION_ALLOW_GENERICS),
        options: {
            type: "object",
            properties: (_a = {},
                _a[OPTION_ALLOW_GENERICS] = {
                    oneOf: [
                        { type: "boolean" },
                        { type: "array", items: { type: "string" }, minLength: 1 },
                    ],
                },
                _a),
            additionalProperties: false,
        },
        optionExamples: [
            true,
            [true, (_b = {}, _b[OPTION_ALLOW_GENERICS] = false, _b)],
            [true, (_c = {}, _c[OPTION_ALLOW_GENERICS] = ["Promise", "PromiseLike"], _c)],
        ],
        type: "maintainability",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_ALLOW_GENERICS = "void is only valid as a return type or generic type variable";
    Rule.FAILURE_STRING_NO_GENERICS = "void is only valid as a return type";
    Rule.FAILURE_WRONG_GENERIC = function (genericName) {
        return genericName + " may not have void as a type variable";
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var failedKinds = new Set([
    ts.SyntaxKind.PropertySignature,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.VariableDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,
    ts.SyntaxKind.IntersectionType,
    ts.SyntaxKind.UnionType,
    ts.SyntaxKind.Parameter,
    ts.SyntaxKind.TypeParameter,
    ts.SyntaxKind.AsExpression,
    ts.SyntaxKind.TypeAssertionExpression,
    ts.SyntaxKind.TypeOperator,
    ts.SyntaxKind.ArrayType,
    ts.SyntaxKind.MappedType,
    ts.SyntaxKind.ConditionalType,
    ts.SyntaxKind.TypeReference,
    ts.SyntaxKind.NewExpression,
    ts.SyntaxKind.CallExpression,
]);
function walk(ctx) {
    var defaultFailureString = ctx.options.allowGenerics
        ? Rule.FAILURE_STRING_ALLOW_GENERICS
        : Rule.FAILURE_STRING_NO_GENERICS;
    var getGenericReferenceName = function (node) {
        var rawName = tsutils.isNewExpression(node) ? node.expression : node.typeName;
        return tsutils.isIdentifier(rawName) ? rawName.text : rawName.getText(ctx.sourceFile);
    };
    var getTypeReferenceFailure = function (node) {
        if (!(ctx.options.allowGenerics instanceof Set)) {
            return ctx.options.allowGenerics ? undefined : defaultFailureString;
        }
        var genericName = getGenericReferenceName(node);
        return ctx.options.allowGenerics.has(genericName)
            ? undefined
            : Rule.FAILURE_WRONG_GENERIC(genericName);
    };
    var checkTypeReference = function (parent, node) {
        var failure = getTypeReferenceFailure(parent);
        if (failure !== undefined) {
            ctx.addFailureAtNode(node, failure);
        }
    };
    var isParentGenericReference = function (parent, node) {
        if (tsutils.isTypeReferenceNode(parent)) {
            return true;
        }
        return (tsutils.isNewExpression(parent) &&
            parent.typeArguments !== undefined &&
            ts.isTypeNode(node) &&
            parent.typeArguments.indexOf(node) !== -1);
    };
    ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (node.kind === ts.SyntaxKind.VoidKeyword && failedKinds.has(node.parent.kind)) {
            if (isParentGenericReference(node.parent, node)) {
                checkTypeReference(node.parent, node);
            }
            else {
                ctx.addFailureAtNode(node, defaultFailureString);
            }
        }
        ts.forEachChild(node, cb);
    });
}
var templateObject_1, templateObject_2, templateObject_3;
