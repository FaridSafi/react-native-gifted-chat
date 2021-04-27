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
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("..");
var OPTION_FUNCTION_IN_METHOD = "check-function-in-method";
var DEPRECATED_OPTION_FUNCTION_IN_METHOD = "no-this-in-function-in-method";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        var hasOption = function (name) { return _this.ruleArguments.indexOf(name) !== -1; };
        var checkFuncInMethod = hasOption(DEPRECATED_OPTION_FUNCTION_IN_METHOD) || hasOption(OPTION_FUNCTION_IN_METHOD);
        return this.applyWithFunction(sourceFile, walk, checkFuncInMethod);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-invalid-this",
        description: "Disallows using the `this` keyword outside of classes.",
        rationale: "See [the rule's author's rationale here.](https://github.com/palantir/tslint/pull/1105#issue-147549402)",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            One argument may be optionally provided:\n\n            * `", "` disallows using the `this` keyword in functions within class methods."], ["\n            One argument may be optionally provided:\n\n            * \\`", "\\` disallows using the \\`this\\` keyword in functions within class methods."])), OPTION_FUNCTION_IN_METHOD),
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [OPTION_FUNCTION_IN_METHOD],
            },
            minLength: 0,
            maxLength: 1,
        },
        optionExamples: [true, [true, OPTION_FUNCTION_IN_METHOD]],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_OUTSIDE = 'the "this" keyword is disallowed outside of a class body';
    Rule.FAILURE_STRING_INSIDE = 'the "this" keyword is disallowed in function bodies inside class methods, ' +
        "use arrow functions instead";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var thisAllowedParents = new Set([2 /* ClassMethod */, 3 /* BoundRegularFunction */]);
function walk(ctx) {
    var sourceFile = ctx.sourceFile, checkFuncInMethod = ctx.options;
    var currentParent = 0 /* None */;
    var inClass = false;
    ts.forEachChild(sourceFile, function cb(node) {
        var originalParent = currentParent;
        var originalInClass = inClass;
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                inClass = true;
                currentParent = 1 /* Class */;
                ts.forEachChild(node, cb);
                currentParent = originalParent;
                inClass = originalInClass;
                return;
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
                if (currentParent === 1 /* Class */) {
                    currentParent = 2 /* ClassMethod */;
                    ts.forEachChild(node, cb);
                    currentParent = originalParent;
                    return;
                }
                else {
                    currentParent = node.parameters.some(tsutils_1.isThisParameter)
                        ? 3 /* BoundRegularFunction */
                        : 4 /* UnboundRegularFunction */;
                    ts.forEachChild(node, cb);
                    currentParent = originalParent;
                    return;
                }
            case ts.SyntaxKind.ThisKeyword:
                if (!thisAllowedParents.has(currentParent)) {
                    if (!inClass) {
                        ctx.addFailureAtNode(node, Rule.FAILURE_STRING_OUTSIDE);
                    }
                    else if (checkFuncInMethod) {
                        ctx.addFailureAtNode(node, Rule.FAILURE_STRING_INSIDE);
                    }
                }
                return;
        }
        ts.forEachChild(node, cb);
    });
}
var templateObject_1;
