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
var ts = require("typescript");
var Lint = require("../index");
var OPTION_MATCH = "match";
var OPTION_ALLOW_SINGLE_LINE_COMMENTS = "allow-single-line-comments";
var OPTION_DEFAULT = "default";
var OPTION_ENFORCE_TRAILING_NEWLINE = "enforce-trailing-newline";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getRuleOptions();
        var text = sourceFile.text;
        var headerFormat = new RegExp(options[OPTION_MATCH]);
        var textToInsert = options[OPTION_DEFAULT];
        // ignore shebang if it exists
        var offset = text.startsWith("#!") ? text.indexOf("\n") : 0;
        var commentText = this.getFileHeaderText(text, offset, !!options[OPTION_ALLOW_SINGLE_LINE_COMMENTS]);
        if (commentText === undefined || !headerFormat.test(commentText)) {
            var isErrorAtStart = offset === 0;
            if (!isErrorAtStart) {
                ++offset; // show warning in next line after shebang
            }
            var leadingNewlines = isErrorAtStart ? 0 : 1;
            var trailingNewlines = isErrorAtStart ? 2 : 1;
            var fix = textToInsert !== undefined
                ? Lint.Replacement.appendText(offset, this.createComment(sourceFile, textToInsert, leadingNewlines, trailingNewlines))
                : undefined;
            return [
                new Lint.RuleFailure(sourceFile, offset, offset, Rule.MISSING_HEADER_FAILURE_STRING, this.ruleName, fix),
            ];
        }
        var trailingNewLineViolation = options[OPTION_ENFORCE_TRAILING_NEWLINE] &&
            headerFormat.test(commentText) &&
            this.doesNewLineEndingViolationExist(text, offset);
        if (trailingNewLineViolation) {
            var trailingCommentRanges = ts.getTrailingCommentRanges(text, offset);
            var endOfComment = trailingCommentRanges[0].end;
            var lineEnding = this.generateLineEnding(sourceFile);
            var fix = textToInsert !== undefined
                ? Lint.Replacement.appendText(endOfComment, lineEnding)
                : undefined;
            return [
                new Lint.RuleFailure(sourceFile, offset, offset, Rule.MISSING_NEW_LINE_FAILURE_STRING, this.ruleName, fix),
            ];
        }
        return [];
    };
    Rule.prototype.getRuleOptions = function () {
        var _a;
        var options = this.ruleArguments;
        if (options.length === 1 && typeof options[0] === "object") {
            return options[0];
        }
        // Legacy options
        var args = this.ruleArguments;
        return _a = {},
            _a[OPTION_DEFAULT] = args[1],
            _a[OPTION_ENFORCE_TRAILING_NEWLINE] = args[2] !== undefined
                ? args[2].indexOf(OPTION_ENFORCE_TRAILING_NEWLINE) !== -1
                : undefined,
            _a[OPTION_MATCH] = args[0],
            _a;
    };
    Rule.prototype.createComment = function (sourceFile, commentText, leadingNewlines, trailingNewlines) {
        if (leadingNewlines === void 0) { leadingNewlines = 1; }
        if (trailingNewlines === void 0) { trailingNewlines = 1; }
        var lineEnding = this.generateLineEnding(sourceFile);
        return (lineEnding.repeat(leadingNewlines) +
            tslib_1.__spreadArrays([
                "/*!"
            ], commentText.split(/\r?\n/g).map(function (line) { return (" * " + line).replace(/\s+$/, ""); }), [
                " */",
            ]).join(lineEnding) +
            lineEnding.repeat(trailingNewlines));
    };
    Rule.prototype.generateLineEnding = function (sourceFile) {
        var maybeCarriageReturn = sourceFile.text[sourceFile.getLineEndOfPosition(0)] === "\r" ? "\r" : "";
        return maybeCarriageReturn + "\n";
    };
    Rule.prototype.doesNewLineEndingViolationExist = function (text, offset) {
        var entireComment = ts.forEachLeadingCommentRange(text, offset, function (pos, end) {
            return text.substring(pos, end + 2);
        });
        var NEW_LINE_FOLLOWING_HEADER = /^.*((\r)?\n){2,}$/gm;
        return entireComment !== undefined && !NEW_LINE_FOLLOWING_HEADER.test(entireComment);
    };
    Rule.prototype.getFileHeaderText = function (text, offset, allowSingleLineComments) {
        var ranges = ts.getLeadingCommentRanges(text, offset);
        if (ranges === undefined || ranges.length === 0) {
            return undefined;
        }
        var fileHeaderRanges = !allowSingleLineComments ? ranges.slice(0, 1) : ranges;
        return fileHeaderRanges
            .map(function (range) {
            var pos = range.pos, kind = range.kind, end = range.end;
            return text.substring(pos + 2, kind === ts.SyntaxKind.SingleLineCommentTrivia ? end : end - 2);
        })
            .join("\n");
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "file-header",
        description: "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            A single object may be passed in for configuration that must contain:\n\n            * `", "`: a regular expression that all headers should match\n\n            Any of the following optional fields may also be provided:\n\n            * `", "`: a boolean for whether `//` should be considered file headers in addition to `/*` comments\n            * `", "`: text to add for file headers when running in `--fix` mode\n            * `", "`: a boolean for whether a newline must follow the header\n\n            The rule will also accept array of strings as a legacy form of options, though the object form is recommended.\n            The first option, which is mandatory, is a regular expression that all headers should match.\n            The second argument, which is optional, is a string that should be inserted as a header comment\n            if fixing is enabled and no header that matches the first argument is found.\n            The third argument, which is optional, is a string that denotes whether or not a newline should\n            exist on the header."], ["\n            A single object may be passed in for configuration that must contain:\n\n            * \\`", "\\`: a regular expression that all headers should match\n\n            Any of the following optional fields may also be provided:\n\n            * \\`", "\\`: a boolean for whether \\`//\\` should be considered file headers in addition to \\`/*\\` comments\n            * \\`", "\\`: text to add for file headers when running in \\`--fix\\` mode\n            * \\`", "\\`: a boolean for whether a newline must follow the header\n\n            The rule will also accept array of strings as a legacy form of options, though the object form is recommended.\n            The first option, which is mandatory, is a regular expression that all headers should match.\n            The second argument, which is optional, is a string that should be inserted as a header comment\n            if fixing is enabled and no header that matches the first argument is found.\n            The third argument, which is optional, is a string that denotes whether or not a newline should\n            exist on the header."])), OPTION_MATCH, OPTION_ALLOW_SINGLE_LINE_COMMENTS, OPTION_DEFAULT, OPTION_ENFORCE_TRAILING_NEWLINE),
        options: {
            oneOf: [
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: (_a = {},
                            _a[OPTION_MATCH] = {
                                type: "string",
                            },
                            _a[OPTION_ALLOW_SINGLE_LINE_COMMENTS] = {
                                type: "boolean",
                            },
                            _a[OPTION_DEFAULT] = {
                                type: "string",
                            },
                            _a[OPTION_ENFORCE_TRAILING_NEWLINE] = {
                                type: "boolean",
                            },
                            _a),
                        additionalProperties: false,
                    },
                },
                {
                    type: "array",
                    items: [
                        {
                            type: "string",
                        },
                        {
                            type: "string",
                        },
                        {
                            type: "string",
                        },
                    ],
                    additionalItems: false,
                    minLength: 1,
                    maxLength: 3,
                },
            ],
        },
        optionExamples: [
            [
                true,
                (_b = {},
                    _b[OPTION_MATCH] = "Copyright \\d{4}",
                    _b[OPTION_ALLOW_SINGLE_LINE_COMMENTS] = true,
                    _b[OPTION_DEFAULT] = "Copyright 2018",
                    _b[OPTION_ENFORCE_TRAILING_NEWLINE] = true,
                    _b),
            ],
            [true, "Copyright \\d{4}", "Copyright 2018", OPTION_ENFORCE_TRAILING_NEWLINE],
        ],
        hasFix: true,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.MISSING_HEADER_FAILURE_STRING = "missing file header";
    Rule.MISSING_NEW_LINE_FAILURE_STRING = "missing new line following the file header";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var templateObject_1;
