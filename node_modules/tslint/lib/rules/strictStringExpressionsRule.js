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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var OPTION_ALLOW_EMPTY_TYPES = "allow-empty-types";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions(), program.getTypeChecker());
    };
    Rule.prototype.getRuleOptions = function () {
        var _a;
        if (this.ruleArguments[0] === undefined) {
            return _a = {},
                _a[OPTION_ALLOW_EMPTY_TYPES] = true,
                _a;
        }
        else {
            return this.ruleArguments[0];
        }
    };
    Rule.CONVERSION_REQUIRED = "Explicit conversion to string type required";
    Rule.metadata = {
        description: "Disable implicit toString() calls",
        descriptionDetails: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Require explicit toString() call for variables used in strings. By default only strings are allowed.\n\n            The following nodes are checked:\n\n            * String literals (\"foo\" + bar)\n            * ES6 templates (`foo ${bar}`)"], ["\n            Require explicit toString() call for variables used in strings. By default only strings are allowed.\n\n            The following nodes are checked:\n\n            * String literals (\"foo\" + bar)\n            * ES6 templates (\\`foo \\${bar}\\`)"]))),
        hasFix: true,
        optionExamples: [
            true,
            [
                true,
                (_a = {},
                    _a[OPTION_ALLOW_EMPTY_TYPES] = true,
                    _a),
            ],
        ],
        options: {
            properties: (_b = {},
                _b[OPTION_ALLOW_EMPTY_TYPES] = {
                    type: "boolean",
                },
                _b),
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n                Following arguments may be optionally provided:\n                * `", "` allows `null`, `undefined` and `never` to be passed into strings without explicit conversion"], ["\n                Following arguments may be optionally provided:\n                * \\`", "\\` allows \\`null\\`, \\`undefined\\` and \\`never\\` to be passed into strings without explicit conversion"])), OPTION_ALLOW_EMPTY_TYPES),
        requiresTypeInfo: true,
        ruleName: "strict-string-expressions",
        type: "functionality",
        typescriptOnly: true,
    };
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, checker) {
    var sourceFile = ctx.sourceFile, options = ctx.options;
    ts.forEachChild(sourceFile, function cb(node) {
        switch (node.kind) {
            case ts.SyntaxKind.BinaryExpression: {
                var binaryExpr = node;
                if (binaryExpr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    var leftIsPassedAsIs = typeCanBeStringifiedEasily(checker.getTypeAtLocation(binaryExpr.left), options);
                    var rightIsPassedAsIs = typeCanBeStringifiedEasily(checker.getTypeAtLocation(binaryExpr.right), options);
                    var leftIsFailed = !leftIsPassedAsIs && rightIsPassedAsIs;
                    var rightIsFailed = leftIsPassedAsIs && !rightIsPassedAsIs;
                    if (leftIsFailed || rightIsFailed) {
                        var expression = leftIsFailed ? binaryExpr.left : binaryExpr.right;
                        addFailure(binaryExpr, expression);
                    }
                }
                break;
            }
            case ts.SyntaxKind.TemplateSpan: {
                var templateSpanNode = node;
                var type = checker.getTypeAtLocation(templateSpanNode.expression);
                var shouldPassAsIs = typeCanBeStringifiedEasily(type, options);
                if (!shouldPassAsIs) {
                    var expression = templateSpanNode.expression;
                    addFailure(templateSpanNode, expression);
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
    function addFailure(node, expression) {
        var fix = Lint.Replacement.replaceFromTo(expression.getStart(), expression.end, "String(" + expression.getText() + ")");
        ctx.addFailureAtNode(node, Rule.CONVERSION_REQUIRED, fix);
    }
}
var typeIsEmpty = function (type) {
    return tsutils_1.isTypeFlagSet(type, ts.TypeFlags.Null) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.VoidLike) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.Undefined) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.Never);
};
function typeCanBeStringifiedEasily(type, options) {
    if (tsutils_1.isUnionType(type)) {
        return type.types.every(function (unionAtomicType) {
            return typeCanBeStringifiedEasily(unionAtomicType, options);
        });
    }
    if (options[OPTION_ALLOW_EMPTY_TYPES] && typeIsEmpty(type)) {
        return true;
    }
    return (tsutils_1.isTypeFlagSet(type, ts.TypeFlags.BooleanLike) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.StringOrNumberLiteral) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.NumberLike) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.StringLike) ||
        tsutils_1.isTypeFlagSet(type, ts.TypeFlags.Any));
}
var templateObject_1, templateObject_2;
