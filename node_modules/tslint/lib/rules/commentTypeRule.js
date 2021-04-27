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
var utils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
function parseOptions(opts) {
    return new Set(opts);
}
// Constant Messages
var MULTILINE_FAILURE = "multiline comments are not allowed";
var SINGLE_LINE_FAILURE = "singleline comments are not allowed";
var DOC_FAILURE = "doc comments are not allowed";
var DIRECTIVE_FAILURE = "triple-slash directives are not allowed";
// Logic
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
    };
    // tslint:disable:object-literal-sort-keys
    Rule.metadata = {
        ruleName: "comment-type",
        description: "Allows a limited set of comment types",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            One or more of the following mutually exclusive comment types may be provided:\n\n            * `singleline`: Comments starting with `//`\n            * `multiline`:  Comments between `/*` and `*/` but are not doc comments\n            * `doc`:        Multiline comments that start with `/**`\n            * 'directive':  Triple-slash directives that are singleline comments starting with `///`"], ["\n            One or more of the following mutually exclusive comment types may be provided:\n\n            * \\`singleline\\`: Comments starting with \\`//\\`\n            * \\`multiline\\`:  Comments between \\`/*\\` and \\`*/\\` but are not doc comments\n            * \\`doc\\`:        Multiline comments that start with \\`/**\\`\n            * \\'directive\\':  Triple-slash directives that are singleline comments starting with \\`///\\`"]))),
        options: {
            type: "array",
            items: {
                type: "string",
                enum: ["singleline", "multiline", "doc", "directive"],
            },
            uniqueItems: true,
        },
        optionExamples: [[true, "doc", "singleline"], [true, "singleline"], [true, "multiline"]],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    utils.forEachComment(ctx.sourceFile, function (fullText, _a) {
        var kind = _a.kind, pos = _a.pos, end = _a.end;
        if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
            // directive
            if (fullText.slice(pos, pos + 3) === "///" && !ctx.options.has("directive")) {
                ctx.addFailure(pos, end, DIRECTIVE_FAILURE);
                // singleline
            }
            else if (fullText.slice(pos, pos + 3) !== "///" && !ctx.options.has("singleline")) {
                ctx.addFailure(pos, end, SINGLE_LINE_FAILURE);
            }
        }
        else if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
            // doc
            if (fullText.slice(pos, pos + 3) === "/**" && !ctx.options.has("doc")) {
                ctx.addFailure(pos, end, DOC_FAILURE);
                // multiline
            }
            else if (fullText.slice(pos, pos + 3) !== "/**" && !ctx.options.has("multiline")) {
                ctx.addFailure(pos, end, MULTILINE_FAILURE);
            }
        }
    });
}
var templateObject_1;
