"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var exclusions_1 = require("./completed-docs/exclusions");
exports.ALL = "all";
exports.ARGUMENT_CLASSES = "classes";
exports.ARGUMENT_CONSTRUCTORS = "constructors";
exports.ARGUMENT_ENUMS = "enums";
exports.ARGUMENT_ENUM_MEMBERS = "enum-members";
exports.ARGUMENT_FUNCTIONS = "functions";
exports.ARGUMENT_INTERFACES = "interfaces";
exports.ARGUMENT_METHODS = "methods";
exports.ARGUMENT_NAMESPACES = "namespaces";
exports.ARGUMENT_PROPERTIES = "properties";
exports.ARGUMENT_TYPES = "types";
exports.ARGUMENT_VARIABLES = "variables";
exports.DESCRIPTOR_TAGS = "tags";
exports.DESCRIPTOR_LOCATIONS = "locations";
exports.DESCRIPTOR_OVERLOADS = "overloads";
exports.DESCRIPTOR_PRIVACIES = "privacies";
exports.DESCRIPTOR_VISIBILITIES = "visibilities";
exports.LOCATION_INSTANCE = "instance";
exports.LOCATION_STATIC = "static";
exports.PRIVACY_PRIVATE = "private";
exports.PRIVACY_PROTECTED = "protected";
exports.PRIVACY_PUBLIC = "public";
exports.TAGS_FOR_CONTENT = "content";
exports.TAGS_FOR_EXISTENCE = "existence";
exports.VISIBILITY_EXPORTED = "exported";
exports.VISIBILITY_INTERNAL = "internal";
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getOptions();
        var exclusionsMap = this.getExclusionsMap(options.ruleArguments);
        return this.applyWithFunction(sourceFile, walk, exclusionsMap);
    };
    Rule.prototype.getExclusionsMap = function (ruleArguments) {
        if (ruleArguments.length === 0) {
            ruleArguments = [Rule.defaultArguments];
        }
        return exclusions_1.constructExclusionsMap(ruleArguments);
    };
    Rule.FAILURE_STRING_EXIST = "Documentation must exist for ";
    Rule.defaultArguments = (_a = {},
        _a[exports.ARGUMENT_CLASSES] = true,
        _a[exports.ARGUMENT_FUNCTIONS] = true,
        _a[exports.ARGUMENT_METHODS] = (_b = {},
            _b[exports.DESCRIPTOR_TAGS] = (_c = {},
                _c[exports.TAGS_FOR_CONTENT] = {
                    see: ".*",
                },
                _c[exports.TAGS_FOR_EXISTENCE] = ["deprecated", "inheritdoc"],
                _c),
            _b),
        _a[exports.ARGUMENT_PROPERTIES] = (_d = {},
            _d[exports.DESCRIPTOR_TAGS] = (_e = {},
                _e[exports.TAGS_FOR_CONTENT] = {
                    see: ".*",
                },
                _e[exports.TAGS_FOR_EXISTENCE] = ["deprecated", "inheritdoc"],
                _e),
            _d),
        _a);
    Rule.ARGUMENT_DESCRIPTOR_BLOCK = {
        properties: (_f = {},
            _f[exports.DESCRIPTOR_TAGS] = {
                properties: (_g = {},
                    _g[exports.TAGS_FOR_CONTENT] = {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    _g[exports.TAGS_FOR_EXISTENCE] = {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    _g),
            },
            _f[exports.DESCRIPTOR_VISIBILITIES] = {
                enum: [exports.ALL, exports.VISIBILITY_EXPORTED, exports.VISIBILITY_INTERNAL],
                type: "string",
            },
            _f),
        type: "object",
    };
    Rule.ARGUMENT_DESCRIPTOR_CLASS = {
        properties: (_h = {},
            _h[exports.DESCRIPTOR_TAGS] = {
                properties: (_j = {},
                    _j[exports.TAGS_FOR_CONTENT] = {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    _j[exports.TAGS_FOR_EXISTENCE] = {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    _j),
            },
            _h[exports.DESCRIPTOR_LOCATIONS] = {
                enum: [exports.ALL, exports.LOCATION_INSTANCE, exports.LOCATION_STATIC],
                type: "string",
            },
            _h[exports.DESCRIPTOR_PRIVACIES] = {
                enum: [exports.ALL, exports.PRIVACY_PRIVATE, exports.PRIVACY_PROTECTED, exports.PRIVACY_PUBLIC],
                type: "string",
            },
            _h),
        type: "object",
    };
    Rule.ARGUMENT_DESCRIPTOR_CONSTRUCTOR = {
        properties: (_k = {},
            _k[exports.DESCRIPTOR_TAGS] = {
                properties: (_l = {},
                    _l[exports.TAGS_FOR_CONTENT] = {
                        items: {
                            type: "string",
                        },
                        type: "object",
                    },
                    _l[exports.TAGS_FOR_EXISTENCE] = {
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    _l),
            },
            _k[exports.DESCRIPTOR_PRIVACIES] = {
                enum: [exports.ALL, exports.PRIVACY_PRIVATE, exports.PRIVACY_PROTECTED, exports.PRIVACY_PUBLIC],
                type: "string",
            },
            _k[exports.DESCRIPTOR_OVERLOADS] = {
                type: "boolean",
            },
            _k),
        type: "object",
    };
    Rule.ARGUMENT_DESCRIPTOR_FUNCTION = {
        properties: tslib_1.__assign(tslib_1.__assign({}, Rule.ARGUMENT_DESCRIPTOR_BLOCK.properties), (_m = {}, _m[exports.DESCRIPTOR_OVERLOADS] = {
            type: "boolean",
        }, _m)),
        type: "object",
    };
    Rule.ARGUMENT_DESCRIPTOR_METHOD = {
        properties: tslib_1.__assign(tslib_1.__assign({}, Rule.ARGUMENT_DESCRIPTOR_CLASS.properties), (_o = {}, _o[exports.DESCRIPTOR_OVERLOADS] = {
            type: "boolean",
        }, _o)),
        type: "object",
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "completed-docs",
        description: "Enforces JSDoc comments for important items be filled out.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            `true` to enable for `[", "]`,\n            or an array with each item in one of two formats:\n\n            * `string` to enable for that type\n            * `object` keying types to when their documentation is required:\n                * `\"", "\"` and `\"", "\"` may specify:\n                    * `\"", "\"`:\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                    * `\"", "\"`:\n                        * `\"", "\"`\n                        * `\"", "\"`\n                        * `\"", "\"`\n                * Other types may specify `\"", "\"`:\n                    * `\"", "\"`\n                    * `\"", "\"`\n                    * `\"", "\"`\n                * `\"", "\"` `\"", "\"` may also specify `\"", "\"`\n                  to indicate that each overload should have its own documentation, which is `false` by default.\n                * All types may also provide `\"", "\"`\n                  with members specifying tags that allow the docs to not have a body.\n                    * `\"", "\"`: Object mapping tags to `RegExp` bodies content allowed to count as complete docs.\n                    * `\"", "\"`: Array of tags that must only exist to count as complete docs.\n\n            Types that may be enabled are:\n\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`\n            * `\"", "\"`"], ["\n            \\`true\\` to enable for \\`[", "]\\`,\n            or an array with each item in one of two formats:\n\n            * \\`string\\` to enable for that type\n            * \\`object\\` keying types to when their documentation is required:\n                * \\`\"", "\"\\` and \\`\"", "\"\\` may specify:\n                    * \\`\"", "\"\\`:\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`:\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                        * \\`\"", "\"\\`\n                * Other types may specify \\`\"", "\"\\`:\n                    * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`\n                    * \\`\"", "\"\\`\n                * \\`\"", "\"\\` \\`\"", "\"\\` may also specify \\`\"", "\"\\`\n                  to indicate that each overload should have its own documentation, which is \\`false\\` by default.\n                * All types may also provide \\`\"", "\"\\`\n                  with members specifying tags that allow the docs to not have a body.\n                    * \\`\"", "\"\\`: Object mapping tags to \\`RegExp\\` bodies content allowed to count as complete docs.\n                    * \\`\"", "\"\\`: Array of tags that must only exist to count as complete docs.\n\n            Types that may be enabled are:\n\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`\n            * \\`\"", "\"\\`"])), Object.keys(Rule.defaultArguments).join(", "), exports.ARGUMENT_METHODS, exports.ARGUMENT_PROPERTIES, exports.DESCRIPTOR_PRIVACIES, exports.ALL, exports.PRIVACY_PRIVATE, exports.PRIVACY_PROTECTED, exports.PRIVACY_PUBLIC, exports.DESCRIPTOR_LOCATIONS, exports.ALL, exports.LOCATION_INSTANCE, exports.LOCATION_STATIC, exports.DESCRIPTOR_VISIBILITIES, exports.ALL, exports.VISIBILITY_EXPORTED, exports.VISIBILITY_INTERNAL, exports.ARGUMENT_FUNCTIONS, exports.ARGUMENT_METHODS, exports.DESCRIPTOR_OVERLOADS, exports.DESCRIPTOR_TAGS, exports.TAGS_FOR_CONTENT, exports.TAGS_FOR_EXISTENCE, exports.ARGUMENT_CLASSES, exports.ARGUMENT_CONSTRUCTORS, exports.ARGUMENT_ENUMS, exports.ARGUMENT_ENUM_MEMBERS, exports.ARGUMENT_FUNCTIONS, exports.ARGUMENT_INTERFACES, exports.ARGUMENT_METHODS, exports.ARGUMENT_NAMESPACES, exports.ARGUMENT_PROPERTIES, exports.ARGUMENT_TYPES, exports.ARGUMENT_VARIABLES),
        options: {
            type: "array",
            items: {
                anyOf: [
                    {
                        options: [
                            exports.ARGUMENT_CLASSES,
                            exports.ARGUMENT_ENUMS,
                            exports.ARGUMENT_FUNCTIONS,
                            exports.ARGUMENT_INTERFACES,
                            exports.ARGUMENT_METHODS,
                            exports.ARGUMENT_NAMESPACES,
                            exports.ARGUMENT_PROPERTIES,
                            exports.ARGUMENT_TYPES,
                            exports.ARGUMENT_VARIABLES,
                        ],
                        type: "string",
                    },
                    {
                        type: "object",
                        properties: (_p = {},
                            _p[exports.ARGUMENT_CLASSES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_CONSTRUCTORS] = Rule.ARGUMENT_DESCRIPTOR_CONSTRUCTOR,
                            _p[exports.ARGUMENT_ENUMS] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_ENUM_MEMBERS] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_FUNCTIONS] = Rule.ARGUMENT_DESCRIPTOR_FUNCTION,
                            _p[exports.ARGUMENT_INTERFACES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_METHODS] = Rule.ARGUMENT_DESCRIPTOR_METHOD,
                            _p[exports.ARGUMENT_NAMESPACES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_PROPERTIES] = Rule.ARGUMENT_DESCRIPTOR_CLASS,
                            _p[exports.ARGUMENT_TYPES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p[exports.ARGUMENT_VARIABLES] = Rule.ARGUMENT_DESCRIPTOR_BLOCK,
                            _p),
                    },
                ],
            },
        },
        optionExamples: [
            true,
            [true, exports.ARGUMENT_ENUMS, exports.ARGUMENT_FUNCTIONS, exports.ARGUMENT_METHODS],
            [
                true,
                (_q = {},
                    _q[exports.ARGUMENT_ENUMS] = true,
                    _q[exports.ARGUMENT_FUNCTIONS] = (_r = {},
                        _r[exports.DESCRIPTOR_VISIBILITIES] = [exports.VISIBILITY_EXPORTED],
                        _r),
                    _q[exports.ARGUMENT_METHODS] = (_s = {},
                        _s[exports.DESCRIPTOR_LOCATIONS] = exports.LOCATION_INSTANCE,
                        _s[exports.DESCRIPTOR_PRIVACIES] = [exports.PRIVACY_PUBLIC, exports.PRIVACY_PROTECTED],
                        _s),
                    _q[exports.ARGUMENT_PROPERTIES] = (_t = {},
                        _t[exports.DESCRIPTOR_TAGS] = (_u = {},
                            _u[exports.TAGS_FOR_CONTENT] = {
                                see: ["#.*"],
                            },
                            _u[exports.TAGS_FOR_EXISTENCE] = ["inheritdoc"],
                            _u),
                        _t),
                    _q),
            ],
        ],
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            Helps ensure important components are documented.\n\n            Note: use this rule sparingly. It's better to have self-documenting names on components with single, concise responsibilities.\n            Comments that only restate the names of variables add nothing to code, and can easily become outdated.\n        "], ["\n            Helps ensure important components are documented.\n\n            Note: use this rule sparingly. It's better to have self-documenting names on components with single, concise responsibilities.\n            Comments that only restate the names of variables add nothing to code, and can easily become outdated.\n        "]))),
        type: "style",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var modifierAliases = {
    export: "exported",
};
function walk(context) {
    return ts.forEachChild(context.sourceFile, cb);
    function cb(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                checkNode(node, exports.ARGUMENT_CLASSES);
                break;
            case ts.SyntaxKind.Constructor:
                checkNode(node, exports.ARGUMENT_CONSTRUCTORS);
                break;
            case ts.SyntaxKind.EnumDeclaration:
                checkNode(node, exports.ARGUMENT_ENUMS);
                for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
                    var member = _a[_i];
                    // Enum members don't have modifiers, so use the parent
                    // enum declaration when checking the requirements.
                    checkNode(member, exports.ARGUMENT_ENUM_MEMBERS, node);
                }
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                checkNode(node, exports.ARGUMENT_FUNCTIONS);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                checkNode(node, exports.ARGUMENT_INTERFACES);
                break;
            case ts.SyntaxKind.MethodSignature:
                checkNode(node, exports.ARGUMENT_METHODS);
                break;
            case ts.SyntaxKind.MethodDeclaration:
                if (node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                    checkNode(node, exports.ARGUMENT_METHODS);
                }
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                checkNode(node, exports.ARGUMENT_NAMESPACES);
                break;
            case ts.SyntaxKind.PropertySignature:
                checkNode(node, exports.ARGUMENT_PROPERTIES);
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                checkNode(node, exports.ARGUMENT_PROPERTIES);
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                checkNode(node, exports.ARGUMENT_TYPES);
                break;
            case ts.SyntaxKind.VariableStatement:
                // Only check variables at the namespace/module-level or file-level
                // and not variables declared inside functions and other things.
                switch (node.parent.kind) {
                    case ts.SyntaxKind.SourceFile:
                    case ts.SyntaxKind.ModuleBlock:
                        for (var _b = 0, _c = node.declarationList
                            .declarations; _b < _c.length; _b++) {
                            var declaration = _c[_b];
                            checkNode(declaration, exports.ARGUMENT_VARIABLES, node);
                        }
                }
                break;
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
                if (node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                    checkAccessorNode(node, exports.ARGUMENT_PROPERTIES);
                }
        }
        return ts.forEachChild(node, cb);
    }
    function checkNode(node, docType, requirementNode) {
        if (requirementNode === void 0) { requirementNode = node; }
        if (!nodeIsExcluded(node, docType, requirementNode) && !nodeHasDocs(node, docType)) {
            addDocumentationFailure(node, describeDocType(docType), requirementNode);
        }
    }
    function checkAccessorNode(node, docType) {
        if (nodeIsExcluded(node, exports.ARGUMENT_PROPERTIES, node) || nodeHasDocs(node, docType)) {
            return;
        }
        var correspondingAccessor = getCorrespondingAccessor(node);
        if (correspondingAccessor === undefined || !nodeHasDocs(correspondingAccessor, docType)) {
            addDocumentationFailure(node, exports.ARGUMENT_PROPERTIES, node);
        }
    }
    function nodeIsExcluded(node, docType, requirementNode) {
        if (docType !== exports.ARGUMENT_CONSTRUCTORS) {
            var name = node.name;
            if (name === undefined) {
                return true;
            }
        }
        var exclusions = context.options.get(docType);
        if (exclusions === undefined) {
            return true;
        }
        for (var _i = 0, _a = exclusions.requirements; _i < _a.length; _i++) {
            var requirement = _a[_i];
            if (requirement.excludes(requirementNode)) {
                return true;
            }
        }
        return false;
    }
    function nodeHasDocs(node, docType) {
        var docs = getApparentJsDoc(node, docType, context.sourceFile);
        if (docs === undefined) {
            return false;
        }
        var comments = docs
            .map(function (doc) { return doc.comment; })
            .filter(function (comment) { return comment !== undefined && comment.trim() !== ""; });
        return comments.length !== 0;
    }
    /**
     * @see https://github.com/ajafff/tsutils/issues/16
     */
    function getApparentJsDoc(node, docType, sourceFile) {
        if (ts.isVariableDeclaration(node)) {
            if (variableIsAfterFirstInDeclarationList(node)) {
                return undefined;
            }
            node = node.parent;
        }
        if (ts.isVariableDeclarationList(node)) {
            node = node.parent;
        }
        var equivalentNodesForDocs = getEquivalentNodesForDocs(node, docType);
        return equivalentNodesForDocs
            .map(function (docsNode) { return tsutils.getJsDoc(docsNode, sourceFile); })
            .filter(function (nodeDocs) { return nodeDocs !== undefined; })
            .reduce(function (docs, moreDocs) { return tslib_1.__spreadArrays(docs, moreDocs); }, []);
    }
    /**
     * @see https://github.com/palantir/tslint/issues/4416
     */
    function getEquivalentNodesForDocs(node, docType) {
        var exclusions = context.options.get(docType);
        if (exclusions === undefined || exclusions.overloadsSeparateDocs) {
            return [node];
        }
        if (tsutils.isFunctionDeclaration(node) && node.name !== undefined) {
            var functionName_1 = node.name.text;
            return getSiblings(node).filter(function (child) {
                return tsutils.isFunctionDeclaration(child) &&
                    child.name !== undefined &&
                    child.name.text === functionName_1;
            });
        }
        if (tsutils.isConstructorDeclaration(node)) {
            var members = node.parent.members;
            return members.filter(function (child) { return tsutils.isConstructorDeclaration(child); });
        }
        if (tsutils.isMethodDeclaration(node) &&
            tsutils.isIdentifier(node.name) &&
            tsutils.isClassDeclaration(node.parent)) {
            var methodName_1 = node.name.text;
            return node.parent.members.filter(function (member) {
                return tsutils.isMethodDeclaration(member) &&
                    tsutils.isIdentifier(member.name) &&
                    member.name.text === methodName_1;
            });
        }
        return [node];
    }
    function addDocumentationFailure(node, docType, requirementNode) {
        var start = node.getStart();
        var width = node.getText().split(/\r|\n/g)[0].length;
        var description = describeDocumentationFailure(requirementNode, docType);
        context.addFailureAt(start, width, description);
    }
}
function getCorrespondingAccessor(node) {
    var propertyName = tsutils.getPropertyName(node.name);
    if (propertyName === undefined) {
        return undefined;
    }
    var parent = node.parent;
    var correspondingKindCheck = node.kind === ts.SyntaxKind.GetAccessor ? isSetAccessor : isGetAccessor;
    for (var _i = 0, _a = parent.members; _i < _a.length; _i++) {
        var member = _a[_i];
        if (!correspondingKindCheck(member)) {
            continue;
        }
        if (tsutils.getPropertyName(member.name) === propertyName) {
            return member;
        }
    }
    return undefined;
}
function variableIsAfterFirstInDeclarationList(node) {
    var parent = node.parent;
    if (parent === undefined) {
        return false;
    }
    return ts.isVariableDeclarationList(parent) && node !== parent.declarations[0];
}
function describeDocumentationFailure(node, docType) {
    var description = Rule.FAILURE_STRING_EXIST;
    if (node.modifiers !== undefined) {
        description += node.modifiers
            .map(function (modifier) { return describeModifier(modifier.kind); })
            .join(" ") + " ";
    }
    return "" + description + docType + ".";
}
function describeModifier(kind) {
    var description = ts.SyntaxKind[kind].toLowerCase().split("keyword")[0];
    var alias = modifierAliases[description];
    return alias !== undefined ? alias : description;
}
function describeDocType(docType) {
    return docType.replace("-", " ");
}
function getSiblings(node) {
    var parent = node.parent;
    // Source files nest their statements within a node for getChildren()
    if (ts.isSourceFile(parent)) {
        return tslib_1.__spreadArrays(parent.statements);
    }
    return parent.getChildren();
}
function isGetAccessor(node) {
    return node.kind === ts.SyntaxKind.GetAccessor;
}
function isSetAccessor(node) {
    return node.kind === ts.SyntaxKind.SetAccessor;
}
var templateObject_1, templateObject_2;
