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
var Lint = require("../index");
var banTsIgnore_examples_1 = require("./code-examples/banTsIgnore.examples");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "ban-ts-ignore",
        description: 'Bans "// @ts-ignore" comments from being used.',
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true,
        codeExamples: banTsIgnore_examples_1.codeExamples,
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.FAILURE_STRING = 'Do not use "// @ts-ignore" comments because they suppress compilation errors.';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var ignoreDiagnosticCommentRegEx = /^\s*\/\/\/?\s*@ts-ignore/;
    tsutils_1.forEachComment(ctx.sourceFile, function (fullText, comment) {
        var commentText = fullText.slice(comment.pos, comment.end);
        if (Boolean(commentText.match(ignoreDiagnosticCommentRegEx))) {
            ctx.addFailure(comment.pos, comment.end, Rule.FAILURE_STRING);
        }
    });
}
