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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var strictComparisons_examples_1 = require("./code-examples/strictComparisons.examples");
var OPTION_ALLOW_OBJECT_EQUAL_COMPARISON = "allow-object-equal-comparison";
var OPTION_ALLOW_STRING_ORDER_COMPARISON = "allow-string-order-comparison";
var typeNames = (_a = {},
    _a[0 /* Any */] = "any",
    _a[1 /* Number */] = "number",
    _a[2 /* Enum */] = "enum",
    _a[3 /* String */] = "string",
    _a[4 /* Boolean */] = "boolean",
    _a[5 /* Null */] = "null",
    _a[6 /* Undefined */] = "undefined",
    _a[7 /* Object */] = "object",
    _a);
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.INVALID_TYPES = function (types1, types2) {
        var types1String = types1.map(function (type) { return typeNames[type]; }).join(" | ");
        var types2String = types2.map(function (type) { return typeNames[type]; }).join(" | ");
        return "Cannot compare type '" + types1String + "' to type '" + types2String + "'.";
    };
    Rule.INVALID_TYPE_FOR_OPERATOR = function (type, comparator) {
        return "Cannot use '" + comparator + "' comparator for type '" + typeNames[type] + "'.";
    };
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, this.getRuleOptions(), program);
    };
    Rule.prototype.getRuleOptions = function () {
        if (this.ruleArguments[0] === undefined) {
            return {};
        }
        else {
            return this.ruleArguments[0];
        }
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "strict-comparisons",
        description: "Only allow comparisons between primitives.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n                One of the following arguments may be optionally provided:\n                * `", "` allows `!=` `==` `!==` `===` comparison between any types.\n                * `", "` allows `>` `<` `>=` `<=` comparison between strings."], ["\n                One of the following arguments may be optionally provided:\n                * \\`", "\\` allows \\`!=\\` \\`==\\` \\`!==\\` \\`===\\` comparison between any types.\n                * \\`", "\\` allows \\`>\\` \\`<\\` \\`>=\\` \\`<=\\` comparison between strings."])), OPTION_ALLOW_OBJECT_EQUAL_COMPARISON, OPTION_ALLOW_STRING_ORDER_COMPARISON),
        options: {
            type: "object",
            properties: (_b = {},
                _b[OPTION_ALLOW_OBJECT_EQUAL_COMPARISON] = {
                    type: "boolean",
                },
                _b[OPTION_ALLOW_STRING_ORDER_COMPARISON] = {
                    type: "boolean",
                },
                _b),
        },
        optionExamples: [
            true,
            [
                true,
                (_c = {},
                    _c[OPTION_ALLOW_OBJECT_EQUAL_COMPARISON] = false,
                    _c[OPTION_ALLOW_STRING_ORDER_COMPARISON] = false,
                    _c),
            ],
        ],
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n                When using comparison operators to compare objects, they compare references and not values.\n                This is often done accidentally.\n                With this rule, `>`, `>=`, `<`, `<=` operators are only allowed when comparing `numbers`.\n                `===`, `!==` are allowed for `number` `string` and `boolean` types and if one of the\n                operands is `null` or `undefined`.\n            "], ["\n                When using comparison operators to compare objects, they compare references and not values.\n                This is often done accidentally.\n                With this rule, \\`>\\`, \\`>=\\`, \\`<\\`, \\`<=\\` operators are only allowed when comparing \\`numbers\\`.\n                \\`===\\`, \\`!==\\` are allowed for \\`number\\` \\`string\\` and \\`boolean\\` types and if one of the\n                operands is \\`null\\` or \\`undefined\\`.\n            "]))),
        type: "functionality",
        typescriptOnly: false,
        requiresTypeInfo: true,
        codeExamples: strictComparisons_examples_1.codeExamples,
    };
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, program) {
    var sourceFile = ctx.sourceFile, options = ctx.options;
    var checker = program.getTypeChecker();
    return ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isBinaryExpression(node) && isComparisonOperator(node)) {
            var isEquality = isEqualityOperator(node);
            var leftType = checker.getTypeAtLocation(node.left);
            var rightType = checker.getTypeAtLocation(node.right);
            if ((containsNullOrUndefined(leftType) || containsNullOrUndefined(rightType)) &&
                isEquality) {
                return;
            }
            var leftKinds = getTypes(leftType);
            var rightKinds = getTypes(rightType);
            var operandKind = getStrictestComparableType(leftKinds, rightKinds);
            if (operandKind === undefined) {
                var failureString = Rule.INVALID_TYPES(leftKinds, rightKinds);
                ctx.addFailureAtNode(node, failureString);
            }
            else {
                var failureString = Rule.INVALID_TYPE_FOR_OPERATOR(operandKind, node.operatorToken.getText());
                if (isEquality) {
                    // Check !=, ==, !==, ===
                    switch (operandKind) {
                        case 0 /* Any */:
                        case 1 /* Number */:
                        case 2 /* Enum */:
                        case 3 /* String */:
                        case 4 /* Boolean */:
                            break;
                        case 5 /* Null */:
                        case 6 /* Undefined */:
                        case 7 /* Object */:
                            if (options[OPTION_ALLOW_OBJECT_EQUAL_COMPARISON]) {
                                break;
                            }
                            ctx.addFailureAtNode(node, failureString);
                            break;
                        default:
                            ctx.addFailureAtNode(node, failureString);
                    }
                }
                else {
                    // Check >, <, >=, <=
                    switch (operandKind) {
                        case 0 /* Any */:
                        case 1 /* Number */:
                            break;
                        case 3 /* String */:
                            if (options[OPTION_ALLOW_STRING_ORDER_COMPARISON]) {
                                break;
                            }
                            ctx.addFailureAtNode(node, failureString);
                            break;
                        default:
                            ctx.addFailureAtNode(node, failureString);
                    }
                }
            }
        }
        return ts.forEachChild(node, cb);
    });
}
function containsNullOrUndefined(type) {
    return (type.intrinsicName === "null" ||
        type.intrinsicName === "undefined");
}
function getTypes(types) {
    // Compatibility for TypeScript pre-2.4, which used EnumLiteralType instead of LiteralType
    var baseType = types.baseType;
    return tsutils_1.isUnionType(types)
        ? Array.from(new Set(types.types.map(getKind)))
        : tsutils_1.isTypeFlagSet(types, ts.TypeFlags.EnumLiteral) && typeof baseType !== "undefined"
            ? [getKind(baseType)]
            : [getKind(types)];
}
function getStrictestComparableType(typesLeft, typesRight) {
    var overlappingTypes = typesLeft.filter(function (type) { return typesRight.indexOf(type) >= 0; });
    if (overlappingTypes.length > 0) {
        return getStrictestKind(overlappingTypes);
    }
    else {
        // In case one of the types is "any", get the strictest type of the other array
        if (arrayContainsKind(typesLeft, [0 /* Any */])) {
            return getStrictestKind(typesRight);
        }
        if (arrayContainsKind(typesRight, [0 /* Any */])) {
            return getStrictestKind(typesLeft);
        }
        // In case one array contains NullOrUndefined and the other an Object, return Object
        if ((arrayContainsKind(typesLeft, [5 /* Null */, 6 /* Undefined */]) &&
            arrayContainsKind(typesRight, [7 /* Object */])) ||
            (arrayContainsKind(typesRight, [5 /* Null */, 6 /* Undefined */]) &&
                arrayContainsKind(typesLeft, [7 /* Object */]))) {
            return 7 /* Object */;
        }
        return undefined;
    }
}
function arrayContainsKind(types, typeToCheck) {
    return types.some(function (type) { return typeToCheck.indexOf(type) >= 0; });
}
function getStrictestKind(types) {
    // tslint:disable-next-line:no-unsafe-any
    return Math.max.apply(Math, types);
}
function isComparisonOperator(node) {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.LessThanToken:
        case ts.SyntaxKind.GreaterThanToken:
        case ts.SyntaxKind.LessThanEqualsToken:
        case ts.SyntaxKind.GreaterThanEqualsToken:
        case ts.SyntaxKind.EqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsToken:
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return true;
        default:
            return false;
    }
}
function isEqualityOperator(node) {
    switch (node.operatorToken.kind) {
        case ts.SyntaxKind.EqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsToken:
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return true;
        default:
            return false;
    }
}
function getKind(type) {
    // tslint:disable:no-bitwise
    if (is(ts.TypeFlags.String | ts.TypeFlags.StringLiteral)) {
        return 3 /* String */;
    }
    else if (is(ts.TypeFlags.Number | ts.TypeFlags.NumberLiteral)) {
        return 1 /* Number */;
    }
    else if (is(ts.TypeFlags.BooleanLike)) {
        return 4 /* Boolean */;
    }
    else if (is(ts.TypeFlags.Null)) {
        return 5 /* Null */;
    }
    else if (is(ts.TypeFlags.Undefined)) {
        return 6 /* Undefined */;
    }
    else if (is(ts.TypeFlags.Any)) {
        return 0 /* Any */;
    }
    else {
        return 7 /* Object */;
    }
    // tslint:enable:no-bitwise
    function is(flags) {
        return tsutils_1.isTypeFlagSet(type, flags);
    }
}
var templateObject_1, templateObject_2;
