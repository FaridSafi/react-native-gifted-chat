"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
var utils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var unnecessaryElse_examples_1 = require("./code-examples/unnecessaryElse.examples");
var OPTION_ALLOW_ELSE_IF = "allow-else-if";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:disable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (name) {
        return "The preceding `if` block ends with a `" + name + "` statement. This `else` is unnecessary.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments[0]));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        Disallows `else` blocks following `if` blocks ending with a `break`, `continue`, `return`, or `throw` statement."], ["\n        Disallows \\`else\\` blocks following \\`if\\` blocks ending with a \\`break\\`, \\`continue\\`, \\`return\\`, or \\`throw\\` statement."]))),
        descriptionDetails: "",
        optionExamples: [true, [true, (_a = {}, _a[OPTION_ALLOW_ELSE_IF] = true, _a)]],
        options: {
            type: "object",
            properties: (_b = {},
                _b[OPTION_ALLOW_ELSE_IF] = { type: "boolean" },
                _b),
        },
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            You can optionally specify the option `\"", "\"` to allow \"else if\" statements.\n        "], ["\n            You can optionally specify the option \\`\"", "\"\\` to allow \"else if\" statements.\n        "])), OPTION_ALLOW_ELSE_IF),
        rationale: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n        When an `if` block is guaranteed to exit control flow when entered,\n        it is unnecessary to add an `else` statement.\n        The contents that would be in the `else` block can be placed after the end of the `if` block."], ["\n        When an \\`if\\` block is guaranteed to exit control flow when entered,\n        it is unnecessary to add an \\`else\\` statement.\n        The contents that would be in the \\`else\\` block can be placed after the end of the \\`if\\` block."]))),
        ruleName: "unnecessary-else",
        type: "style",
        typescriptOnly: false,
        codeExamples: unnecessaryElse_examples_1.codeExamples,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function parseOptions(option) {
    var _a;
    return tslib_1.__assign((_a = {}, _a[OPTION_ALLOW_ELSE_IF] = false, _a), option);
}
function walk(ctx) {
    var ifStatementStack = [];
    function visitIfStatement(node) {
        var jumpStatement = utils.isBlock(node.thenStatement)
            ? getJumpStatement(getLastStatement(node.thenStatement))
            : getJumpStatement(node.thenStatement);
        ifStatementStack.push({ node: node, jumpStatement: jumpStatement });
        if (jumpStatement !== undefined &&
            node.elseStatement !== undefined &&
            !recentStackParentMissingJumpStatement() &&
            (!utils.isIfStatement(node.elseStatement) || !ctx.options[OPTION_ALLOW_ELSE_IF])) {
            var elseKeyword = getPositionOfElseKeyword(node, ts.SyntaxKind.ElseKeyword);
            ctx.addFailureAtNode(elseKeyword, Rule.FAILURE_STRING(jumpStatement));
        }
        ts.forEachChild(node, visitNode);
        ifStatementStack.pop();
    }
    function recentStackParentMissingJumpStatement() {
        if (ifStatementStack.length <= 1) {
            return false;
        }
        for (var i = ifStatementStack.length - 2; i >= 0; i -= 1) {
            var _a = ifStatementStack[i], jumpStatement = _a.jumpStatement, node = _a.node;
            if (node.elseStatement !== ifStatementStack[i + 1].node) {
                return false;
            }
            if (jumpStatement === undefined) {
                return true;
            }
        }
        return false;
    }
    function visitNode(node) {
        if (utils.isIfStatement(node)) {
            visitIfStatement(node);
        }
        else {
            ts.forEachChild(node, visitNode);
        }
    }
    ts.forEachChild(ctx.sourceFile, visitNode);
}
function getPositionOfElseKeyword(node, kind) {
    return node.getChildren().filter(function (child) { return child.kind === kind; })[0];
}
function getJumpStatement(node) {
    if (node === undefined) {
        return undefined;
    }
    switch (node.kind) {
        case ts.SyntaxKind.BreakStatement:
            return "break";
        case ts.SyntaxKind.ContinueStatement:
            return "continue";
        case ts.SyntaxKind.ThrowStatement:
            return "throw";
        case ts.SyntaxKind.ReturnStatement:
            return "return";
        default:
            return undefined;
    }
}
function getLastStatement(clause) {
    var block = clause.statements[0];
    var statements = clause.statements.length === 1 && utils.isBlock(block)
        ? block.statements
        : clause.statements;
    return last(statements);
}
function last(arr) {
    return arr[arr.length - 1];
}
var templateObject_1, templateObject_2, templateObject_3;
