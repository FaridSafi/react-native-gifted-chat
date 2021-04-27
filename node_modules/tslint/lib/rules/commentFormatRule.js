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
var utils = require("tsutils");
var ts = require("typescript");
var enableDisableRules_1 = require("../enableDisableRules");
var Lint = require("../index");
var utils_1 = require("../utils");
var OPTION_SPACE = "check-space";
var OPTION_LOWERCASE = "check-lowercase";
var OPTION_UPPERCASE = "check-uppercase";
var OPTION_ALLOW_TRAILING_LOWERCASE = "allow-trailing-lowercase";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var commentFormatWalker = new CommentFormatWalker(sourceFile, this.ruleName, parseOptions(this.ruleArguments));
        return this.applyWithWalker(commentFormatWalker);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "comment-format",
        description: "Enforces formatting rules for single-line comments.",
        rationale: "Helps maintain a consistent, readable style in your codebase.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Four arguments may be optionally provided:\n\n            * `\"", "\"` requires that all single-line comments must begin with a space, as in `// comment`\n                * note that for comments starting with multiple slashes, e.g. `///`, leading slashes are ignored\n                * TypeScript reference comments are ignored completely\n            * `\"", "\"` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * `\"", "\"` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            * `\"", "\"` allows that only the first comment of a series of comments needs to be uppercase.\n                * requires `\"", "\"`\n                * comments must start at the same position\n\n            Exceptions to `\"", "\"` or `\"", "\"` can be managed with object that may be passed as last\n            argument.\n\n            One of two options can be provided in this object:\n\n            * `\"ignore-words\"`  - array of strings - words that will be ignored at the beginning of the comment.\n            * `\"ignore-pattern\"` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "], ["\n            Four arguments may be optionally provided:\n\n            * \\`\"", "\"\\` requires that all single-line comments must begin with a space, as in \\`// comment\\`\n                * note that for comments starting with multiple slashes, e.g. \\`///\\`, leading slashes are ignored\n                * TypeScript reference comments are ignored completely\n            * \\`\"", "\"\\` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * \\`\"", "\"\\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            * \\`\"", "\"\\` allows that only the first comment of a series of comments needs to be uppercase.\n                * requires \\`\"", "\"\\`\n                * comments must start at the same position\n\n            Exceptions to \\`\"", "\"\\` or \\`\"", "\"\\` can be managed with object that may be passed as last\n            argument.\n\n            One of two options can be provided in this object:\n\n            * \\`\"ignore-words\"\\`  - array of strings - words that will be ignored at the beginning of the comment.\n            * \\`\"ignore-pattern\"\\` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "])), OPTION_SPACE, OPTION_LOWERCASE, OPTION_UPPERCASE, OPTION_ALLOW_TRAILING_LOWERCASE, OPTION_UPPERCASE, OPTION_LOWERCASE, OPTION_UPPERCASE),
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "string",
                        enum: [
                            OPTION_SPACE,
                            OPTION_LOWERCASE,
                            OPTION_UPPERCASE,
                            OPTION_ALLOW_TRAILING_LOWERCASE,
                        ],
                    },
                    {
                        type: "object",
                        properties: {
                            "ignore-words": {
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                            "ignore-pattern": {
                                type: "string",
                            },
                        },
                        minProperties: 1,
                        maxProperties: 1,
                    },
                ],
            },
            minLength: 1,
            maxLength: 5,
        },
        optionExamples: [
            [true, OPTION_SPACE, OPTION_UPPERCASE, OPTION_ALLOW_TRAILING_LOWERCASE],
            [true, OPTION_LOWERCASE, { "ignore-words": ["TODO", "HACK"] }],
            [true, OPTION_LOWERCASE, { "ignore-pattern": "STD\\w{2,3}\\b" }],
        ],
        type: "style",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.LOWERCASE_FAILURE = "comment must start with lowercase letter";
    Rule.SPACE_LOWERCASE_FAILURE = "comment must start with a space and lowercase letter";
    Rule.UPPERCASE_FAILURE = "comment must start with uppercase letter";
    Rule.SPACE_UPPERCASE_FAILURE = "comment must start with a space and uppercase letter";
    Rule.LEADING_SPACE_FAILURE = "comment must start with a space";
    Rule.IGNORE_WORDS_FAILURE_FACTORY = function (words) {
        return " or the word(s): " + words.join(", ");
    };
    Rule.IGNORE_PATTERN_FAILURE_FACTORY = function (pattern) {
        return " or its start must match the regex pattern \"" + pattern + "\"";
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function parseOptions(options) {
    return tslib_1.__assign({ allowTrailingLowercase: has(OPTION_ALLOW_TRAILING_LOWERCASE), case: options.indexOf(OPTION_LOWERCASE) !== -1
            ? 1 /* Lower */
            : options.indexOf(OPTION_UPPERCASE) !== -1
                ? 2 /* Upper */
                : 0 /* None */, failureSuffix: "", space: has(OPTION_SPACE) }, composeExceptions(options[options.length - 1]));
    function has(option) {
        return options.indexOf(option) !== -1;
    }
}
function composeExceptions(option) {
    if (typeof option !== "object") {
        return undefined;
    }
    var ignorePattern = option["ignore-pattern"];
    if (ignorePattern !== undefined) {
        return {
            exceptions: new RegExp("^\\s*(" + ignorePattern + ")"),
            failureSuffix: Rule.IGNORE_PATTERN_FAILURE_FACTORY(ignorePattern),
        };
    }
    var ignoreWords = option["ignore-words"];
    if (ignoreWords !== undefined && ignoreWords.length !== 0) {
        return {
            exceptions: new RegExp("^\\s*(?:" + ignoreWords.map(function (word) { return utils_1.escapeRegExp(word.trim()); }).join("|") + ")\\b"),
            failureSuffix: Rule.IGNORE_WORDS_FAILURE_FACTORY(ignoreWords),
        };
    }
    return undefined;
}
var CommentFormatWalker = /** @class */ (function (_super) {
    tslib_1.__extends(CommentFormatWalker, _super);
    function CommentFormatWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommentFormatWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        utils.forEachComment(sourceFile, function (fullText, comment) {
            var commentStatus = _this.checkComment(fullText, comment);
            _this.handleFailure(commentStatus, comment.end);
            // cache position of last comment
            _this.prevComment = ts.getLineAndCharacterOfPosition(sourceFile, comment.pos);
            _this.prevCommentIsValid = commentStatus.validForTrailingLowercase;
        });
    };
    CommentFormatWalker.prototype.checkComment = function (fullText, _a) {
        var kind = _a.kind, pos = _a.pos, end = _a.end;
        var status = {
            firstLetterPos: -1,
            leadingSpaceError: false,
            lowercaseError: false,
            start: pos + 2,
            text: "",
            uppercaseError: false,
            validForTrailingLowercase: false,
        };
        if (kind !== ts.SyntaxKind.SingleLineCommentTrivia ||
            // exclude empty comments
            status.start === end ||
            // exclude /// <reference path="...">
            (fullText[status.start] === "/" &&
                this.sourceFile.referencedFiles.some(function (ref) { return ref.pos >= pos && ref.end <= end; }))) {
            return status;
        }
        // skip all leading slashes
        while (fullText[status.start] === "/") {
            ++status.start;
        }
        if (status.start === end) {
            return status;
        }
        status.text = fullText.slice(status.start, end);
        // whitelist //#region and //#endregion and JetBrains IDEs' "//noinspection ...", "//region", "//endregion"
        if (/^(?:#?(?:end)?region|noinspection\s)/.test(status.text)) {
            return status;
        }
        if (this.options.space && status.text[0] !== " ") {
            status.leadingSpaceError = true;
        }
        if (this.options.case === 0 /* None */ ||
            (this.options.exceptions !== undefined && this.options.exceptions.test(status.text)) ||
            enableDisableRules_1.ENABLE_DISABLE_REGEX.test(status.text)) {
            return status;
        }
        // search for first non-space character to check if lower or upper
        var charPos = status.text.search(/\S/);
        if (charPos === -1) {
            return status;
        }
        // All non-empty and not whitelisted comments are valid for the trailing lowercase rule
        status.validForTrailingLowercase = true;
        status.firstLetterPos = charPos;
        if (this.options.case === 1 /* Lower */ && !utils_1.isLowerCase(status.text[charPos])) {
            status.lowercaseError = true;
        }
        else if (this.options.case === 2 /* Upper */ && !utils_1.isUpperCase(status.text[charPos])) {
            status.uppercaseError = true;
            if (this.options.allowTrailingLowercase &&
                this.prevComment !== undefined &&
                this.prevCommentIsValid) {
                var currentComment = ts.getLineAndCharacterOfPosition(this.sourceFile, pos);
                if (this.prevComment.line + 1 === currentComment.line &&
                    this.prevComment.character === currentComment.character) {
                    status.uppercaseError = false;
                }
            }
        }
        return status;
    };
    CommentFormatWalker.prototype.handleFailure = function (status, end) {
        // No failure detected
        if (!status.leadingSpaceError && !status.lowercaseError && !status.uppercaseError) {
            return;
        }
        // Only whitespace failure
        if (status.leadingSpaceError && !status.lowercaseError && !status.uppercaseError) {
            this.addFailure(status.start, end, Rule.LEADING_SPACE_FAILURE, Lint.Replacement.appendText(status.start, " "));
            return;
        }
        var msg;
        var firstLetterFix;
        if (status.lowercaseError) {
            msg = status.leadingSpaceError ? Rule.SPACE_LOWERCASE_FAILURE : Rule.LOWERCASE_FAILURE;
            firstLetterFix = status.text[status.firstLetterPos].toLowerCase();
        }
        else {
            msg = status.leadingSpaceError ? Rule.SPACE_UPPERCASE_FAILURE : Rule.UPPERCASE_FAILURE;
            firstLetterFix = status.text[status.firstLetterPos].toUpperCase();
        }
        var fix = status.leadingSpaceError
            ? new Lint.Replacement(status.start, 1, " " + firstLetterFix)
            : new Lint.Replacement(status.start + status.firstLetterPos, 1, firstLetterFix);
        this.addFailure(status.start, end, msg + this.options.failureSuffix, fix);
    };
    return CommentFormatWalker;
}(Lint.AbstractWalker));
var templateObject_1;
