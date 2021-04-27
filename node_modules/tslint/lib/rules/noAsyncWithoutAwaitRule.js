"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var noAsyncWithoutAwait_examples_1 = require("./code-examples/noAsyncWithoutAwait.examples");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.FAILURE_STRING = "Functions marked async must contain an await or return statement.";
    Rule.metadata = {
        codeExamples: noAsyncWithoutAwait_examples_1.codeExamples,
        description: Rule.FAILURE_STRING,
        hasFix: false,
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        /* tslint:disable:max-line-length */
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        Marking a function as `async` without using `await` or returning a value inside it can lead to an unintended promise return and a larger transpiled output.\n        Often the function can be synchronous and the `async` keyword is there by mistake.\n        Return statements are allowed as sometimes it is desirable to wrap the returned value in a Promise."], ["\n        Marking a function as \\`async\\` without using \\`await\\` or returning a value inside it can lead to an unintended promise return and a larger transpiled output.\n        Often the function can be synchronous and the \\`async\\` keyword is there by mistake.\n        Return statements are allowed as sometimes it is desirable to wrap the returned value in a Promise."]))),
        /* tslint:enable:max-line-length */
        ruleName: "no-async-without-await",
        type: "functionality",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(context) {
    var reportFailureIfAsyncFunction = function (node) {
        var asyncModifier = getAsyncModifier(node);
        if (asyncModifier !== undefined) {
            context.addFailureAt(asyncModifier.getStart(), asyncModifier.getEnd() - asyncModifier.getStart(), Rule.FAILURE_STRING);
        }
    };
    var addFailureIfAsyncFunctionHasNoAwait = function (node) {
        if (node.body === undefined) {
            if (node.type === undefined) {
                reportFailureIfAsyncFunction(node);
            }
            return;
        }
        if (!isShortArrowReturn(node) &&
            !functionBlockHasAwait(node.body) &&
            !functionBlockHasReturn(node.body)) {
            reportFailureIfAsyncFunction(node);
        }
    };
    return ts.forEachChild(context.sourceFile, function visitNode(node) {
        if (tsutils.isArrowFunction(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isFunctionExpression(node) ||
            tsutils.isMethodDeclaration(node)) {
            addFailureIfAsyncFunctionHasNoAwait(node);
        }
        return ts.forEachChild(node, visitNode);
    });
}
var getAsyncModifier = function (node) {
    if (node.modifiers !== undefined) {
        return node.modifiers.find(function (modifier) { return modifier.kind === ts.SyntaxKind.AsyncKeyword; });
    }
    return undefined;
};
var isReturn = function (node) { return node.kind === ts.SyntaxKind.ReturnKeyword; };
var functionBlockHasAwait = function (node) {
    if (tsutils.isAwaitExpression(node)) {
        return true;
    }
    if (node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration) {
        return false;
    }
    return node.getChildren().some(functionBlockHasAwait);
};
var functionBlockHasReturn = function (node) {
    if (isReturn(node)) {
        return true;
    }
    if (node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration) {
        return false;
    }
    return node.getChildren().some(functionBlockHasReturn);
};
var isShortArrowReturn = function (node) {
    return node.kind === ts.SyntaxKind.ArrowFunction && node.body.kind !== ts.SyntaxKind.Block;
};
var templateObject_1;
