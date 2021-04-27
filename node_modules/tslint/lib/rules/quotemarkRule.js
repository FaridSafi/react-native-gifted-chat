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
var semver_1 = require("semver");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var parse_1 = require("../verify/parse");
var OPTION_SINGLE = "single";
var OPTION_DOUBLE = "double";
var OPTION_BACKTICK = "backtick";
var OPTION_JSX_SINGLE = "jsx-single";
var OPTION_JSX_DOUBLE = "jsx-double";
var OPTION_AVOID_TEMPLATE = "avoid-template";
var OPTION_AVOID_ESCAPE = "avoid-escape";
function isQuoteMark(value) {
    return ["'", '"', "`"].indexOf(value) > -1;
}
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (actual, expected) {
        return actual + " should be " + expected;
    };
    Rule.prototype.apply = function (sourceFile) {
        var args = this.ruleArguments;
        var quotemark = getQuotemarkPreference(args);
        var jsxQuotemark = getJSXQuotemarkPreference(args, quotemark);
        return this.applyWithFunction(sourceFile, walk, {
            avoidEscape: hasArg(OPTION_AVOID_ESCAPE),
            avoidTemplate: hasArg(OPTION_AVOID_TEMPLATE),
            jsxQuotemark: jsxQuotemark,
            quotemark: quotemark,
        });
        function hasArg(name) {
            return args.indexOf(name) !== -1;
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "quotemark",
        description: "Enforces quote character for string literals.",
        hasFix: true,
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Five arguments may be optionally provided:\n\n            * `\"", "\"` enforces single quotes.\n            * `\"", "\"` enforces double quotes.\n            * `\"", "\"` enforces backticks.\n            * `\"", "\"` enforces single quotes for JSX attributes.\n            * `\"", "\"` enforces double quotes for JSX attributes.\n            * `\"", "\"` forbids single-line untagged template strings that do not contain string interpolations.\n                Note that backticks may still be used if `\"", "\"` is enabled and both single and double quotes are\n                present in the string (the latter option takes precedence).\n            * `\"", "\"` allows you to use the \"other\" quotemark in cases where escaping would normally be required.\n                For example, `[true, \"", "\", \"", "\"]` would not report a failure on the string literal\n                `'Hello \"World\"'`."], ["\n            Five arguments may be optionally provided:\n\n            * \\`\"", "\"\\` enforces single quotes.\n            * \\`\"", "\"\\` enforces double quotes.\n            * \\`\"", "\"\\` enforces backticks.\n            * \\`\"", "\"\\` enforces single quotes for JSX attributes.\n            * \\`\"", "\"\\` enforces double quotes for JSX attributes.\n            * \\`\"", "\"\\` forbids single-line untagged template strings that do not contain string interpolations.\n                Note that backticks may still be used if \\`\"", "\"\\` is enabled and both single and double quotes are\n                present in the string (the latter option takes precedence).\n            * \\`\"", "\"\\` allows you to use the \"other\" quotemark in cases where escaping would normally be required.\n                For example, \\`[true, \"", "\", \"", "\"]\\` would not report a failure on the string literal\n                \\`'Hello \"World\"'\\`."])), OPTION_SINGLE, OPTION_DOUBLE, OPTION_BACKTICK, OPTION_JSX_SINGLE, OPTION_JSX_DOUBLE, OPTION_AVOID_TEMPLATE, OPTION_AVOID_ESCAPE, OPTION_AVOID_ESCAPE, OPTION_DOUBLE, OPTION_AVOID_ESCAPE),
        options: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    OPTION_SINGLE,
                    OPTION_DOUBLE,
                    OPTION_BACKTICK,
                    OPTION_JSX_SINGLE,
                    OPTION_JSX_DOUBLE,
                    OPTION_AVOID_ESCAPE,
                    OPTION_AVOID_TEMPLATE,
                ],
            },
            minLength: 0,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SINGLE, OPTION_AVOID_ESCAPE, OPTION_AVOID_TEMPLATE],
            [true, OPTION_SINGLE, OPTION_JSX_DOUBLE],
        ],
        type: "formatting",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var sourceFile = ctx.sourceFile, options = ctx.options;
    ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isStringLiteral(node) ||
            (options.avoidTemplate &&
                tsutils_1.isNoSubstitutionTemplateLiteral(node) &&
                node.parent.kind !== ts.SyntaxKind.TaggedTemplateExpression &&
                tsutils_1.isSameLine(sourceFile, node.getStart(sourceFile), node.end))) {
            var expectedQuotemark = node.parent.kind === ts.SyntaxKind.JsxAttribute
                ? options.jsxQuotemark
                : options.quotemark;
            var actualQuotemark = sourceFile.text[node.end - 1];
            // Don't use backticks instead of single/double quotes when it breaks TypeScript syntax.
            if (expectedQuotemark === "`" && isNotValidToUseBackticksInNode(node, sourceFile)) {
                return;
            }
            // We already have the expected quotemark, or the quotemark is invalid. Done.
            if (actualQuotemark === expectedQuotemark || !isQuoteMark(actualQuotemark)) {
                return;
            }
            /** The quotemark we intend to use to fix this node. */
            var fixQuotemark = expectedQuotemark;
            /**
             * Whether this node needs to be escaped (because
             *   it contains the expected quotemark).
             */
            var needsToBeEscaped = node.text.includes(expectedQuotemark);
            // This string requires escapes to use the expected quote mark, but `avoid-escape` was passed
            if (needsToBeEscaped && options.avoidEscape) {
                if (node.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }
                // If we are expecting double quotes, use single quotes to avoid escaping.
                // Otherwise, just use double quotes.
                var alternativeFixQuotemark = expectedQuotemark === '"' ? "'" : '"';
                if (node.text.includes(alternativeFixQuotemark)) {
                    // It also includes the alternative fix quotemark. Let's try to use single quotes instead,
                    // unless we originally expected single quotes, in which case we will try to use backticks.
                    // This means that we may use backtick even with avoid-template in trying to avoid escaping.
                    fixQuotemark = expectedQuotemark === "'" ? "`" : "'";
                    if (fixQuotemark === actualQuotemark) {
                        // We were already using the best quote mark for this scenario
                        return;
                    }
                    else if (node.text.includes(fixQuotemark)) {
                        // It contains all of the other kinds of quotes. Escaping is unavoidable, sadly.
                        return;
                    }
                }
                else {
                    fixQuotemark = alternativeFixQuotemark;
                }
            }
            var start = node.getStart(sourceFile);
            var text = sourceFile.text.substring(start + 1, node.end - 1);
            if (needsToBeEscaped) {
                text = text.replace(new RegExp(fixQuotemark, "g"), "\\" + fixQuotemark);
            }
            text = text.replace(new RegExp("\\\\" + actualQuotemark, "g"), actualQuotemark);
            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING(actualQuotemark, fixQuotemark), new Lint.Replacement(start, node.end - start, fixQuotemark + text + fixQuotemark));
        }
        ts.forEachChild(node, cb);
    });
}
function getQuotemarkPreference(ruleArguments) {
    for (var _i = 0, ruleArguments_1 = ruleArguments; _i < ruleArguments_1.length; _i++) {
        var arg = ruleArguments_1[_i];
        switch (arg) {
            case OPTION_SINGLE:
                return "'";
            case OPTION_DOUBLE:
                return '"';
            case OPTION_BACKTICK:
                return "`";
            default:
                continue;
        }
    }
    // Default to double quotes if no pref is found.
    return '"';
}
function getJSXQuotemarkPreference(ruleArguments, regularQuotemarkPreference) {
    for (var _i = 0, ruleArguments_2 = ruleArguments; _i < ruleArguments_2.length; _i++) {
        var arg = ruleArguments_2[_i];
        switch (arg) {
            case OPTION_JSX_SINGLE:
                return "'";
            case OPTION_JSX_DOUBLE:
                return '"';
            default:
                continue;
        }
    }
    // The JSX preference was not found, so try to use the regular preference.
    //   If the regular pref is backtick, use double quotes instead.
    return regularQuotemarkPreference !== "`" ? regularQuotemarkPreference : '"';
}
function isNotValidToUseBackticksInNode(node, sourceFile) {
    return (
    // This captures `export blah from "package"`
    tsutils_1.isExportDeclaration(node.parent) ||
        // This captures `import blah from "package"`
        tsutils_1.isImportDeclaration(node.parent) ||
        // This captures quoted names in object literal keys
        isNameInAssignment(node) ||
        // This captures quoted signatures (property or method)
        isSignature(node) ||
        // This captures literal types in generic type constraints
        isTypeConstraint(node) ||
        // Older TS doesn't narrow a type when backticks are used to compare typeof
        isTypeCheckWithOldTsc(node) ||
        // Enum members can't use backticks
        tsutils_1.isEnumMember(node.parent) ||
        // Typescript converts old octal escape sequences to just the numbers therein
        containsOctalEscapeSequence(node, sourceFile) ||
        // Use strict declarations have to be single or double quoted
        isUseStrictDeclaration(node) ||
        // Lookup type parameters must be single/double quoted
        isLookupTypeParameter(node));
}
/**
 * Whether this node is a type constraint in a generic type.
 * @param  node The node to check
 * @return Whether this node is a type constraint
 */
function isTypeConstraint(node) {
    var parent = node.parent.parent;
    // If this node doesn't have a grandparent, it's not a type constraint
    if (parent == undefined) {
        return false;
    }
    // Iterate through all levels of union, intersection, or parethesized types
    while (parent.kind === ts.SyntaxKind.UnionType ||
        parent.kind === ts.SyntaxKind.IntersectionType ||
        parent.kind === ts.SyntaxKind.ParenthesizedType) {
        parent = parent.parent;
    }
    return (
    // If the next level is a type reference, the node is a type constraint
    parent.kind === ts.SyntaxKind.TypeReference ||
        // If the next level is a type parameter, the node is a type constraint
        parent.kind === ts.SyntaxKind.TypeParameter);
}
/**
 * Whether this node is the signature of a property or method in a type.
 * @param  node The node to check
 * @return Whether this node is a property/method signature.
 */
function isSignature(node) {
    var parent = node.parent;
    if (hasOldTscBacktickBehavior() && node.parent.kind === ts.SyntaxKind.LastTypeNode) {
        // In older versions, there's a "LastTypeNode" here
        parent = parent.parent;
    }
    return (
    // This captures the kebab-case property names in type definitions
    parent.kind === ts.SyntaxKind.PropertySignature ||
        // This captures the kebab-case method names in type definitions
        parent.kind === ts.SyntaxKind.MethodSignature);
}
/**
 * Whether this node is the method or property name in an assignment/declaration.
 * @param  node The node to check
 * @return Whether this node is the name in an assignment/decleration.
 */
function isNameInAssignment(node) {
    if (node.parent.kind !== ts.SyntaxKind.PropertyAssignment &&
        node.parent.kind !== ts.SyntaxKind.MethodDeclaration) {
        // If the node is neither a property assignment or method declaration, it's not a name in an assignment
        return false;
    }
    return (
    // In old typescript versions, don't change values either
    hasOldTscBacktickBehavior() ||
        // If this node is not at the end of the parent
        node.end !== node.parent.end);
}
function isTypeCheckWithOldTsc(node) {
    if (!hasOldTscBacktickBehavior()) {
        // This one only affects older typescript versions
        return false;
    }
    if (node.parent.kind !== ts.SyntaxKind.BinaryExpression) {
        // If this isn't in a binary expression
        return false;
    }
    // If this node has a sibling that is a TypeOf
    return node.parent.getChildren().some(function (n) { return n.kind === ts.SyntaxKind.TypeOfExpression; });
}
function containsOctalEscapeSequence(node, sourceFile) {
    // Octal sequences can go from 1-377 (255 in octal), but let's match the prefix, which will at least be \1-\77
    // Using node.getText here strips the backslashes from the string. We also need to make sure there isn't an even
    // number of backslashes (then it would not be an escape sequence, but a literal backslash followed by numbers).
    var matches = node.getText(sourceFile).match(/(\\)+[1-7][0-7]?/g);
    if (matches != undefined) {
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            var numBackslashes = match.match(/\\/g).length;
            if (numBackslashes % 2 === 1) {
                // There was an odd number of backslashes preceeding this node – it's an octal escape sequence
                return true;
            }
        }
    }
    return false;
}
function isUseStrictDeclaration(node) {
    return node.text === "use strict" && tsutils_1.isExpressionStatement(node.parent);
}
function isLookupTypeParameter(node) {
    return tsutils_1.isLiteralTypeNode(node.parent) && tsutils_1.isIndexedAccessTypeNode(node.parent.parent);
}
/** Versions of typescript below 2.7.1 treat backticks differently */
function hasOldTscBacktickBehavior() {
    return semver_1.lt(parse_1.getNormalizedTypescriptVersion(), "2.7.1");
}
var templateObject_1;
