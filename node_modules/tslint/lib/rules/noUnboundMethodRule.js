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
var OPTION_IGNORE_STATIC = "ignore-static";
var OPTION_WHITELIST = "whitelist";
var OPTION_ALLOW_TYPEOF = "allow-typeof";
var OPTION_ALLOW_DELETE = "allow-delete";
var OPTION_WHITELIST_EXAMPLE = [
    true,
    (_a = {},
        _a[OPTION_IGNORE_STATIC] = true,
        _a[OPTION_WHITELIST] = ["expect"],
        _a[OPTION_ALLOW_TYPEOF] = true,
        _a),
];
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, parseArguments(this.ruleArguments), program.getTypeChecker());
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-unbound-method",
        description: "Warns when a method is used outside of a method call.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            You may additionally pass \"", "\" to ignore static methods, or an options object.\n            \n             The object may have the following properties:\n            \n            * \"", "\" - to ignore static methods.\n            * \"", "\" - ignore methods referenced in a delete expression.\n            * \"", "\" - ignore methods referenced in a typeof expression.\n            * \"", "\" - ignore method references in parameters of specifed function calls.\n            \n            "], ["\n            You may additionally pass \"", "\" to ignore static methods, or an options object.\n            \n             The object may have the following properties:\n            \n            * \"", "\" - to ignore static methods.\n            * \"", "\" - ignore methods referenced in a delete expression.\n            * \"", "\" - ignore methods referenced in a typeof expression.\n            * \"", "\" - ignore method references in parameters of specifed function calls.\n            \n            "])), OPTION_IGNORE_STATIC, OPTION_IGNORE_STATIC, OPTION_ALLOW_DELETE, OPTION_ALLOW_TYPEOF, OPTION_WHITELIST),
        options: {
            anyOf: [
                {
                    type: "string",
                    enum: [OPTION_IGNORE_STATIC],
                },
                {
                    type: "object",
                    properties: (_b = {},
                        _b[OPTION_ALLOW_DELETE] = { type: "boolean" },
                        _b[OPTION_ALLOW_TYPEOF] = { type: "boolean" },
                        _b[OPTION_IGNORE_STATIC] = { type: "boolean" },
                        _b[OPTION_WHITELIST] = {
                            type: "array",
                            items: { type: "string" },
                            minLength: 1,
                        },
                        _b),
                },
            ],
        },
        optionExamples: [true, [true, OPTION_IGNORE_STATIC], OPTION_WHITELIST_EXAMPLE],
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Class functions don't preserve the class scope when passed as standalone variables.\n            For example, this code will log the global scope (`window`/`global`), not the class instance:\n\n            ```\n            class MyClass {\n                public log(): void {\n                    console.log(this);\n                }\n            }\n\n            const instance = new MyClass();\n            const log = instance.log;\n\n            log();\n            ```\n\n            You need to either use an arrow lambda (`() => {...}`) or call the function with the correct scope.\n\n            ```\n            class MyClass {\n                public logArrowBound = (): void => {\n                    console.log(bound);\n                };\n\n                public logManualBind(): void {\n                    console.log(this);\n                }\n            }\n\n            const instance = new MyClass();\n            const logArrowBound = instance.logArrowBound;\n            const logManualBind = instance.logManualBind.bind(instance);\n\n            logArrowBound();\n            logManualBind();\n            ```\n        "], ["\n            Class functions don't preserve the class scope when passed as standalone variables.\n            For example, this code will log the global scope (\\`window\\`/\\`global\\`), not the class instance:\n\n            \\`\\`\\`\n            class MyClass {\n                public log(): void {\n                    console.log(this);\n                }\n            }\n\n            const instance = new MyClass();\n            const log = instance.log;\n\n            log();\n            \\`\\`\\`\n\n            You need to either use an arrow lambda (\\`() => {...}\\`) or call the function with the correct scope.\n\n            \\`\\`\\`\n            class MyClass {\n                public logArrowBound = (): void => {\n                    console.log(bound);\n                };\n\n                public logManualBind(): void {\n                    console.log(this);\n                }\n            }\n\n            const instance = new MyClass();\n            const logArrowBound = instance.logArrowBound;\n            const logManualBind = instance.logManualBind.bind(instance);\n\n            logArrowBound();\n            logManualBind();\n            \\`\\`\\`\n        "]))),
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Avoid referencing unbound methods which may cause unintentional scoping of 'this'.";
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function parseArguments(args) {
    var options = {
        allowDelete: false,
        allowTypeof: false,
        ignoreStatic: false,
        whitelist: new Set(),
    };
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        if (typeof arg === "string") {
            if (arg === OPTION_IGNORE_STATIC) {
                options.ignoreStatic = true;
            }
        }
        else {
            options.allowDelete = arg[OPTION_ALLOW_DELETE] || false;
            options.allowTypeof = arg[OPTION_ALLOW_TYPEOF] || false;
            options.ignoreStatic = arg[OPTION_IGNORE_STATIC] || false;
            options.whitelist = new Set(arg[OPTION_WHITELIST]);
        }
    }
    return options;
}
function walk(ctx, tc) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isPropertyAccessExpression(node) && !isSafeUse(node)) {
            var symbol = tc.getSymbolAtLocation(node);
            var declaration = symbol === undefined ? undefined : symbol.valueDeclaration;
            var isMethodAccess = declaration !== undefined && isMethod(declaration, ctx.options.ignoreStatic);
            var shouldBeReported = isMethodAccess && !isWhitelisted(node, ctx.options);
            if (shouldBeReported) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
function isMethod(node, ignoreStatic) {
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            return !(ignoreStatic && tsutils_1.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword));
        default:
            return false;
    }
}
function isSafeUse(node) {
    var parent = node.parent;
    switch (parent.kind) {
        case ts.SyntaxKind.CallExpression:
            return parent.expression === node;
        case ts.SyntaxKind.TaggedTemplateExpression:
            return parent.tag === node;
        // E.g. `obj.method.bind(obj) or obj.method["prop"]`.
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.ElementAccessExpression:
            return true;
        // Allow most binary operators, but don't allow e.g. `myArray.forEach(obj.method || otherObj.otherMethod)`.
        case ts.SyntaxKind.BinaryExpression:
            return parent.operatorToken.kind !== ts.SyntaxKind.BarBarToken;
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.AsExpression:
        case ts.SyntaxKind.TypeAssertionExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
            return isSafeUse(parent);
        // Allow use in conditions
        case ts.SyntaxKind.ConditionalExpression:
            return parent.condition === node;
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.PrefixUnaryExpression:
            return true;
        default:
            return false;
    }
}
function isWhitelisted(node, options) {
    var whitelist = options.whitelist, allowTypeof = options.allowTypeof, allowDelete = options.allowDelete;
    if (tsutils_1.isDeleteExpression(node.parent)) {
        return allowDelete;
    }
    if (tsutils_1.isTypeOfExpression(node.parent)) {
        return allowTypeof;
    }
    if (tsutils_1.isCallExpression(node.parent) && tsutils_1.isIdentifier(node.parent.expression)) {
        var expression = node.parent.expression;
        var callingMethodName = expression.text;
        return whitelist.has(callingMethodName);
    }
    return false;
}
var templateObject_1, templateObject_2;
