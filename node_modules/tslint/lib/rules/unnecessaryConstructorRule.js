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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var rule_1 = require("../language/rule/rule");
var OPTION_CHECK_SUPER_CALL = "check-super-calls";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = {
            checkSuperCall: this.ruleArguments.length !== 0 &&
                this.ruleArguments[0]["check-super-calls"] === true,
        };
        return this.applyWithFunction(sourceFile, walk, options);
    };
    Rule.metadata = {
        description: "Prevents blank constructors, as they are redundant.",
        optionExamples: [true, [true, (_a = {}, _a[OPTION_CHECK_SUPER_CALL] = true, _a)]],
        options: {
            properties: (_b = {},
                _b[OPTION_CHECK_SUPER_CALL] = { type: "boolean" },
                _b),
            type: "object",
        },
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            An optional object with the property '", "'.\n            This is to check for unnecessary constructor parameters for super call"], ["\n            An optional object with the property '", "'.\n            This is to check for unnecessary constructor parameters for super call"])), OPTION_CHECK_SUPER_CALL),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            JavaScript implicitly adds a blank constructor when there isn't one.\n            It's not necessary to manually add one in.\n        "], ["\n            JavaScript implicitly adds a blank constructor when there isn't one.\n            It's not necessary to manually add one in.\n        "]))),
        ruleName: "unnecessary-constructor",
        type: "functionality",
        typescriptOnly: false,
    };
    Rule.FAILURE_STRING = "Remove unnecessary empty constructor.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var containsSuper = function (statement, constructorParameters) {
    if (tsutils_1.isExpressionStatement(statement) &&
        tsutils_1.isCallExpression(statement.expression) &&
        ts.SyntaxKind.SuperKeyword === statement.expression.expression.kind) {
        var superArguments = statement.expression.arguments;
        if (superArguments.length < constructorParameters.length) {
            return true;
        }
        if (superArguments.length === constructorParameters.length) {
            if (constructorParameters.length === 0) {
                return true;
            }
            for (var _i = 0, constructorParameters_1 = constructorParameters; _i < constructorParameters_1.length; _i++) {
                var constructorParameter = constructorParameters_1[_i];
                for (var _a = 0, superArguments_1 = superArguments; _a < superArguments_1.length; _a++) {
                    var superArgument = superArguments_1[_a];
                    if (constructorParameter.name.kind !== superArgument.kind) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    return false;
};
var isEmptyOrContainsOnlySuper = function (node, options) {
    if (node.body !== undefined) {
        var checkSuperCall = options.checkSuperCall;
        if (node.body.statements.length === 0) {
            return true;
        }
        if (checkSuperCall) {
            return (node.body.statements.length === 1 &&
                containsSuper(node.body.statements[0], node.parameters));
        }
    }
    return false;
};
var containsConstructorParameter = function (node) {
    // If this has any parameter properties
    return node.parameters.some(tsutils_1.isParameterProperty);
};
var isAccessRestrictingConstructor = function (node) {
    // No modifiers implies public
    return node.modifiers != undefined &&
        // If this has any modifier that isn't public, it's doing something
        node.modifiers.some(function (modifier) { return modifier.kind !== ts.SyntaxKind.PublicKeyword; });
};
var containsDecorator = function (node) {
    return node.parameters.some(function (p) { return p.decorators !== undefined; });
};
function walk(context) {
    var callback = function (node) {
        if (tsutils_1.isConstructorDeclaration(node) &&
            isEmptyOrContainsOnlySuper(node, context.options) &&
            !containsConstructorParameter(node) &&
            !containsDecorator(node) &&
            !isAccessRestrictingConstructor(node)) {
            var replacements = [];
            // Since only one constructor implementation is allowed and the one found above is empty, all other overloads can be safely removed.
            for (var _i = 0, _a = node.parent.members; _i < _a.length; _i++) {
                var maybeConstructor = _a[_i];
                if (tsutils_1.isConstructorDeclaration(maybeConstructor)) {
                    replacements.push(rule_1.Replacement.deleteFromTo(maybeConstructor.pos, maybeConstructor.end));
                }
            }
            context.addFailureAtNode(node, Rule.FAILURE_STRING, replacements);
        }
        else {
            ts.forEachChild(node, callback);
        }
    };
    return ts.forEachChild(context.sourceFile, callback);
}
var templateObject_1, templateObject_2;
