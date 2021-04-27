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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var utils_1 = require("../language/utils");
var NUMBER_METHODS = new Set(["toExponential", "toFixed", "toPrecision", "toString"]);
var IGNORE_JSX_OPTION = "ignore-jsx";
var ALLOWED_NUMBERS_OPTION = "allowed-numbers";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING = function (num) {
        return "'magic numbers' are not allowed: " + num;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, this.ruleArguments.length > 0
            ? parseOptions(this.ruleArguments)
            : parseOptions(Rule.DEFAULT_ALLOWED)));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Magic numbers should be avoided as they often lack documentation.\n            Forcing them to be stored in variables gives them implicit documentation.\n        "], ["\n            Magic numbers should be avoided as they often lack documentation.\n            Forcing them to be stored in variables gives them implicit documentation.\n        "]))),
        optionsDescription: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            Options may either be a list of numbers to ignore (not consider 'magic'), or an object containing up to two properties:\n            * `", "` as the list of numbers to ignore.\n            * `", "` to specify that 'magic' numbers should be allowed as JSX attributes."], ["\n            Options may either be a list of numbers to ignore (not consider 'magic'), or an object containing up to two properties:\n            * \\`", "\\` as the list of numbers to ignore.\n            * \\`", "\\` to specify that 'magic' numbers should be allowed as JSX attributes."])), ALLOWED_NUMBERS_OPTION, IGNORE_JSX_OPTION),
        options: {
            type: "array",
            items: {
                type: "number",
            },
            properties: (_a = {
                    type: "object"
                },
                _a[ALLOWED_NUMBERS_OPTION] = {
                    type: "array",
                },
                _a[IGNORE_JSX_OPTION] = {
                    type: "boolean",
                },
                _a),
            minLength: 1,
        },
        optionExamples: [
            [true, 1, 2, 3],
            [
                true,
                (_b = {},
                    _b[ALLOWED_NUMBERS_OPTION] = [1, 2, 3],
                    _b[IGNORE_JSX_OPTION] = true,
                    _b),
            ],
        ],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.ALLOWED_NODES = new Set([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);
    Rule.DEFAULT_ALLOWED = [-1, 0, 1];
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function parseOptions(options) {
    var _a;
    var parsedOptions = (_a = {}, _a[ALLOWED_NUMBERS_OPTION] = [], _a);
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var option = options_1[_i];
        if (typeof option === "number") {
            parsedOptions[ALLOWED_NUMBERS_OPTION].push(option);
            continue;
        }
        if (option.hasOwnProperty(ALLOWED_NUMBERS_OPTION)) {
            var numberOptions = option[ALLOWED_NUMBERS_OPTION];
            if (Array.isArray(numberOptions) && numberOptions.length > 0) {
                numberOptions.forEach(function (num) {
                    return parsedOptions[ALLOWED_NUMBERS_OPTION].push(num);
                });
            }
        }
        if (option.hasOwnProperty(IGNORE_JSX_OPTION)) {
            parsedOptions[IGNORE_JSX_OPTION] = option[IGNORE_JSX_OPTION];
        }
    }
    return parsedOptions;
}
var NoMagicNumbersWalker = /** @class */ (function (_super) {
    tslib_1.__extends(NoMagicNumbersWalker, _super);
    function NoMagicNumbersWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoMagicNumbersWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (tsutils_1.isCallExpression(node)) {
                if (tsutils_1.isIdentifier(node.expression) && node.expression.text === "parseInt") {
                    return node.arguments.length === 0 ? undefined : cb(node.arguments[0]);
                }
                if (tsutils_1.isPropertyAccessExpression(node.expression) &&
                    NUMBER_METHODS.has(node.expression.name.text)) {
                    return;
                }
            }
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return _this.checkNumericLiteral(node, node.text);
            }
            if (utils_1.isNegativeNumberLiteral(node)) {
                return _this.checkNumericLiteral(node, "-" + node.operand.text);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    NoMagicNumbersWalker.prototype.isAllowedNumber = function (num) {
        var numberOptions = this.options[ALLOWED_NUMBERS_OPTION];
        if (numberOptions.length > 0) {
            return numberOptions.some(function (allowedNum) {
                /* Using Object.is() to differentiate between pos/neg zero */
                return Object.is(allowedNum, parseFloat(num));
            });
        }
        return false;
    };
    NoMagicNumbersWalker.prototype.checkNumericLiteral = function (node, num) {
        var shouldIgnoreJsxExpression = node.parent.kind === ts.SyntaxKind.JsxExpression &&
            this.options[IGNORE_JSX_OPTION];
        if (!Rule.ALLOWED_NODES.has(node.parent.kind) &&
            !this.isAllowedNumber(num) &&
            !shouldIgnoreJsxExpression) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING(num));
        }
    };
    return NoMagicNumbersWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3;
