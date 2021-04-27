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
var error_1 = require("../error");
var Lint = require("../index");
var objectLiteralSortKeys_examples_1 = require("./code-examples/objectLiteralSortKeys.examples");
var OPTION_IGNORE_BLANK_LINES = "ignore-blank-lines";
var OPTION_IGNORE_CASE = "ignore-case";
var OPTION_LOCALE_COMPARE = "locale-compare";
var OPTION_MATCH_DECLARATION_ORDER = "match-declaration-order";
var OPTION_MATCH_DECLARATION_ORDER_ONLY = "match-declaration-order-only";
var OPTION_SHORTHAND_FIRST = "shorthand-first";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_ALPHABETICAL = function (name) {
        return "The key '" + name + "' is not sorted alphabetically";
    };
    Rule.FAILURE_STRING_USE_DECLARATION_ORDER = function (propName, typeName) {
        var type = typeName === undefined ? "its type declaration" : "'" + typeName + "'";
        return "The key '" + propName + "' is not in the same order as it is in " + type + ".";
    };
    Rule.FAILURE_STRING_SHORTHAND_FIRST = function (name) {
        return "The shorthand property '" + name + "' should appear before normal properties";
    };
    Rule.prototype.apply = function (sourceFile) {
        var options = parseOptions(this.ruleArguments);
        if (options.matchDeclarationOrder || options.matchDeclarationOrderOnly) {
            error_1.showWarningOnce(Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n                    ", " needs type info to use \"", "\" or\n                    \"", "\".\n                    See https://palantir.github.io/tslint/usage/type-checking/ for documentation on\n                    how to enable this feature.\n                "], ["\n                    ", " needs type info to use \"", "\" or\n                    \"", "\".\n                    See https://palantir.github.io/tslint/usage/type-checking/ for documentation on\n                    how to enable this feature.\n                "])), this.ruleName, OPTION_MATCH_DECLARATION_ORDER, OPTION_MATCH_DECLARATION_ORDER_ONLY));
            return [];
        }
        return this.applyWithFunction(sourceFile, walk, options);
    };
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        var options = parseOptions(this.ruleArguments);
        if (options.matchDeclarationOrder && options.matchDeclarationOrderOnly) {
            error_1.showWarningOnce("\"" + OPTION_MATCH_DECLARATION_ORDER + "\" will be ignored since " +
                ("\"" + OPTION_MATCH_DECLARATION_ORDER_ONLY + "\" has been enabled for " + this.ruleName + "."));
            return [];
        }
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments), program.getTypeChecker());
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "object-literal-sort-keys",
        description: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Checks ordering of keys in object literals.\n\n            When using the default alphabetical ordering, additional blank lines may be used to group\n            object properties together while keeping the elements within each group in alphabetical order.\n            To opt out of this use ", " option.\n        "], ["\n            Checks ordering of keys in object literals.\n\n            When using the default alphabetical ordering, additional blank lines may be used to group\n            object properties together while keeping the elements within each group in alphabetical order.\n            To opt out of this use ", " option.\n        "])), OPTION_IGNORE_BLANK_LINES),
        rationale: "Useful in preventing merge conflicts",
        optionsDescription: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            By default, this rule checks that keys are in alphabetical order.\n            The following may optionally be passed:\n\n            * `", "` will enforce alphabetical ordering regardless of blank lines between each key-value pair.\n            * `", "` will compare keys in a case insensitive way.\n            * `", "` will compare keys using the expected sort order of special characters, such as accents.\n            * `", "` will prefer to use the key ordering of the contextual type of the object literal, as in:\n\n                ```\n                interface I { foo: number; bar: number; }\n                const obj: I = { foo: 1, bar: 2 };\n                ```\n\n            If a contextual type is not found, alphabetical ordering will be used instead.\n            * \"", "\" exactly like \"", "\",\n                but don't fall back to alphabetical if a contextual type is not found.\n\n                Note: If both ", " and ", " options are present,\n                      ", " will take precedence and alphabetical fallback will not occur.\n\n            * `", "` will enforce shorthand properties to appear first, as in:\n\n                ```\n                const obj = { a, c, b: true };\n                ```\n            "], ["\n            By default, this rule checks that keys are in alphabetical order.\n            The following may optionally be passed:\n\n            * \\`", "\\` will enforce alphabetical ordering regardless of blank lines between each key-value pair.\n            * \\`", "\\` will compare keys in a case insensitive way.\n            * \\`", "\\` will compare keys using the expected sort order of special characters, such as accents.\n            * \\`", "\\` will prefer to use the key ordering of the contextual type of the object literal, as in:\n\n                \\`\\`\\`\n                interface I { foo: number; bar: number; }\n                const obj: I = { foo: 1, bar: 2 };\n                \\`\\`\\`\n\n            If a contextual type is not found, alphabetical ordering will be used instead.\n            * \"", "\" exactly like \"", "\",\n                but don't fall back to alphabetical if a contextual type is not found.\n\n                Note: If both ", " and ", " options are present,\n                      ", " will take precedence and alphabetical fallback will not occur.\n\n            * \\`", "\\` will enforce shorthand properties to appear first, as in:\n\n                \\`\\`\\`\n                const obj = { a, c, b: true };\n                \\`\\`\\`\n            "])), OPTION_IGNORE_BLANK_LINES, OPTION_IGNORE_CASE, OPTION_LOCALE_COMPARE, OPTION_MATCH_DECLARATION_ORDER, OPTION_MATCH_DECLARATION_ORDER_ONLY, OPTION_MATCH_DECLARATION_ORDER, OPTION_MATCH_DECLARATION_ORDER_ONLY, OPTION_MATCH_DECLARATION_ORDER, OPTION_MATCH_DECLARATION_ORDER_ONLY, OPTION_SHORTHAND_FIRST),
        options: {
            type: "string",
            enum: [
                OPTION_IGNORE_BLANK_LINES,
                OPTION_IGNORE_CASE,
                OPTION_LOCALE_COMPARE,
                OPTION_MATCH_DECLARATION_ORDER,
                OPTION_MATCH_DECLARATION_ORDER_ONLY,
                OPTION_SHORTHAND_FIRST,
            ],
        },
        optionExamples: [
            true,
            [
                true,
                OPTION_IGNORE_BLANK_LINES,
                OPTION_IGNORE_CASE,
                OPTION_LOCALE_COMPARE,
                OPTION_MATCH_DECLARATION_ORDER,
                OPTION_SHORTHAND_FIRST,
            ],
        ],
        type: "maintainability",
        typescriptOnly: false,
        codeExamples: objectLiteralSortKeys_examples_1.codeExamples,
    };
    return Rule;
}(Lint.Rules.OptionallyTypedRule));
exports.Rule = Rule;
function parseOptions(ruleArguments) {
    return {
        ignoreBlankLines: has(OPTION_IGNORE_BLANK_LINES),
        ignoreCase: has(OPTION_IGNORE_CASE),
        localeCompare: has(OPTION_LOCALE_COMPARE),
        matchDeclarationOrder: has(OPTION_MATCH_DECLARATION_ORDER),
        matchDeclarationOrderOnly: has(OPTION_MATCH_DECLARATION_ORDER_ONLY),
        shorthandFirst: has(OPTION_SHORTHAND_FIRST),
    };
    function has(name) {
        return ruleArguments.indexOf(name) !== -1;
    }
}
function walk(ctx, checker) {
    var sourceFile = ctx.sourceFile, _a = ctx.options, ignoreBlankLines = _a.ignoreBlankLines, ignoreCase = _a.ignoreCase, localeCompare = _a.localeCompare, matchDeclarationOrder = _a.matchDeclarationOrder, matchDeclarationOrderOnly = _a.matchDeclarationOrderOnly, shorthandFirst = _a.shorthandFirst;
    ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isObjectLiteralExpression(node) && node.properties.length > 1) {
            check(node);
        }
        ts.forEachChild(node, cb);
    });
    function check(node) {
        if (matchDeclarationOrder || matchDeclarationOrderOnly) {
            var type = getContextualType(node, checker);
            // If type has an index signature, we can't check ordering.
            // If type has call/construct signatures, it can't be satisfied by an object literal anyway.
            if (type !== undefined &&
                type.members.every(function (m) {
                    return m.kind === ts.SyntaxKind.PropertySignature ||
                        m.kind === ts.SyntaxKind.MethodSignature;
                })) {
                checkMatchesDeclarationOrder(node, type, type.members);
                return;
            }
        }
        if (!matchDeclarationOrderOnly) {
            checkAlphabetical(node);
        }
    }
    function checkAlphabetical(node) {
        if (tsutils_1.isSameLine(ctx.sourceFile, node.properties.pos, node.end)) {
            return;
        }
        var lastKey;
        var lastPropertyWasShorthand;
        for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
            var property = _a[_i];
            switch (property.kind) {
                case ts.SyntaxKind.SpreadAssignment:
                    lastKey = undefined; // reset at spread
                    lastPropertyWasShorthand = undefined; // reset at spread
                    break;
                case ts.SyntaxKind.ShorthandPropertyAssignment:
                case ts.SyntaxKind.PropertyAssignment:
                    if (shorthandFirst) {
                        if (property.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
                            if (lastPropertyWasShorthand === false) {
                                ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_SHORTHAND_FIRST(property.name.text));
                                return; // only show warning on first out-of-order property
                            }
                            lastPropertyWasShorthand = true;
                        }
                        else {
                            if (lastPropertyWasShorthand === true) {
                                lastKey = undefined; // reset on change from shorthand to normal
                            }
                            lastPropertyWasShorthand = false;
                        }
                    }
                    if (property.name.kind === ts.SyntaxKind.Identifier ||
                        property.name.kind === ts.SyntaxKind.StringLiteral) {
                        var key = ignoreCase
                            ? property.name.text.toLowerCase()
                            : property.name.text;
                        // comparison with undefined is expected
                        var keyOrderDescending = lastKey === undefined
                            ? false
                            : localeCompare
                                ? lastKey.localeCompare(key) === 1
                                : lastKey > key;
                        if (keyOrderDescending && ignoreBlankLines) {
                            ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_ALPHABETICAL(property.name.text));
                            return;
                        }
                        if (keyOrderDescending && !hasBlankLineBefore(ctx.sourceFile, property)) {
                            ctx.addFailureAtNode(property.name, Rule.FAILURE_STRING_ALPHABETICAL(property.name.text));
                            return; // only show warning on first out-of-order property
                        }
                        lastKey = key;
                    }
            }
        }
    }
    function checkMatchesDeclarationOrder(_a, type, members) {
        var properties = _a.properties;
        var memberIndex = 0;
        outer: for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            if (prop.kind === ts.SyntaxKind.SpreadAssignment) {
                memberIndex = 0;
                continue;
            }
            if (prop.name.kind === ts.SyntaxKind.ComputedPropertyName) {
                continue;
            }
            var propName = prop.name.text;
            for (; memberIndex !== members.length; memberIndex++) {
                var memberName = members[memberIndex].name;
                if (memberName.kind !== ts.SyntaxKind.ComputedPropertyName &&
                    propName === memberName.text) {
                    continue outer;
                }
            }
            // This We didn't find the member we were looking for past the previous member,
            // so it must have come before it and is therefore out of order.
            ctx.addFailureAtNode(prop.name, Rule.FAILURE_STRING_USE_DECLARATION_ORDER(propName, getTypeName(type)));
            // Don't bother with multiple errors.
            break;
        }
    }
}
function hasBlankLineBefore(sourceFile, element) {
    var comments = ts.getLeadingCommentRanges(sourceFile.text, element.pos);
    if (comments === undefined) {
        comments = []; // it will be easier to work with an empty array down below...
    }
    var elementStart = comments.length > 0 ? comments[comments.length - 1].end : element.getFullStart();
    // either the element itself, or one of its leading comments must have an extra new line before them
    return (hasDoubleNewLine(sourceFile, elementStart) ||
        comments.some(function (comment) {
            var commentLine = ts.getLineAndCharacterOfPosition(sourceFile, comment.pos).line;
            var commentLineStartPosition = ts.getPositionOfLineAndCharacter(sourceFile, commentLine, 0);
            return hasDoubleNewLine(sourceFile, commentLineStartPosition - 4);
        }));
}
function hasDoubleNewLine(sourceFile, position) {
    return /(\r?\n){2}/.test(sourceFile.text.slice(position, position + 4));
}
function getTypeName(t) {
    var parent = t.parent;
    return t.kind === ts.SyntaxKind.InterfaceDeclaration
        ? t.name.text
        : tsutils_1.isTypeAliasDeclaration(parent)
            ? parent.name.text
            : undefined;
}
function getContextualType(node, checker) {
    var c = checker.getContextualType(node);
    if (c === undefined || c.symbol === undefined) {
        return undefined;
    }
    var declarations = c.symbol.declarations;
    if (declarations === undefined || declarations.length !== 1) {
        return undefined;
    }
    var decl = declarations[0];
    return tsutils_1.isInterfaceDeclaration(decl) || tsutils_1.isTypeLiteralNode(decl) ? decl : undefined;
}
var templateObject_1, templateObject_2, templateObject_3;
