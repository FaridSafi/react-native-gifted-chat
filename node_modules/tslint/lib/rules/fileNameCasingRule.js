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
var path = require("path");
var error_1 = require("../error");
var Lint = require("../index");
var utils_1 = require("../utils");
var Casing;
(function (Casing) {
    Casing["CamelCase"] = "camel-case";
    Casing["PascalCase"] = "pascal-case";
    Casing["Ignored"] = "ignore";
    Casing["KebabCase"] = "kebab-case";
    Casing["SnakeCase"] = "snake-case";
})(Casing || (Casing = {}));
var rules = [
    Casing.CamelCase,
    Casing.Ignored,
    Casing.PascalCase,
    Casing.KebabCase,
    Casing.SnakeCase,
];
var validCasingOptions = new Set(rules);
function isCorrectCasing(fileName, casing) {
    switch (casing) {
        case Casing.CamelCase:
            return utils_1.isCamelCased(fileName);
        case Casing.PascalCase:
            return utils_1.isPascalCased(fileName);
        case Casing.Ignored:
            return true;
        case Casing.KebabCase:
            return utils_1.isKebabCased(fileName);
        case Casing.SnakeCase:
            return utils_1.isSnakeCased(fileName);
    }
}
var getValidRegExp = function (regExpString) {
    try {
        return RegExp(regExpString, "i");
    }
    catch (_a) {
        return undefined;
    }
};
var validateWithRegexConfig = function (sourceFile, casingConfig) {
    var fileBaseName = path.parse(sourceFile.fileName).base;
    var fileNameMatches = Object.keys(casingConfig);
    if (fileNameMatches.length === 0) {
        Rule.showWarning("At least one file name match must be provided");
        return undefined;
    }
    for (var _i = 0, fileNameMatches_1 = fileNameMatches; _i < fileNameMatches_1.length; _i++) {
        var rawMatcher = fileNameMatches_1[_i];
        var regex = getValidRegExp(rawMatcher);
        if (regex === undefined) {
            Rule.showWarning("Invalid regular expression provided: " + rawMatcher);
            continue;
        }
        var casing = casingConfig[rawMatcher];
        if (!validCasingOptions.has(casing)) {
            Rule.showWarning("Unexpected casing option provided: " + casing);
            continue;
        }
        if (!regex.test(fileBaseName)) {
            continue;
        }
        return isCorrectCasing(fileBaseName, casing) ? undefined : casing;
    }
    return undefined;
};
var validateWithSimpleConfig = function (sourceFile, casingConfig) {
    if (!validCasingOptions.has(casingConfig)) {
        Rule.showWarning("Unexpected casing option provided: " + casingConfig);
        return undefined;
    }
    var fileName = path.parse(sourceFile.fileName).name;
    var isValid = isCorrectCasing(fileName, casingConfig);
    return isValid ? undefined : casingConfig;
};
var validate = function (sourceFile, casingConfig) {
    if (casingConfig === undefined) {
        Rule.showWarning("Provide a rule option as string or object");
        return undefined;
    }
    if (typeof casingConfig === "string") {
        return validateWithSimpleConfig(sourceFile, casingConfig);
    }
    if (typeof casingConfig === "object") {
        return validateWithRegexConfig(sourceFile, casingConfig);
    }
    Rule.showWarning("Received unexpected rule option");
    return undefined;
};
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.showWarning = function (message) {
        error_1.showWarningOnce("Warning: " + Rule.metadata.ruleName + " - " + message);
    };
    Rule.FAILURE_STRING = function (expectedCasing) {
        return "File name must be " + Rule.stylizedNameForCasing(expectedCasing);
    };
    Rule.stylizedNameForCasing = function (casing) {
        switch (casing) {
            case Casing.CamelCase:
                return "camelCase";
            case Casing.PascalCase:
                return "PascalCase";
            case Casing.Ignored:
                return "ignored";
            case Casing.KebabCase:
                return "kebab-case";
            case Casing.SnakeCase:
                return "snake_case";
        }
    };
    Rule.prototype.apply = function (sourceFile) {
        if (this.ruleArguments.length !== 1) {
            return [];
        }
        var casingConfig = this.ruleArguments[0];
        var validation = validate(sourceFile, casingConfig);
        return validation === undefined
            ? []
            : [
                new Lint.RuleFailure(sourceFile, 0, 0, Rule.FAILURE_STRING(validation), this.ruleName),
            ];
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "file-name-casing",
        description: "Enforces a consistent file naming convention",
        rationale: "Helps maintain a consistent style across a file hierarchy",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            One of the following arguments must be provided:\n\n            * `", "`: File names must be camel-cased: `fileName.ts`.\n            * `", "`: File names must be Pascal-cased: `FileName.ts`.\n            * `", "`: File names must be kebab-cased: `file-name.ts`.\n            * `", "`: File names must be snake-cased: `file_name.ts`.\n            * `", "`: File names are ignored _(useful for the object configuration)_.\n\n            Or an object, where the key represents a regular expression that\n            matches the file name, and the value is the file name rule from\n            the previous list.\n\n            * { \".tsx\": \"", "\", \".ts\": \"", "\" }\n        "], ["\n            One of the following arguments must be provided:\n\n            * \\`", "\\`: File names must be camel-cased: \\`fileName.ts\\`.\n            * \\`", "\\`: File names must be Pascal-cased: \\`FileName.ts\\`.\n            * \\`", "\\`: File names must be kebab-cased: \\`file-name.ts\\`.\n            * \\`", "\\`: File names must be snake-cased: \\`file_name.ts\\`.\n            * \\`", "\\`: File names are ignored _(useful for the object configuration)_.\n\n            Or an object, where the key represents a regular expression that\n            matches the file name, and the value is the file name rule from\n            the previous list.\n\n            * \\{ \\\".tsx\\\": \\\"", "\\\", \\\".ts\\\": \\\"", "\\\" \\}\n        "])), Casing.CamelCase, Casing.PascalCase, Casing.KebabCase, Casing.SnakeCase, Casing.Ignored, Casing.PascalCase, Casing.CamelCase),
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        type: "array",
                        items: [
                            {
                                type: "string",
                                enum: rules,
                            },
                        ],
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            type: "string",
                            enum: rules,
                        },
                        minProperties: 1,
                    },
                ],
            },
        },
        optionExamples: [
            [true, Casing.CamelCase],
            [true, Casing.PascalCase],
            [true, Casing.KebabCase],
            [true, Casing.SnakeCase],
            [
                true,
                {
                    ".tsx": Casing.PascalCase,
                    ".ts": Casing.CamelCase,
                },
            ],
            [
                true,
                {
                    ".style.ts": Casing.KebabCase,
                    ".tsx": Casing.PascalCase,
                    ".*": Casing.CamelCase,
                },
            ],
            [
                true,
                {
                    ".ts": Casing.Ignored,
                    ".tsx": Casing.PascalCase,
                },
            ],
        ],
        hasFix: false,
        type: "style",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var templateObject_1;
