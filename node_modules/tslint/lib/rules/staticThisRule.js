"use strict";
/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
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
var staticThis_examples_1 = require("./code-examples/staticThis.examples");
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
        ruleName: "static-this",
        description: "Ban the use of `this` in static methods.",
        hasFix: true,
        options: null,
        optionsDescription: "",
        optionExamples: [true],
        /* tslint:disable:max-line-length */
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Static `this` usage can be confusing for newcomers.\n            It can also become imprecise when used with extended classes when a static `this` of a parent class no longer specifically refers to the parent class.\n        "], ["\n            Static \\`this\\` usage can be confusing for newcomers.\n            It can also become imprecise when used with extended classes when a static \\`this\\` of a parent class no longer specifically refers to the parent class.\n        "]))),
        /* tslint:enable:max-line-length */
        type: "functionality",
        typescriptOnly: false,
        codeExamples: staticThis_examples_1.codeExamples,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Use the parent class name instead of `this` when in a `static` context.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var currentParentClass;
    var cb = function (node) {
        var originalParentClass = currentParentClass;
        if (utils.isClassLikeDeclaration(node.parent)) {
            currentParentClass = undefined;
            if (utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword)) {
                currentParentClass = node.parent;
            }
            ts.forEachChild(node, cb);
            currentParentClass = originalParentClass;
            return;
        }
        if (node.kind === ts.SyntaxKind.ThisKeyword && currentParentClass !== undefined) {
            var fix = void 0;
            if (currentParentClass.name !== undefined) {
                fix = Lint.Replacement.replaceNode(node, currentParentClass.name.text);
            }
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
            return;
        }
        ts.forEachChild(node, cb);
    };
    ts.forEachChild(ctx.sourceFile, cb);
}
var templateObject_1;
