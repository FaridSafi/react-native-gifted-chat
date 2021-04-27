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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var noPromiseAsBoolean_examples_1 = require("./code-examples/noPromiseAsBoolean.examples");
var OPTION_PROMISE_CLASSES = "promise-classes";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        // tslint:disable-next-line: no-object-literal-type-assertion
        var rawOptions = tslib_1.__assign({}, this.ruleArguments[0]);
        var promiseClasses = rawOptions[OPTION_PROMISE_CLASSES] !== undefined
            ? rawOptions[OPTION_PROMISE_CLASSES]
            : [];
        return this.applyWithFunction(sourceFile, walk, { promiseClasses: tslib_1.__spreadArrays(["Promise"], promiseClasses) }, program.getTypeChecker());
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-promise-as-boolean",
        description: "Warns for Promises that are used for boolean conditions.",
        descriptionDetails: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            For the most accurate findings, set `\"strict\": true` in your `tsconfig.json`.\n\n            It's recommended to enable the following rules as well:\n            * [`strict-boolean-expressions`](https://palantir.github.io/tslint/rules/strict-boolean-expressions/)\n            * [`strict-type-predicates`](https://palantir.github.io/tslint/rules/strict-type-predicates/)\n            * [`no-floating-promises`](https://palantir.github.io/tslint/rules/no-floating-promises/)\n        "], ["\n            For the most accurate findings, set \\`\"strict\": true\\` in your \\`tsconfig.json\\`.\n\n            It's recommended to enable the following rules as well:\n            * [\\`strict-boolean-expressions\\`](https://palantir.github.io/tslint/rules/strict-boolean-expressions/)\n            * [\\`strict-type-predicates\\`](https://palantir.github.io/tslint/rules/strict-type-predicates/)\n            * [\\`no-floating-promises\\`](https://palantir.github.io/tslint/rules/no-floating-promises/)\n        "]))),
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            A list of 'string' names of any additional classes that should also be treated as Promises.\n            For example, if you are using a class called 'Future' that implements the Thenable interface,\n            you might tell the rule to consider type references with the name 'Future' as valid Promise-like\n            types. Note that this rule doesn't check for type assignability or compatibility; it just checks\n            type reference names.\n        "], ["\n            A list of 'string' names of any additional classes that should also be treated as Promises.\n            For example, if you are using a class called 'Future' that implements the Thenable interface,\n            you might tell the rule to consider type references with the name 'Future' as valid Promise-like\n            types. Note that this rule doesn't check for type assignability or compatibility; it just checks\n            type reference names.\n        "]))),
        options: {
            type: "object",
            properties: (_a = {},
                _a[OPTION_PROMISE_CLASSES] = {
                    type: "array",
                    items: { type: "string" },
                },
                _a),
        },
        optionExamples: [true, [true, { OPTION_PROMISE_CLASSES: ["Thenable"] }]],
        rationale: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            There are no situations where one would like to check whether a variable's value is truthy if its type\n            only is Promise.\n            This may only occur when the typings are incorrect or the variable has a union type\n            (like Promise | undefined), of which the latter is allowed.\n\n            This rule prevents common bugs from forgetting to 'await' a Promise.\n        "], ["\n            There are no situations where one would like to check whether a variable's value is truthy if its type\n            only is Promise.\n            This may only occur when the typings are incorrect or the variable has a union type\n            (like Promise | undefined), of which the latter is allowed.\n\n            This rule prevents common bugs from forgetting to 'await' a Promise.\n        "]))),
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
        codeExamples: noPromiseAsBoolean_examples_1.codeExamples,
    };
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
var RULE_MESSAGE = "Promises are not allowed as boolean.";
function walk(context, checker) {
    var sourceFile = context.sourceFile;
    return ts.forEachChild(sourceFile, cb);
    function cb(node) {
        if (isBooleanBinaryExpression(node)) {
            var left = node.left, right = node.right;
            if (!isBooleanBinaryExpression(left)) {
                checkExpression(left);
            }
            if (!isBooleanBinaryExpression(right)) {
                checkExpression(right);
            }
        }
        else if (tsutils_1.isPrefixUnaryExpression(node)) {
            var operator = node.operator, operand = node.operand;
            if (operator === ts.SyntaxKind.ExclamationToken) {
                checkExpression(operand);
            }
        }
        else if (tsutils_1.isIfStatement(node) || tsutils_1.isWhileStatement(node) || tsutils_1.isDoStatement(node)) {
            // If it's a boolean binary expression, we'll check it when recursing.
            if (!isBooleanBinaryExpression(node.expression)) {
                checkExpression(node.expression);
            }
        }
        else if (tsutils_1.isConditionalExpression(node)) {
            checkExpression(node.condition);
        }
        else if (tsutils_1.isForStatement(node)) {
            var condition = node.condition;
            if (condition !== undefined) {
                checkExpression(condition);
            }
        }
        return ts.forEachChild(node, cb);
    }
    function checkExpression(expression) {
        var mainType = checker.getTypeAtLocation(expression);
        if (isPromiseType(mainType) ||
            (tsutils_1.isUnionType(mainType) && mainType.types.every(isPromiseType))) {
            context.addFailureAtNode(expression, RULE_MESSAGE);
        }
    }
    function isPromiseType(type) {
        var promiseClasses = context.options.promiseClasses;
        return type.symbol !== undefined && promiseClasses.indexOf(type.symbol.name) !== -1;
    }
}
/** Matches `&&` and `||` operators. */
function isBooleanBinaryExpression(expression) {
    return (tsutils_1.isBinaryExpression(expression) &&
        (expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
            expression.operatorToken.kind === ts.SyntaxKind.BarBarToken));
}
var templateObject_1, templateObject_2, templateObject_3;
