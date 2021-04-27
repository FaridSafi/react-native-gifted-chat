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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var OPTION_LIMIT = "limit";
var OPTION_IGNORE_PATTERN = "ignore-pattern";
var OPTION_CHECK_STRINGS = "check-strings";
var OPTION_CHECK_REGEX = "check-regex";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING_FACTORY = function (lineLimit) {
        return "Exceeds maximum line length of " + lineLimit;
    };
    Rule.prototype.isEnabled = function () {
        var limit = this.getRuleOptions()[OPTION_LIMIT];
        return _super.prototype.isEnabled.call(this) && limit > 0;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions());
    };
    Rule.prototype.getRuleOptions = function () {
        var argument = this.ruleArguments[0];
        if (typeof argument === "number") {
            return { limit: argument };
        }
        else {
            var _a = argument, _b = OPTION_CHECK_REGEX, checkRegex = _a[_b], _c = OPTION_CHECK_STRINGS, checkStrings = _a[_c], _d = OPTION_IGNORE_PATTERN, ignorePattern = _a[_d], _e = OPTION_LIMIT, limit = _a[_e];
            return {
                checkRegex: Boolean(checkRegex),
                checkStrings: Boolean(checkStrings),
                ignorePattern: typeof ignorePattern === "string" ? new RegExp(ignorePattern) : undefined,
                limit: Number(limit),
            };
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "max-line-length",
        description: "Requires lines to be under a certain max length.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."], ["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."]))),
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n        It can take one argument, which can be any of the following:\n        * integer indicating maximum length of lines.\n        * object with keys:\n          * `", "` - number greater than 0 defining the max line length\n          * `", "` - string defining ignore pattern for this rule, being parsed by `new RegExp()`.\n            For example:\n             * `// ` pattern will ignore all in-line comments.\n             * `^import ` pattern will ignore all import statements.\n             * `^export {(.*?)}` pattern will ignore all multiple export statements.\n             * `class [a-zA-Z]+ implements ` pattern will ignore all class declarations implementing interfaces.\n             * `^import |^export {(.*?)}|class [a-zA-Z]+ implements |// ` pattern will ignore all the cases listed above.\n          * `", "` - determines if strings should be checked, `false` by default.\n          * `", "` - determines if regular expressions should be checked, `false` by default.\n         "], ["\n        It can take one argument, which can be any of the following:\n        * integer indicating maximum length of lines.\n        * object with keys:\n          * \\`", "\\` - number greater than 0 defining the max line length\n          * \\`", "\\` - string defining ignore pattern for this rule, being parsed by \\`new RegExp()\\`.\n            For example:\n             * \\`\\/\\/ \\` pattern will ignore all in-line comments.\n             * \\`^import \\` pattern will ignore all import statements.\n             * \\`^export \\{(.*?)\\}\\` pattern will ignore all multiple export statements.\n             * \\`class [a-zA-Z]+ implements \\` pattern will ignore all class declarations implementing interfaces.\n             * \\`^import |^export \\{(.*?)\\}|class [a-zA-Z]+ implements |// \\` pattern will ignore all the cases listed above.\n          * \\`", "\\` - determines if strings should be checked, \\`false\\` by default.\n          * \\`", "\\` - determines if regular expressions should be checked, \\`false\\` by default.\n         "])), OPTION_LIMIT, OPTION_IGNORE_PATTERN, OPTION_CHECK_STRINGS, OPTION_CHECK_REGEX),
        options: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "number",
                    },
                    {
                        type: "object",
                        properties: (_a = {},
                            _a[OPTION_LIMIT] = { type: "number" },
                            _a[OPTION_IGNORE_PATTERN] = { type: "string" },
                            _a[OPTION_CHECK_STRINGS] = { type: "boolean" },
                            _a[OPTION_CHECK_REGEX] = { type: "boolean" },
                            _a),
                        additionalProperties: false,
                    },
                ],
            },
            minLength: 1,
            maxLength: 2,
        },
        optionExamples: [
            [true, 120],
            [
                true,
                (_b = {},
                    _b[OPTION_LIMIT] = 120,
                    _b[OPTION_IGNORE_PATTERN] = "^import |^export {(.*?)}",
                    _b[OPTION_CHECK_STRINGS] = true,
                    _b[OPTION_CHECK_REGEX] = true,
                    _b),
            ],
        ],
        type: "formatting",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var limit = ctx.options.limit;
    tsutils_1.getLineRanges(ctx.sourceFile)
        .filter(function (line) {
        return line.contentLength > limit && !shouldIgnoreLine(line, ctx);
    })
        .forEach(function (_a) {
        var pos = _a.pos, contentLength = _a.contentLength;
        return ctx.addFailureAt(pos, contentLength, Rule.FAILURE_STRING_FACTORY(limit));
    });
    return;
}
function shouldIgnoreLine(_a, _b) {
    var pos = _a.pos, contentLength = _a.contentLength;
    var options = _b.options, sourceFile = _b.sourceFile;
    var checkRegex = options.checkRegex, checkStrings = options.checkStrings, ignorePattern = options.ignorePattern, limit = options.limit;
    var shouldOmitLine = false;
    if (ignorePattern !== undefined) {
        shouldOmitLine =
            shouldOmitLine || ignorePattern.test(sourceFile.text.substr(pos, contentLength));
    }
    if (!checkStrings) {
        var nodeAtLimit = tsutils_1.getTokenAtPosition(sourceFile, pos + limit);
        if (nodeAtLimit !== undefined) {
            shouldOmitLine =
                shouldOmitLine ||
                    nodeAtLimit.kind === ts.SyntaxKind.StringLiteral ||
                    nodeAtLimit.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
                    hasParentMatchingTypes(nodeAtLimit, sourceFile, [ts.SyntaxKind.TemplateExpression]);
        }
    }
    if (!checkRegex) {
        var nodeAtLimit = tsutils_1.getTokenAtPosition(sourceFile, pos + limit);
        if (nodeAtLimit !== undefined) {
            shouldOmitLine =
                shouldOmitLine || nodeAtLimit.kind === ts.SyntaxKind.RegularExpressionLiteral;
        }
    }
    return shouldOmitLine;
}
function hasParentMatchingTypes(node, root, parentTypes) {
    var nodeReference = node;
    while (nodeReference !== root) {
        if (parentTypes.indexOf(nodeReference.kind) >= 0) {
            return true;
        }
        nodeReference = nodeReference.parent;
    }
    return false;
}
var templateObject_1, templateObject_2;
