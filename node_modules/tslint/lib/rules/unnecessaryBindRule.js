"use strict";
/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    };
    Rule.metadata = {
        description: "Prevents unnecessary and/or misleading scope bindings on functions.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            `function` expressions that are immediately bound to `this` are equivalent to `() =>` arrow lambdas.\n            Additionally, there's no use in binding a scope to an arrow lambda, as it already has one.\n        "], ["\n            \\`function\\` expressions that are immediately bound to \\`this\\` are equivalent to \\`() =>\\` arrow lambdas.\n            Additionally, there's no use in binding a scope to an arrow lambda, as it already has one.\n        "]))),
        requiresTypeInfo: true,
        ruleName: "unnecessary-bind",
        type: "style",
        typescriptOnly: false,
    };
    Rule.FAILURE_STRING_FUNCTION = "Don't bind `this` without arguments as a scope to a function. Use an arrow lambda instead.";
    Rule.FAILURE_STRING_ARROW = "Don't bind scopes to arrow lambdas, as they already have a bound scope.";
    return Rule;
}(Lint.Rules.OptionallyTypedRule));
exports.Rule = Rule;
function walk(context, typeChecker) {
    var variableUsage = tsutils.collectVariableUsage(context.sourceFile);
    function checkArrowFunction(node) {
        if (node.arguments.length !== 1) {
            return;
        }
        context.addFailureAtNode(node, Rule.FAILURE_STRING_ARROW);
    }
    function canFunctionExpressionBeFixed(callExpression, valueDeclaration) {
        if (callExpression.arguments.length !== 1 ||
            callExpression.arguments[0].kind !== ts.SyntaxKind.ThisKeyword ||
            valueDeclaration.asteriskToken !== undefined ||
            valueDeclaration.decorators !== undefined) {
            return false;
        }
        var name = valueDeclaration.name;
        if (name === undefined) {
            return true;
        }
        var nameInfo = variableUsage.get(name);
        return nameInfo === undefined || nameInfo.uses.length === 0;
    }
    function checkFunctionExpression(callExpression, valueDeclaration) {
        if (!canFunctionExpressionBeFixed(callExpression, valueDeclaration)) {
            return;
        }
        context.addFailureAtNode(callExpression, Rule.FAILURE_STRING_FUNCTION);
    }
    function getArrowFunctionDeclaration(node) {
        if (typeChecker === undefined) {
            return undefined;
        }
        var symbol = typeChecker.getTypeAtLocation(node).symbol;
        if (symbol === undefined) {
            return undefined;
        }
        var valueDeclaration = symbol.valueDeclaration;
        if (valueDeclaration === undefined) {
            return undefined;
        }
        if (!tsutils.isArrowFunction(valueDeclaration)) {
            return undefined;
        }
        return valueDeclaration;
    }
    function isDecoratedPropertyMember(node) {
        return (node.parent !== undefined &&
            tsutils.isPropertyDeclaration(node.parent) &&
            node.parent.decorators !== undefined);
    }
    function checkCallExpression(node) {
        if (isDecoratedPropertyMember(node)) {
            return;
        }
        var bindExpression = node.expression;
        if (!isBindPropertyAccess(bindExpression)) {
            return;
        }
        var boundExpression = Lint.unwrapParentheses(bindExpression.expression);
        if (tsutils.isFunctionExpression(boundExpression)) {
            checkFunctionExpression(node, boundExpression);
            return;
        }
        var valueDeclaration = getArrowFunctionDeclaration(boundExpression);
        if (valueDeclaration !== undefined) {
            checkArrowFunction(node);
        }
    }
    return ts.forEachChild(context.sourceFile, function callback(node) {
        if (ts.isCallExpression(node)) {
            checkCallExpression(node);
        }
        return ts.forEachChild(node, callback);
    });
}
function isBindPropertyAccess(node) {
    return ts.isPropertyAccessExpression(node) && node.name.text === "bind";
}
var templateObject_1;
