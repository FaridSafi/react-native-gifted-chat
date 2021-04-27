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
var Lint = require("..");
var OPTION_VALUE_NEVER = "never";
var OPTION_KEY_PROPERTY = "property";
var OPTION_KEY_METHOD = "method";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.getLonghandPropertyErrorMessage = function (nodeText) {
        return "Expected property shorthand in object literal ('" + nodeText + "').";
    };
    Rule.getLonghandMethodErrorMessage = function (nodeText) {
        return "Expected method shorthand in object literal ('" + nodeText + "').";
    };
    Rule.getDisallowedShorthandErrorMessage = function (options) {
        if (options.enforceShorthandMethods && !options.enforceShorthandProperties) {
            return "Shorthand property assignments have been disallowed.";
        }
        else if (!options.enforceShorthandMethods && options.enforceShorthandProperties) {
            return "Shorthand method assignments have been disallowed.";
        }
        return "Shorthand property and method assignments have been disallowed.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.ruleArguments));
    };
    Rule.prototype.parseOptions = function (options) {
        if (options.indexOf(OPTION_VALUE_NEVER) !== -1) {
            return {
                enforceShorthandMethods: false,
                enforceShorthandProperties: false,
            };
        }
        var optionsObject = options.find(function (el) {
            return typeof el === "object" &&
                (el[OPTION_KEY_PROPERTY] === OPTION_VALUE_NEVER ||
                    el[OPTION_KEY_METHOD] === OPTION_VALUE_NEVER);
        });
        if (optionsObject !== undefined) {
            return {
                enforceShorthandMethods: !(optionsObject[OPTION_KEY_METHOD] === OPTION_VALUE_NEVER),
                enforceShorthandProperties: !(optionsObject[OPTION_KEY_PROPERTY] === OPTION_VALUE_NEVER),
            };
        }
        else {
            return {
                enforceShorthandMethods: true,
                enforceShorthandProperties: true,
            };
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "object-literal-shorthand",
        description: "Enforces/disallows use of ES6 object literal shorthand.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        `\"always\"` assumed to be default option, thus with no options provided\n        the rule enforces object literal methods and properties shorthands.\n        With `\"never\"` option provided, any shorthand object literal syntax causes an error.\n\n        The rule can be configured in a more granular way.\n        With `{\"property\": \"never\"}` provided (which is equivalent to `{\"property\": \"never\", \"method\": \"always\"}`),\n        the rule only flags property shorthand assignments,\n        and respectively with `{\"method\": \"never\"}` (equivalent to `{\"property\": \"always\", \"method\": \"never\"}`),\n        the rule fails only on method shorthands."], ["\n        \\`\"always\"\\` assumed to be default option, thus with no options provided\n        the rule enforces object literal methods and properties shorthands.\n        With \\`\"never\"\\` option provided, any shorthand object literal syntax causes an error.\n\n        The rule can be configured in a more granular way.\n        With \\`{\"property\": \"never\"}\\` provided (which is equivalent to \\`{\"property\": \"never\", \"method\": \"always\"}\\`),\n        the rule only flags property shorthand assignments,\n        and respectively with \\`{\"method\": \"never\"}\\` (equivalent to \\`{\"property\": \"always\", \"method\": \"never\"}\\`),\n        the rule fails only on method shorthands."]))),
        options: {
            oneOf: [
                {
                    type: "string",
                    enum: [OPTION_VALUE_NEVER],
                },
                {
                    type: "object",
                    properties: (_a = {},
                        _a[OPTION_KEY_PROPERTY] = {
                            type: "string",
                            enum: [OPTION_VALUE_NEVER],
                        },
                        _a[OPTION_KEY_METHOD] = {
                            type: "string",
                            enum: [OPTION_VALUE_NEVER],
                        },
                        _a),
                    minProperties: 1,
                    maxProperties: 2,
                },
            ],
        },
        optionExamples: [
            true,
            [true, OPTION_VALUE_NEVER],
            [true, (_b = {}, _b[OPTION_KEY_PROPERTY] = OPTION_VALUE_NEVER, _b)],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.LONGHAND_PROPERTY = "Expected property shorthand in object literal ";
    Rule.LONGHAND_METHOD = "Expected method shorthand in object literal ";
    Rule.SHORTHAND_ASSIGNMENT = "Shorthand property assignments have been disallowed.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var _a = ctx.options, enforceShorthandMethods = _a.enforceShorthandMethods, enforceShorthandProperties = _a.enforceShorthandProperties;
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (enforceShorthandProperties &&
            tsutils_1.isPropertyAssignment(node) &&
            node.name.kind === ts.SyntaxKind.Identifier &&
            tsutils_1.isIdentifier(node.initializer) &&
            node.name.text === node.initializer.text) {
            ctx.addFailureAtNode(node, Rule.getLonghandPropertyErrorMessage("{" + node.name.text + "}"), Lint.Replacement.deleteFromTo(node.name.end, node.end));
        }
        else if (enforceShorthandMethods &&
            tsutils_1.isPropertyAssignment(node) &&
            tsutils_1.isFunctionExpression(node.initializer) &&
            // allow named function expressions
            node.initializer.name === undefined) {
            var _a = handleLonghandMethod(node.name, node.initializer, ctx.sourceFile), name = _a[0], fix = _a[1];
            ctx.addFailure(node.getStart(ctx.sourceFile), tsutils_1.getChildOfKind(node.initializer, ts.SyntaxKind.OpenParenToken, ctx.sourceFile).pos, Rule.getLonghandMethodErrorMessage("{" + name + "() {...}}"), fix);
        }
        else if (!enforceShorthandProperties && tsutils_1.isShorthandPropertyAssignment(node)) {
            ctx.addFailureAtNode(node.name, Rule.getDisallowedShorthandErrorMessage(ctx.options), Lint.Replacement.appendText(node.getStart(ctx.sourceFile), node.name.text + ": "));
        }
        else if (!enforceShorthandMethods &&
            tsutils_1.isMethodDeclaration(node) &&
            node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            ctx.addFailureAtNode(node.name, Rule.getDisallowedShorthandErrorMessage(ctx.options), fixShorthandMethodDeclaration(node, ctx.sourceFile));
        }
        return ts.forEachChild(node, cb);
    });
}
function fixShorthandMethodDeclaration(node, sourceFile) {
    var isGenerator = node.asteriskToken !== undefined;
    var isAsync = tsutils_1.hasModifier(node.modifiers, ts.SyntaxKind.AsyncKeyword);
    return Lint.Replacement.replaceFromTo(node.getStart(sourceFile), node.name.end, node.name.getText(sourceFile) + ":" + (isAsync ? " async" : "") + " function" + (isGenerator ? "*" : ""));
}
function handleLonghandMethod(name, initializer, sourceFile) {
    var nameStart = name.getStart(sourceFile);
    var fix = Lint.Replacement.deleteFromTo(name.end, tsutils_1.getChildOfKind(initializer, ts.SyntaxKind.OpenParenToken).pos);
    var prefix = "";
    if (initializer.asteriskToken !== undefined) {
        prefix = "*";
    }
    if (tsutils_1.hasModifier(initializer.modifiers, ts.SyntaxKind.AsyncKeyword)) {
        prefix = "async " + prefix;
    }
    if (prefix !== "") {
        fix = [fix, Lint.Replacement.appendText(nameStart, prefix)];
    }
    return [prefix + sourceFile.text.substring(nameStart, name.end), fix];
}
var templateObject_1;
