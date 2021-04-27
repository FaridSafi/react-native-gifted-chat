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
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("..");
var functionConstructor_examples_1 = require("./code-examples/functionConstructor.examples");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.metadata = {
        codeExamples: functionConstructor_examples_1.codeExamples,
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Prevents using the built-in Function constructor.\n        "], ["\n            Prevents using the built-in Function constructor.\n        "]))),
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Calling the constructor directly is similar to `eval`, which is a symptom of design issues.\n            String inputs don't receive type checking and can cause performance issues, particularly when dynamically created.\n            \n            If you need to dynamically create functions, use \"factory\" functions that themselves return functions.\n        "], ["\n            Calling the constructor directly is similar to \\`eval\\`, which is a symptom of design issues.\n            String inputs don't receive type checking and can cause performance issues, particularly when dynamically created.\n            \n            If you need to dynamically create functions, use \"factory\" functions that themselves return functions.\n        "]))),
        ruleName: "function-constructor",
        type: "functionality",
        typescriptOnly: false,
    };
    Rule.FAILURE = "Do not use the Function constructor to create functions.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(context) {
    ts.forEachChild(context.sourceFile, function cb(node) {
        if (isFunctionCallOrNewExpression(node)) {
            addFailureAtNode(node);
        }
        ts.forEachChild(node, cb);
    });
    function addFailureAtNode(node) {
        context.addFailureAtNode(node, Rule.FAILURE);
    }
}
function isFunctionCallOrNewExpression(node) {
    if (tsutils_1.isCallExpression(node) || tsutils_1.isNewExpression(node)) {
        return tsutils_1.isIdentifier(node.expression) && node.expression.text === "Function";
    }
    return false;
}
var templateObject_1, templateObject_2;
