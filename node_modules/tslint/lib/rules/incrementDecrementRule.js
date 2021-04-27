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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var OPTION_ALLOW_POST = "allow-post";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = {
            allowPost: this.ruleArguments.indexOf(OPTION_ALLOW_POST) !== -1,
        };
        return this.applyWithFunction(sourceFile, walk, options);
    };
    Rule.metadata = {
        description: "Enforces using explicit += 1 or -= 1 operators.",
        optionExamples: [true, [true, OPTION_ALLOW_POST]],
        options: {
            items: {
                enum: [OPTION_ALLOW_POST],
                type: "string",
            },
            maxLength: 1,
            minLength: 0,
            type: "array",
        },
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            If no arguments are provided, both pre- and post-unary operators are banned.\n            If `\"", "\"` is provided, post-unary operators will be allowed.\n        "], ["\n            If no arguments are provided, both pre- and post-unary operators are banned.\n            If \\`\"", "\"\\` is provided, post-unary operators will be allowed.\n        "])), OPTION_ALLOW_POST),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            It's easy to type +i or -i instead of --i or ++i, and won't always result in invalid code.\n            Prefer standardizing small arithmetic operations with the explicit += and -= operators.\n        "], ["\n            It's easy to type +i or -i instead of --i or ++i, and won't always result in invalid code.\n            Prefer standardizing small arithmetic operations with the explicit += and -= operators.\n        "]))),
        ruleName: "increment-decrement",
        type: "style",
        typescriptOnly: false,
    };
    Rule.FAILURE_STRING_FACTORY = function (newOperatorText) {
        return "Use an explicit " + newOperatorText + " operator.";
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(context) {
    function createReplacement(node, newOperatorText) {
        var text = node.operand.getText(context.sourceFile) + " " + newOperatorText;
        if (node.parent !== undefined && tsutils.isBinaryExpression(node.parent)) {
            text = "(" + text + ")";
        }
        return Lint.Replacement.replaceNode(node, text);
    }
    function complainOnNode(node) {
        var newOperatorText = node.operator === ts.SyntaxKind.PlusPlusToken ? "+= 1" : "-= 1";
        var replacement;
        if (tsutils.isPrefixUnaryExpression(node) ||
            node.parent.kind === ts.SyntaxKind.ExpressionStatement) {
            replacement = createReplacement(node, newOperatorText);
        }
        var failure = Rule.FAILURE_STRING_FACTORY(newOperatorText);
        context.addFailureAtNode(node, failure, replacement);
    }
    function checkPostfixUnaryExpression(node) {
        if (!context.options.allowPost && isIncrementOrDecrementOperator(node.operator)) {
            complainOnNode(node);
        }
    }
    function checkPrefixUnaryExpression(node) {
        if (isIncrementOrDecrementOperator(node.operator)) {
            complainOnNode(node);
        }
    }
    return ts.forEachChild(context.sourceFile, function callback(node) {
        if (tsutils.isPostfixUnaryExpression(node)) {
            checkPostfixUnaryExpression(node);
        }
        else if (tsutils.isPrefixUnaryExpression(node)) {
            checkPrefixUnaryExpression(node);
        }
        return ts.forEachChild(node, callback);
    });
}
function isIncrementOrDecrementOperator(operator) {
    return operator === ts.SyntaxKind.PlusPlusToken || operator === ts.SyntaxKind.MinusMinusToken;
}
var templateObject_1, templateObject_2;
