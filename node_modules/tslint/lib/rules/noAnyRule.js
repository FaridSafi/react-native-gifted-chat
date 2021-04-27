"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var noAny_examples_1 = require("./code-examples/noAny.examples");
var OPTION_IGNORE_REST_ARGS = "ignore-rest-args";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = getOptions(this.ruleArguments[0]);
        return this.applyWithFunction(sourceFile, walk, options);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-any",
        description: "Disallows usages of `any` as a type declaration.",
        hasFix: false,
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Using `any` as a type declaration nullifies the compile-time benefits of the type system.\n\n            If you're dealing with data of unknown or \"any\" types, you shouldn't be accessing members of it.\n            Either add type annotations for properties that may exist or change the data type to the empty object type `{}`.\n\n            Alternately, if you're creating storage or handling for consistent but unknown types, such as in data structures\n            or serialization, use `<T>` template types for generic type handling.\n\n            Also see the `no-unsafe-any` rule.\n        "], ["\n            Using \\`any\\` as a type declaration nullifies the compile-time benefits of the type system.\n\n            If you're dealing with data of unknown or \"any\" types, you shouldn't be accessing members of it.\n            Either add type annotations for properties that may exist or change the data type to the empty object type \\`{}\\`.\n\n            Alternately, if you're creating storage or handling for consistent but unknown types, such as in data structures\n            or serialization, use \\`<T>\\` template types for generic type handling.\n\n            Also see the \\`no-unsafe-any\\` rule.\n        "]))),
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            If `\"", "\": true` is provided rest arguments will be ignored.\n        "], ["\n            If \\`\"", "\": true\\` is provided rest arguments will be ignored.\n        "])), OPTION_IGNORE_REST_ARGS),
        options: {
            type: "object",
            properties: (_a = {},
                _a[OPTION_IGNORE_REST_ARGS] = { type: "boolean" },
                _a),
        },
        optionExamples: [true, [true, (_b = {}, _b[OPTION_IGNORE_REST_ARGS] = true, _b)]],
        type: "typescript",
        typescriptOnly: true,
        codeExamples: noAny_examples_1.codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Type declaration of 'any' loses type-safety. Consider replacing it with a more precise type.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function getOptions(options) {
    var _a;
    return tslib_1.__assign((_a = {}, _a[OPTION_IGNORE_REST_ARGS] = false, _a), options);
}
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            if (ctx.options[OPTION_IGNORE_REST_ARGS] && isRestParameterArrayType(node)) {
                return;
            }
            var start = node.end - 3;
            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING);
        }
        return ts.forEachChild(node, cb);
    });
}
function isRestParameterArrayType(anyTypeNode) {
    return (tsutils_1.isArrayTypeNode(anyTypeNode.parent) &&
        tsutils_1.isParameterDeclaration(anyTypeNode.parent.parent) &&
        anyTypeNode.parent.parent.getChildAt(0).kind === ts.SyntaxKind.DotDotDotToken);
}
var templateObject_1, templateObject_2;
