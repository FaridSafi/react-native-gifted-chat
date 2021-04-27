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
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var TAUTOLOGY_DISCOVERED_ERROR_STRING = "Both sides of this equality comparison are the same, so the expression is either a tautology or a contradiction.";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.metadata = {
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        Enforces that relational/equality binary operators does not take two equal variables/literals as operands.\n        Expression like 3 === 3, someVar === someVar, \"1\" > \"1\" are either a tautology or contradiction, and will produce an error.\n        "], ["\n        Enforces that relational/equality binary operators does not take two equal variables/literals as operands.\n        Expression like 3 === 3, someVar === someVar, \"1\" > \"1\" are either a tautology or contradiction, and will produce an error.\n        "]))),
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: "Clean redundant code and unnecessary comparison of objects and literals.",
        ruleName: "no-tautology-expression",
        type: "functionality",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(context) {
    var cb = function (node) {
        if (tsutils.isBinaryExpression(node) && isRelationalOrLogicalOperator(node.operatorToken)) {
            if ((tsutils.isStringLiteral(node.left) && tsutils.isStringLiteral(node.right)) ||
                (tsutils.isNumericLiteral(node.left) && tsutils.isNumericLiteral(node.right))) {
                if (node.left.text === node.right.text) {
                    context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                }
            }
            else if (tsutils.isIdentifier(node.left) && tsutils.isIdentifier(node.right)) {
                if (node.left.text === node.right.text) {
                    context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                }
            }
            else if (tsutils.isPropertyAccessExpression(node.left) &&
                tsutils.isPropertyAccessExpression(node.right)) {
                if (node.left.expression.getText() === node.right.expression.getText()) {
                    if (node.left.name.text === node.right.name.text) {
                        context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
                    }
                }
            }
            else if ((isBooleanLiteral(node.left) && isBooleanLiteral(node.right)) ||
                (isNullLiteral(node.left) && isNullLiteral(node.right))) {
                context.addFailureAtNode(node, TAUTOLOGY_DISCOVERED_ERROR_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(context.sourceFile, cb);
}
function isNullLiteral(node) {
    return node.kind === ts.SyntaxKind.NullKeyword;
}
function isBooleanLiteral(node) {
    return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
}
function isRelationalOrLogicalOperator(operator) {
    return new Set([
        ts.SyntaxKind.LessThanToken,
        ts.SyntaxKind.GreaterThanToken,
        ts.SyntaxKind.LessThanEqualsToken,
        ts.SyntaxKind.GreaterThanEqualsToken,
        ts.SyntaxKind.EqualsEqualsToken,
        ts.SyntaxKind.EqualsEqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.SyntaxKind.BarBarToken,
    ]).has(operator.kind);
}
var templateObject_1;
