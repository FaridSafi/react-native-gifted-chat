"use strict";
/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
var OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS = "allow-namespace-imports";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING = function (module) {
        return "Multiple imports from '" + module + "' can be combined into one.";
    };
    Rule.NAMESPACE_FAILURE_STRING = function (module) {
        return "Multiple wildcard imports from the same module, '" + module + "', are prohibited.";
    };
    Rule.prototype.apply = function (sourceFile) {
        var _a;
        return this.applyWithFunction(sourceFile, walk, (_a = {},
            _a[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS] = !!(this.ruleArguments.length > 0 &&
                this.ruleArguments[0] !== null &&
                this.ruleArguments[0][OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]),
            _a));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-duplicate-imports",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Disallows multiple import statements from the same module."], ["\n            Disallows multiple import statements from the same module."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Using a single import statement per module will make the code clearer because you can see everything being imported\n            from that module on one line."], ["\n            Using a single import statement per module will make the code clearer because you can see everything being imported\n            from that module on one line."]))),
        optionsDescription: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            \"", "\" allows you to import namespaces on separate lines."], ["\n            \"", "\" allows you to import namespaces on separate lines."])), OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS),
        options: {
            type: "object",
            properties: (_a = {},
                _a[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS] = {
                    type: "boolean",
                },
                _a),
        },
        optionExamples: [[true, (_b = {}, _b[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS] = true, _b)]],
        type: "maintainability",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    walkWorker(ctx, ctx.sourceFile.statements, {
        imports: new Set(),
        namespaceImports: new Set(),
    });
}
function statementIsNamespaceImport(statement) {
    return !!(statement.importClause !== undefined &&
        statement.importClause.namedBindings !== undefined &&
        tsutils_1.isNamespaceImport(statement.importClause.namedBindings));
}
function walkWorker(ctx, statements, seen) {
    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
        var statement = statements_1[_i];
        if (tsutils_1.isImportDeclaration(statement) &&
            tsutils_1.isLiteralExpression(statement.moduleSpecifier) &&
            (!statementIsNamespaceImport(statement) ||
                !ctx.options[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS])) {
            var text = statement.moduleSpecifier.text;
            if (seen.imports.has(text)) {
                ctx.addFailureAtNode(statement, Rule.FAILURE_STRING(text));
            }
            seen.imports.add(text);
        }
        else if (tsutils_1.isImportDeclaration(statement) &&
            tsutils_1.isLiteralExpression(statement.moduleSpecifier) &&
            statementIsNamespaceImport(statement) &&
            ctx.options[OPTION_ALLOW_SEPARATE_NAMESPACE_IMPORTS]) {
            var text = statement.moduleSpecifier.text;
            if (seen.namespaceImports.has(text)) {
                ctx.addFailureAtNode(statement, Rule.NAMESPACE_FAILURE_STRING(text));
            }
            seen.namespaceImports.add(text);
        }
        if (tsutils_1.isModuleDeclaration(statement) &&
            statement.body !== undefined &&
            statement.name.kind === ts.SyntaxKind.StringLiteral) {
            // If this is a module augmentation, re-use `seen` since those imports could be moved outside.
            // If this is an ambient module, create a fresh `seen`
            // because they should have separate imports to avoid becoming augmentations.
            walkWorker(ctx, statement.body.statements, ts.isExternalModule(ctx.sourceFile)
                ? seen
                : {
                    imports: new Set(),
                    namespaceImports: new Set(),
                });
        }
    }
}
var templateObject_1, templateObject_2, templateObject_3;
