"use strict";
/**
 * @license
 * Copyright 2014 Palantir Technologies, Inc.
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
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = function (name) {
        return "Unexpected global variable '" + name + "'. Use a local parameter or variable instead.";
    };
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        var bannedList = this.ruleArguments.length > 0 ? this.ruleArguments : ["event", "name", "length"];
        var bannedGlobals = new Set(bannedList);
        if (sourceFile.isDeclarationFile) {
            return [];
        }
        else {
            return this.applyWithFunction(sourceFile, walk, bannedGlobals, program.getTypeChecker());
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-restricted-globals",
        description: "Disallow specific global variables.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            ```ts\n            function broken(evt: Event) {\n                // Meant to do something with `evt` but typed it incorrectly.\n                Event.target;  // compiler error\n                event.target;  // should be a lint failure\n            }\n\n            Early Internet Explorer versions exposed the current DOM event as a global variable 'event',\n            but using this variable has been considered a bad practice for a long time.\n            Restricting this will make sure this variable isn\u2019t used in browser code.\n            ```\n        "], ["\n            \\`\\`\\`ts\n            function broken(evt: Event) {\n                // Meant to do something with \\`evt\\` but typed it incorrectly.\n                Event.target;  // compiler error\n                event.target;  // should be a lint failure\n            }\n\n            Early Internet Explorer versions exposed the current DOM event as a global variable 'event',\n            but using this variable has been considered a bad practice for a long time.\n            Restricting this will make sure this variable isn\u2019t used in browser code.\n            \\`\\`\\`\n        "]))),
        descriptionDetails: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Disallowing usage of specific global variables can be useful if you want to allow\n            a set of global variables by enabling an environment, but still want to disallow\n            some of those.\n        "], ["\n            Disallowing usage of specific global variables can be useful if you want to allow\n            a set of global variables by enabling an environment, but still want to disallow\n            some of those.\n        "]))),
        optionsDescription: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            This rule takes a list of strings, where each string is a global to be restricted.\n            `event`, `name` and `length` are restricted by default.\n        "], ["\n            This rule takes a list of strings, where each string is a global to be restricted.\n            \\`event\\`, \\`name\\` and \\`length\\` are restricted by default.\n        "]))),
        options: {
            type: "list",
            items: { type: "string" },
        },
        optionExamples: [[true, "name", "length", "event"]],
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
    };
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, checker) {
    return ts.forEachChild(ctx.sourceFile, function recur(node) {
        if (node == undefined) {
            return;
        }
        // Handles `const { bar, length: { x: y = () => event } } = foo`
        if (tsutils_1.isBindingElement(node)) {
            recur(node.initializer);
            recur(node.name);
            if (node.propertyName != undefined && tsutils_1.isComputedPropertyName(node.propertyName)) {
                recur(node.propertyName);
            }
        }
        else if (tsutils_1.isPropertyAccessExpression(node)) {
            // Ignore `y` in `x.y`, but recurse to `x`.
            recur(node.expression);
        }
        else if (tsutils_1.isIdentifier(node)) {
            checkIdentifier(node);
        }
        else {
            ts.forEachChild(node, recur);
        }
    });
    function checkIdentifier(node) {
        if (!ctx.options.has(node.text)) {
            return;
        }
        var symbol = checker.getSymbolAtLocation(node);
        var declarations = symbol === undefined ? undefined : symbol.declarations;
        if (declarations === undefined || declarations.length === 0) {
            return;
        }
        var isAmbientGlobal = declarations.some(function (decl) { return decl.getSourceFile().isDeclarationFile; });
        if (isAmbientGlobal) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING(node.text));
        }
    }
}
var templateObject_1, templateObject_2, templateObject_3;
