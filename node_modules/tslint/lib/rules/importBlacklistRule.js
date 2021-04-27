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
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.MAKE_NAMED_IMPORT_FAILURE_STRING = function (importName) {
        return importName === "default"
            ? "Importing (or re-exporting) the default export is blacklisted."
            : "The export \"" + importName + "\" is blacklisted.";
    };
    Rule.prototype.isEnabled = function () {
        return _super.prototype.isEnabled.call(this) && this.ruleArguments.length > 0;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "import-blacklist",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Disallows importing the specified modules via `import` and `require`,\n            or importing specific named exports of the specified modules,\n            or using imports matching specified regular expression patterns."], ["\n            Disallows importing the specified modules via \\`import\\` and \\`require\\`,\n            or importing specific named exports of the specified modules,\n            or using imports matching specified regular expression patterns."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            For some libraries, importing the library directly can cause unused\n            submodules to be loaded, so you may want to block these imports and\n            require that users directly import only the submodules they need.\n            In other cases, you may simply want to ban an import because using\n            it is undesirable or unsafe."], ["\n            For some libraries, importing the library directly can cause unused\n            submodules to be loaded, so you may want to block these imports and\n            require that users directly import only the submodules they need.\n            In other cases, you may simply want to ban an import because using\n            it is undesirable or unsafe."]))),
        optionsDescription: "A list of blacklisted modules, named imports, or regular expression patterns.",
        options: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "string",
                        minLength: 1,
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "string",
                                minLength: 1,
                            },
                        },
                    },
                    {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        minLength: 1,
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, "rxjs", "lodash"],
            [true, [".*\\.temp$", ".*\\.tmp$"]],
            [true, { lodash: ["pull", "pullAll"] }],
            [true, "lodash", { lodash: ["pull", "pullAll"] }],
            [true, "rxjs", { lodash: ["pull", "pullAll"] }, [".*\\.temp$", ".*\\.tmp$"]],
        ],
        type: "functionality",
        typescriptOnly: false,
    };
    Rule.WHOLE_MODULE_FAILURE_STRING = "Importing this module is blacklisted. Try importing a submodule instead.";
    Rule.IMPLICIT_NAMED_IMPORT_FAILURE_STRING = "Some named exports from this module are blacklisted for importing " +
        "(or re-exporting). Import/re-export only the specific values you want, " +
        "instead of the whole module.";
    Rule.FAILURE_STRING_REGEX = "This import is blacklisted by ";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    // Merge/normalize options.
    // E.g., ["a", { "b": ["c"], "d": ["e", "e"] }, "f", { "f": ["g"] }]
    // becomes { "a": true, "b": Set(["c"]), "d": Set(["e"]), "f": true }.
    var bannedImports = ctx.options.reduce(function (acc, it) {
        if (typeof it === "string") {
            acc[it] = true;
        }
        else if (!Array.isArray(it)) {
            Object.keys(it).forEach(function (moduleName) {
                if (acc[moduleName] instanceof Set) {
                    it[moduleName].forEach(function (bannedImport) {
                        acc[moduleName].add(bannedImport);
                    });
                }
                else if (acc[moduleName] !== true) {
                    acc[moduleName] = new Set(it[moduleName]);
                }
            });
        }
        return acc;
    }, Object.create(null));
    var regexOptions = [];
    for (var _i = 0, _a = ctx.options; _i < _a.length; _i++) {
        var option = _a[_i];
        if (Array.isArray(option)) {
            for (var _b = 0, option_1 = option; _b < option_1.length; _b++) {
                var pattern = option_1[_b];
                regexOptions.push(RegExp(pattern));
            }
        }
    }
    for (var _c = 0, _d = tsutils_1.findImports(ctx.sourceFile, 63 /* All */); _c < _d.length; _c++) {
        var name = _d[_c];
        // TODO #3963: Resolve/normalize relative file imports to a canonical path?
        var importedModule = name.text;
        var bansForModule = bannedImports[importedModule];
        // Check if at least some imports from this module are banned.
        if (bansForModule !== undefined) {
            // If importing this module is totally banned, we can error now,
            // without determining whether the user is importing the whole
            // module or named exports.
            if (bansForModule === true) {
                ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.WHOLE_MODULE_FAILURE_STRING);
                continue;
            }
            // Otherwise, find the named imports, if any, and fail if the
            // user tried to import any of them. We don't have named imports
            // when the user is importing the whole module, which includes:
            //
            // - ImportKind.Require (i.e., `require('module-specifier')`),
            // - ImportKind.DynamicImport (i.e., `import("module-specifier")`),
            // - ImportKind.ImportEquals (i.e., `import x = require()`),
            // - and ImportKind.ImportDeclaration, where there's a full namespace
            //   import (i.e. `import * as x from "module-specifier"`)
            //
            // However, namedImports will be an array when we have one of the
            // various permutations of `import x, { a, b as c } from "y"`.
            //
            // We treat re-exports from other modules the same as attempting to
            // import the re-exported binding(s), as the re-export is essentially
            // an import followed by an export, and not treating these as an
            // import would allow backdoor imports of the banned bindings. So,
            // our last case is `ImportKind.ExportFrom`, and for that:
            //
            // - `export nameForDefault from "module"` isn't part of the ESM
            // syntax (yet), so we only have to handle two cases below:
            // `export { x } from "y"` and `export * from "specifier"`.
            var parentNode = name.parent;
            // Disable strict-boolean-expressions for the next few lines so our &&
            // checks can help type inference figure out if when don't have undefined.
            // tslint:disable strict-boolean-expressions
            var importClause = parentNode && tsutils_1.isImportDeclaration(parentNode) ? parentNode.importClause : undefined;
            var importsDefaultExport = importClause && Boolean(importClause.name);
            // Below, check isNamedImports to rule out the
            // `import * as ns from "..."` case.
            var importsSpecificNamedExports = importClause &&
                importClause.namedBindings &&
                tsutils_1.isNamedImports(importClause.namedBindings);
            // If parentNode is an ExportDeclaration, it must represent an
            // `export from`, as findImports verifies that. Then, if exportClause
            // is undefined, we're dealing with `export * from ...`.
            var reExportsSpecificNamedExports = parentNode && tsutils_1.isExportDeclaration(parentNode) && Boolean(parentNode.exportClause);
            // tslint:enable strict-boolean-expressions
            if (importsDefaultExport ||
                importsSpecificNamedExports ||
                reExportsSpecificNamedExports) {
                // Add an import for the default import and any named bindings.
                // For the named bindings, we use the name of the export from the
                // module (i.e., .propertyName) over its alias in the import when
                // the two diverge.
                var toExportName = function (it) {
                    return (it.propertyName || it.name).text;
                }; // tslint:disable-line strict-boolean-expressions
                var exportClause = reExportsSpecificNamedExports
                    ? parentNode.exportClause
                    : undefined;
                var namedImportsOrReExports = tslib_1.__spreadArrays((importsDefaultExport ? ["default"] : []), (importsSpecificNamedExports
                    ? importClause.namedBindings.elements.map(toExportName)
                    : []), (exportClause !== undefined && tsutils_1.isNamedExports(exportClause)
                    ? exportClause.elements.map(toExportName)
                    : []));
                for (var _e = 0, namedImportsOrReExports_1 = namedImportsOrReExports; _e < namedImportsOrReExports_1.length; _e++) {
                    var importName = namedImportsOrReExports_1[_e];
                    if (bansForModule.has(importName)) {
                        ctx.addFailureAtNode(exportClause !== undefined ? exportClause : importClause, Rule.MAKE_NAMED_IMPORT_FAILURE_STRING(importName));
                    }
                }
            }
            else {
                // If we're here, the user tried to import/re-export the whole module
                ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.IMPLICIT_NAMED_IMPORT_FAILURE_STRING);
            }
        }
        for (var _f = 0, regexOptions_1 = regexOptions; _f < regexOptions_1.length; _f++) {
            var regex = regexOptions_1[_f];
            if (regex.test(name.text)) {
                ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.FAILURE_STRING_REGEX + regex.toString());
            }
        }
    }
}
var templateObject_1, templateObject_2;
