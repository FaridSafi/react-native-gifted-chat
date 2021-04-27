"use strict";
/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
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
var fromModulesConfigOptionName = "fromModules";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.getNamedDefaultImport = function (namedBindings) {
        for (var _i = 0, _a = namedBindings.elements; _i < _a.length; _i++) {
            var importSpecifier = _a[_i];
            if (importSpecifier.propertyName !== undefined &&
                importSpecifier.propertyName.text === "default") {
                return importSpecifier.propertyName;
            }
        }
        return null;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions(this.ruleArguments));
    };
    Rule.prototype.isFromModulesConfigOption = function (option) {
        return typeof option === "object" && option[fromModulesConfigOptionName] !== undefined;
    };
    Rule.prototype.getRuleOptions = function (options) {
        var _a, _b;
        var fromModuleConfigOption = options.find(this.isFromModulesConfigOption);
        if (fromModuleConfigOption !== undefined &&
            typeof fromModuleConfigOption[fromModulesConfigOptionName] === "string") {
            return _a = {},
                _a[fromModulesConfigOptionName] = new RegExp(fromModuleConfigOption[fromModulesConfigOptionName]),
                _a;
        }
        else {
            return _b = {},
                _b[fromModulesConfigOptionName] = new RegExp("^\\./|^\\.\\./"),
                _b;
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-default-import",
        description: "Disallows importing default members from certain ES6-style modules.",
        descriptionDetails: "Import named members instead.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Named imports/exports [promote clarity](https://github.com/palantir/tslint/issues/1182#issue-151780453).\n            In addition, current tooling differs on the correct way to handle default imports/exports.\n            Avoiding them all together can help avoid tooling bugs and conflicts.\n\n            The rule supposed to narrow the scope of your changes in the case of monorepo.\n            Say, you have packages `A`, `B`, `C` and `utils`, where `A`, `B`, `C` dependends on `utils`,\n            which is full of default exports.\n            `\"no-default-export\"` requires you to remove default _export_ from `utils`, which leads to changes\n            in packages `A`, `B`, `C`. It's harder to get merged bigger changeset by various reasons (harder to get your code approved\n            due to a number of required reviewers; longer build time due to a number of affected packages)\n            and could result in ignored `\"no-default-export\"` rule in `utils'`.\n\n            Unlike `\"no-default-export\"`, the rule requires you to replace default _import_ with named only in `A` you work on,\n            and `utils` you import from."], ["\n            Named imports/exports [promote clarity](https://github.com/palantir/tslint/issues/1182#issue-151780453).\n            In addition, current tooling differs on the correct way to handle default imports/exports.\n            Avoiding them all together can help avoid tooling bugs and conflicts.\n\n            The rule supposed to narrow the scope of your changes in the case of monorepo.\n            Say, you have packages \\`A\\`, \\`B\\`, \\`C\\` and \\`utils\\`, where \\`A\\`, \\`B\\`, \\`C\\` dependends on \\`utils\\`,\n            which is full of default exports.\n            \\`\"no-default-export\"\\` requires you to remove default _export_ from \\`utils\\`, which leads to changes\n            in packages \\`A\\`, \\`B\\`, \\`C\\`. It's harder to get merged bigger changeset by various reasons (harder to get your code approved\n            due to a number of required reviewers; longer build time due to a number of affected packages)\n            and could result in ignored \\`\"no-default-export\"\\` rule in \\`utils'\\`.\n\n            Unlike \\`\"no-default-export\"\\`, the rule requires you to replace default _import_ with named only in \\`A\\` you work on,\n            and \\`utils\\` you import from."]))),
        optionsDescription: "optionsDescription",
        options: {
            type: "array",
            items: {
                type: "object",
                properties: (_a = {},
                    _a[fromModulesConfigOptionName] = { type: "string" },
                    _a),
                required: ["fromModules"],
            },
        },
        optionExamples: [
            [true, (_b = {}, _b[fromModulesConfigOptionName] = "^palantir-|^_internal-*|^\\./|^\\.\\./", _b)],
        ],
        type: "maintainability",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Import of default members from this module is forbidden. Import named member instead";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    if (ctx.sourceFile.isDeclarationFile || !ts.isExternalModule(ctx.sourceFile)) {
        return;
    }
    for (var _i = 0, _a = ctx.sourceFile.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (tsutils_1.isImportDeclaration(statement)) {
            var importClause = statement.importClause, moduleSpecifier = statement.moduleSpecifier;
            if (importClause !== undefined &&
                tsutils_1.isStringLiteral(moduleSpecifier) &&
                ctx.options[fromModulesConfigOptionName].test(moduleSpecifier.text)) {
                // module name matches specified in rule config
                if (importClause.name !== undefined) {
                    // `import Foo...` syntax
                    var defaultImportedName = importClause.name;
                    ctx.addFailureAtNode(defaultImportedName, Rule.FAILURE_STRING);
                }
                else if (importClause.namedBindings !== undefined &&
                    tsutils_1.isNamedImports(importClause.namedBindings)) {
                    // `import { default...` syntax
                    var defaultMember = Rule.getNamedDefaultImport(importClause.namedBindings);
                    if (defaultMember !== null) {
                        ctx.addFailureAtNode(defaultMember, Rule.FAILURE_STRING);
                    }
                }
            }
        }
    }
}
var templateObject_1;
