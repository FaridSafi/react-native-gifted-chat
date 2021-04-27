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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var error_1 = require("../error");
var Lint = require("../index");
var utils_1 = require("../utils");
var OPTION_ORDER = "order";
var OPTION_ALPHABETIZE = "alphabetize";
var MemberKind;
(function (MemberKind) {
    MemberKind[MemberKind["publicStaticField"] = 0] = "publicStaticField";
    MemberKind[MemberKind["protectedStaticField"] = 1] = "protectedStaticField";
    MemberKind[MemberKind["privateStaticField"] = 2] = "privateStaticField";
    MemberKind[MemberKind["publicStaticMethod"] = 3] = "publicStaticMethod";
    MemberKind[MemberKind["privateStaticMethod"] = 4] = "privateStaticMethod";
    MemberKind[MemberKind["protectedStaticMethod"] = 5] = "protectedStaticMethod";
    MemberKind[MemberKind["publicInstanceField"] = 6] = "publicInstanceField";
    MemberKind[MemberKind["protectedInstanceField"] = 7] = "protectedInstanceField";
    MemberKind[MemberKind["privateInstanceField"] = 8] = "privateInstanceField";
    MemberKind[MemberKind["publicConstructor"] = 9] = "publicConstructor";
    MemberKind[MemberKind["protectedConstructor"] = 10] = "protectedConstructor";
    MemberKind[MemberKind["privateConstructor"] = 11] = "privateConstructor";
    MemberKind[MemberKind["publicInstanceMethod"] = 12] = "publicInstanceMethod";
    MemberKind[MemberKind["protectedInstanceMethod"] = 13] = "protectedInstanceMethod";
    MemberKind[MemberKind["privateInstanceMethod"] = 14] = "privateInstanceMethod";
    MemberKind[MemberKind["publicStaticAccessor"] = 15] = "publicStaticAccessor";
    MemberKind[MemberKind["protectedStaticAccessor"] = 16] = "protectedStaticAccessor";
    MemberKind[MemberKind["privateStaticAccessor"] = 17] = "privateStaticAccessor";
    MemberKind[MemberKind["publicInstanceAccessor"] = 18] = "publicInstanceAccessor";
    MemberKind[MemberKind["protectedInstanceAccessor"] = 19] = "protectedInstanceAccessor";
    MemberKind[MemberKind["privateInstanceAccessor"] = 20] = "privateInstanceAccessor";
})(MemberKind || (MemberKind = {}));
var PRESETS = new Map([
    [
        "fields-first",
        [
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-static-accessor",
            "protected-static-accessor",
            "private-static-accessor",
            "public-static-method",
            "protected-static-method",
            "private-static-method",
            "public-instance-accessor",
            "protected-instance-accessor",
            "private-instance-accessor",
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method",
        ],
    ],
    [
        "instance-sandwich",
        [
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-instance-accessor",
            "protected-instance-accessor",
            "private-instance-accessor",
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method",
            "public-static-accessor",
            "protected-static-accessor",
            "private-static-accessor",
            "public-static-method",
            "protected-static-method",
            "private-static-method",
        ],
    ],
    [
        "statics-first",
        [
            "public-static-field",
            "public-static-accessor",
            "public-static-method",
            "protected-static-field",
            "protected-static-accessor",
            "protected-static-method",
            "private-static-field",
            "private-static-accessor",
            "private-static-method",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-instance-accessor",
            "protected-instance-accessor",
            "private-instance-accessor",
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method",
        ],
    ],
]);
var PRESET_NAMES = Array.from(PRESETS.keys());
var allMemberKindNames = utils_1.mapDefined(Object.keys(MemberKind), function (key) {
    var mk = MemberKind[key];
    return typeof mk === "number"
        ? MemberKind[mk].replace(/[A-Z]/g, function (cap) { return "-" + cap.toLowerCase(); })
        : undefined;
});
function namesMarkdown(names) {
    return names.map(function (name) { return "* `" + name + "`"; }).join("\n    ");
}
var optionsDescription = Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    One argument, which is an object, must be provided. It should contain an `order` property.\n    The `order` property should have a value of one of the following strings:\n\n    ", "\n\n    `fields-first` puts, in order of precedence:\n        * fields before constructors before methods\n        * static members before instance members\n        * public members before protected members before private members\n    `instance-sandwich` puts, in order of precedence:\n        * fields before constructors before methods\n        * static fields before instance fields, but static methods *after* instance methods\n        * public members before protected members before private members\n    `statics-first` puts, in order of precedence:\n        * static members before instance members\n            * public members before protected members before private members\n            * fields before methods\n        * instance fields before constructors before instance methods\n            * fields before constructors before methods\n            * public members before protected members before private members\n    Note that these presets, despite looking similar, can have subtly different behavior due to the order in which these\n    rules are specified. A fully expanded ordering can be found in the PRESETS constant in\n    https://github.com/palantir/tslint/blob/master/src/rules/memberOrderingRule.ts.\n    (You may need to check the version of the file corresponding to your version of tslint.)\n\n    Alternatively, the value for `order` may be an array consisting of the following strings:\n\n    ", "\n\n    You can also omit the access modifier to refer to \"public-\", \"protected-\", and \"private-\" all at once; for example, \"static-field\".\n\n    You can also make your own categories by using an object instead of a string:\n\n        {\n            \"name\": \"static non-private\",\n            \"kinds\": [\n                \"public-static-field\",\n                \"protected-static-field\",\n                \"public-static-method\",\n                \"protected-static-method\"\n            ]\n        }\n\n    The '", "' option will enforce that members within the same category should be alphabetically sorted by name.\n    Computed property names are sorted before others but not sorted amongst each other.\n    Additionally getters will be sorted before setters (after alphabetization)."], ["\n    One argument, which is an object, must be provided. It should contain an \\`order\\` property.\n    The \\`order\\` property should have a value of one of the following strings:\n\n    ", "\n\n    \\`fields-first\\` puts, in order of precedence:\n        * fields before constructors before methods\n        * static members before instance members\n        * public members before protected members before private members\n    \\`instance-sandwich\\` puts, in order of precedence:\n        * fields before constructors before methods\n        * static fields before instance fields, but static methods *after* instance methods\n        * public members before protected members before private members\n    \\`statics-first\\` puts, in order of precedence:\n        * static members before instance members\n            * public members before protected members before private members\n            * fields before methods\n        * instance fields before constructors before instance methods\n            * fields before constructors before methods\n            * public members before protected members before private members\n    Note that these presets, despite looking similar, can have subtly different behavior due to the order in which these\n    rules are specified. A fully expanded ordering can be found in the PRESETS constant in\n    https://github.com/palantir/tslint/blob/master/src/rules/memberOrderingRule.ts.\n    (You may need to check the version of the file corresponding to your version of tslint.)\n\n    Alternatively, the value for \\`order\\` may be an array consisting of the following strings:\n\n    ", "\n\n    You can also omit the access modifier to refer to \"public-\", \"protected-\", and \"private-\" all at once; for example, \"static-field\".\n\n    You can also make your own categories by using an object instead of a string:\n\n        {\n            \"name\": \"static non-private\",\n            \"kinds\": [\n                \"public-static-field\",\n                \"protected-static-field\",\n                \"public-static-method\",\n                \"protected-static-method\"\n            ]\n        }\n\n    The '", "' option will enforce that members within the same category should be alphabetically sorted by name.\n    Computed property names are sorted before others but not sorted amongst each other.\n    Additionally getters will be sorted before setters (after alphabetization)."])), namesMarkdown(PRESET_NAMES), namesMarkdown(allMemberKindNames), OPTION_ALPHABETIZE);
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING_ALPHABETIZE = function (prevName, curName) {
        return show(curName) + " should come alphabetically before " + show(prevName);
        function show(s) {
            return s === "" ? "Computed property" : "'" + s + "'";
        }
    };
    Rule.stringCompare = function (a, b) {
        var aLower = a.toLowerCase();
        var bLower = b.toLowerCase();
        return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
    };
    Rule.prototype.apply = function (sourceFile) {
        var options;
        try {
            options = parseOptions(this.ruleArguments);
        }
        catch (e) {
            error_1.showWarningOnce("Warning: " + this.ruleName + " - " + e.message);
            return [];
        }
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.ruleName, options));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "member-ordering",
        description: "Enforces member ordering.",
        hasFix: true,
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            A consistent ordering for class members can make classes easier to read, navigate, and edit.\n\n            A common opposite practice to `member-ordering` is to keep related groups of classes together.\n            Instead of creating classes with multiple separate groups, consider splitting class responsibilities\n            apart across multiple single-responsibility classes.\n        "], ["\n            A consistent ordering for class members can make classes easier to read, navigate, and edit.\n\n            A common opposite practice to \\`member-ordering\\` is to keep related groups of classes together.\n            Instead of creating classes with multiple separate groups, consider splitting class responsibilities\n            apart across multiple single-responsibility classes.\n        "]))),
        optionsDescription: optionsDescription,
        options: {
            type: "object",
            properties: {
                alphabetize: {
                    type: "boolean",
                },
                order: {
                    oneOf: [
                        {
                            type: "string",
                            enum: PRESET_NAMES,
                        },
                        {
                            type: "array",
                            items: {
                                type: "string",
                                enum: allMemberKindNames,
                            },
                            maxLength: 13,
                        },
                    ],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            [true, { order: "fields-first" }],
            [
                true,
                {
                    alphabetize: true,
                    order: [
                        "public-static-field",
                        "public-instance-field",
                        "public-constructor",
                        "private-static-field",
                        "private-instance-field",
                        "private-constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                    ],
                },
            ],
            [
                true,
                {
                    order: [
                        {
                            name: "static non-private",
                            kinds: [
                                "public-static-field",
                                "protected-static-field",
                                "public-static-method",
                                "protected-static-method",
                            ],
                        },
                        "constructor",
                    ],
                },
            ],
        ],
        type: "typescript",
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MemberOrderingWalker = /** @class */ (function (_super) {
    tslib_1.__extends(MemberOrderingWalker, _super);
    function MemberOrderingWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fixes = [];
        return _this;
    }
    MemberOrderingWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            // NB: iterate through children first!
            ts.forEachChild(node, cb);
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.ClassExpression:
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.TypeLiteral:
                    _this.checkMembers(node.members);
            }
        };
        ts.forEachChild(sourceFile, cb);
        // assign Replacements which have not been merged into surrounding ones to their RuleFailures.
        this.fixes.forEach(function (_a) {
            var failure = _a[0], replacement = _a[1];
            failure.getFix().push(replacement);
        });
    };
    /**
     * Check whether the passed members adhere to the configured order. If not, RuleFailures are generated and a single
     * Lint.Replacement is generated, which replaces the entire NodeArray with a correctly sorted one. The Replacement
     * is not immediately added to a RuleFailure, as incorrectly sorted nodes can be nested (e.g. a class declaration
     * in a method implementation), but instead temporarily stored in `this.fixes`. Nested Replacements are manually
     * merged, as TSLint doesn't handle overlapping ones. For this reason it is important that the recursion happens
     * before the checkMembers call in this.walk().
     */
    MemberOrderingWalker.prototype.checkMembers = function (members) {
        var _this = this;
        var prevMember = members[0];
        var failureExists = false;
        for (var i = 1; i < members.length; i++) {
            var member = members[i];
            var rank = this.memberRank(member);
            if (rank === -1) {
                // no explicit ordering for this kind of node specified, so continue
                continue;
            }
            var prevRank = this.memberRank(prevMember);
            if (rank < prevRank) {
                var nodeType = this.rankName(rank);
                var prevNodeType = this.rankName(prevRank);
                var lowerRank = this.findLowerRank(members, rank);
                var locationHint = lowerRank !== -1
                    ? "after " + this.rankName(lowerRank) + "s"
                    : "at the beginning of the class/interface";
                var errorLine1 = "Declaration of " + nodeType + " not allowed after declaration of " + prevNodeType + ". " +
                    ("Instead, this should come " + locationHint + ".");
                // add empty array as fix so we can add a replacement later. (fix itself is readonly)
                this.addFailureAtNode(member, errorLine1, []);
                failureExists = true;
                continue; // avoid updating prevMember at end of loop
            }
            else if (prevRank === rank &&
                this.options.alphabetize &&
                member.name !== undefined &&
                prevMember.name !== undefined) {
                var curName = nameString(member.name);
                var prevName = nameString(prevMember.name);
                var alphaDiff = Rule.stringCompare(prevName, curName);
                if (alphaDiff > 0) {
                    this.addFailureAtNode(member.name, Rule.FAILURE_STRING_ALPHABETIZE(this.findLowerName(members, rank, curName), curName), []);
                    failureExists = true;
                    continue;
                }
                else if (alphaDiff === 0 &&
                    curName !== "" && // do not enforce get < set for computed properties
                    member.kind === ts.SyntaxKind.GetAccessor &&
                    prevMember.kind === ts.SyntaxKind.SetAccessor) {
                    this.addFailureAtNode(member.name, "Getter for '" + curName + "' should appear before setter.", []);
                    failureExists = true;
                    continue;
                }
            }
            prevMember = member;
        }
        if (failureExists) {
            var sortedMemberIndexes = members
                .map(function (_, i) { return i; })
                .sort(function (ai, bi) {
                var a = members[ai];
                var b = members[bi];
                // first, sort by member rank
                var rankDiff = _this.memberRank(a) - _this.memberRank(b);
                if (rankDiff !== 0) {
                    return rankDiff;
                }
                // then lexicographically if alphabetize == true
                if (_this.options.alphabetize && a.name !== undefined && b.name !== undefined) {
                    var aName = nameString(a.name);
                    var bName = nameString(b.name);
                    var nameDiff = Rule.stringCompare(aName, bName);
                    if (nameDiff !== 0) {
                        return nameDiff;
                    }
                    var getSetDiff = a.kind === ts.SyntaxKind.GetAccessor &&
                        b.kind === ts.SyntaxKind.SetAccessor
                        ? -1
                        : a.kind === ts.SyntaxKind.SetAccessor &&
                            b.kind === ts.SyntaxKind.GetAccessor
                            ? 1
                            : 0;
                    if (aName !== "" && getSetDiff !== 0) {
                        return getSetDiff;
                    }
                }
                // finally, sort by position in original NodeArray so the sort remains stable.
                return ai - bi;
            });
            var splits_1 = getSplitIndexes(members, this.sourceFile.text);
            var sortedMembersText = sortedMemberIndexes.map(function (i) {
                var start = splits_1[i];
                var end = splits_1[i + 1];
                var nodeText = _this.sourceFile.text.substring(start, end);
                while (true) {
                    // check if there are previous fixes which we need to merge into this one
                    // if yes, remove it from the list so that we do not return overlapping Replacements
                    var fixIndex = arrayFindLastIndex(_this.fixes, function (_a) {
                        var r = _a[1];
                        return r.start >= start && r.start + r.length <= end;
                    });
                    if (fixIndex === -1) {
                        break;
                    }
                    var fix = _this.fixes.splice(fixIndex, 1)[0];
                    var replacement = fix[1];
                    nodeText = applyReplacementOffset(nodeText, replacement, start);
                }
                return nodeText;
            });
            // instead of assigning the fix immediately to the last failure, we temporarily store it in `this.fixes`,
            // in case a containing node needs to be fixed too. We only "add" the fix to the last failure, although
            // it fixes all failures in this NodeArray, as TSLint doesn't handle duplicate Replacements.
            this.fixes.push([
                arrayLast(this.failures),
                Lint.Replacement.replaceFromTo(splits_1[0], arrayLast(splits_1), sortedMembersText.join("")),
            ]);
        }
    };
    /** Finds the lowest name higher than 'targetName'. */
    MemberOrderingWalker.prototype.findLowerName = function (members, targetRank, targetName) {
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (member.name === undefined || this.memberRank(member) !== targetRank) {
                continue;
            }
            var name = nameString(member.name);
            if (caseInsensitiveLess(targetName, name)) {
                return name;
            }
        }
        throw new Error("Expected to find a name");
    };
    /** Finds the highest existing rank lower than `targetRank`. */
    MemberOrderingWalker.prototype.findLowerRank = function (members, targetRank) {
        var max = -1;
        for (var _i = 0, members_2 = members; _i < members_2.length; _i++) {
            var member = members_2[_i];
            var rank = this.memberRank(member);
            if (rank !== -1 && rank < targetRank) {
                max = Math.max(max, rank);
            }
        }
        return max;
    };
    MemberOrderingWalker.prototype.memberRank = function (member) {
        var optionName = getMemberKind(member);
        if (optionName === undefined) {
            return -1;
        }
        return this.options.order.findIndex(function (category) { return category.has(optionName); });
    };
    MemberOrderingWalker.prototype.rankName = function (rank) {
        return this.options.order[rank].name;
    };
    return MemberOrderingWalker;
}(Lint.AbstractWalker));
function caseInsensitiveLess(a, b) {
    return a.toLowerCase() < b.toLowerCase();
}
var allAccess = ["public", "protected", "private"];
function memberKindFromName(name) {
    var kind = MemberKind[Lint.Utils.camelize(name)];
    return typeof kind === "number" ? [kind] : allAccess.map(addModifier);
    function addModifier(modifier) {
        var modifiedKind = MemberKind[Lint.Utils.camelize(modifier + "-" + name)];
        if (typeof modifiedKind !== "number") {
            throw new Error("Bad member kind: " + name);
        }
        return modifiedKind;
    }
}
function getMemberKind(member) {
    var accessLevel = tsutils_1.hasModifier(member.modifiers, ts.SyntaxKind.PrivateKeyword)
        ? "private"
        : tsutils_1.hasModifier(member.modifiers, ts.SyntaxKind.ProtectedKeyword)
            ? "protected"
            : "public";
    var membership = tsutils_1.hasModifier(member.modifiers, ts.SyntaxKind.StaticKeyword)
        ? "Static"
        : "Instance";
    switch (member.kind) {
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.ConstructSignature:
            // tslint:disable-next-line:prefer-template
            return MemberKind[accessLevel + "Constructor"];
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            // tslint:disable-next-line:prefer-template
            return MemberKind[accessLevel + membership + "Accessor"];
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
            var type = isFunctionLiteral(member.initializer)
                ? "Method"
                : "Field";
            // tslint:disable-next-line:prefer-template
            return MemberKind[accessLevel + membership + type];
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
            // tslint:disable-next-line:prefer-template
            return MemberKind[accessLevel + membership + "Method"];
        default:
            return undefined;
    }
}
var MemberCategory = /** @class */ (function () {
    function MemberCategory(name, kinds) {
        this.name = name;
        this.kinds = kinds;
    }
    MemberCategory.prototype.has = function (kind) {
        return this.kinds.has(kind);
    };
    return MemberCategory;
}());
function parseOptions(options) {
    var _a = getOptionsJson(options), orderJson = _a.order, alphabetize = _a.alphabetize;
    var order = orderJson.map(function (cat) {
        return typeof cat === "string"
            ? new MemberCategory(cat.replace(/-/g, " "), new Set(memberKindFromName(cat)))
            : new MemberCategory(cat.name, new Set(utils_1.flatMap(cat.kinds, memberKindFromName)));
    });
    return { order: order, alphabetize: alphabetize };
}
function getOptionsJson(allOptions) {
    if (allOptions == undefined || allOptions.length === 0 || allOptions[0] == undefined) {
        throw new Error("Got empty options");
    }
    var firstOption = allOptions[0];
    if (typeof firstOption !== "object") {
        // Undocumented direct string option. Deprecate eventually.
        var order = convertFromOldStyleOptions(allOptions);
        error_1.showWarningOnce(utils_1.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            Warning: member-ordering - Direct string option is deprecated and does not support accessors.\n            See also https://palantir.github.io/tslint/rules/member-ordering/\n            You should replace ", "\n            with the following equivalent options and add -accessor categories as appropriate:\n"], ["\n            Warning: member-ordering - Direct string option is deprecated and does not support accessors.\n            See also https://palantir.github.io/tslint/rules/member-ordering/\n            You should replace ", "\n            with the following equivalent options and add -accessor categories as appropriate:\\n"])), allOptions.map(function (o) { return JSON.stringify(o); }).join()) +
            JSON.stringify(order, undefined, "  "));
        return { order: order, alphabetize: false }; // presume allOptions to be string[]
    }
    return {
        order: categoryFromOption(firstOption[OPTION_ORDER]),
        alphabetize: firstOption[OPTION_ALPHABETIZE] === true,
    };
}
function categoryFromOption(orderOption) {
    if (Array.isArray(orderOption)) {
        return orderOption;
    }
    var preset = PRESETS.get(orderOption);
    if (preset === undefined) {
        throw new Error("Bad order: " + JSON.stringify(orderOption));
    }
    return preset;
}
/**
 * Convert from undocumented old-style options.
 * This is designed to mimic the old behavior and should be removed eventually.
 */
function convertFromOldStyleOptions(options) {
    var categories = [{ name: "member", kinds: allMemberKindNames }];
    if (hasOption("variables-before-functions")) {
        categories = splitOldStyleOptions(categories, function (kind) { return kind.includes("field"); }, "field", "method");
    }
    if (hasOption("static-before-instance")) {
        categories = splitOldStyleOptions(categories, function (kind) { return kind.includes("static"); }, "static", "instance");
    }
    if (hasOption("public-before-private")) {
        // 'protected' is considered public
        categories = splitOldStyleOptions(categories, function (kind) { return !kind.includes("private"); }, "public", "private");
    }
    return categories;
    function hasOption(x) {
        return options.indexOf(x) !== -1;
    }
}
function splitOldStyleOptions(categories, filter, a, b) {
    var newCategories = [];
    var _loop_1 = function (cat) {
        var yes = [];
        var no = [];
        for (var _i = 0, _a = cat.kinds; _i < _a.length; _i++) {
            var kind = _a[_i];
            if (filter(kind)) {
                yes.push(kind);
            }
            else {
                no.push(kind);
            }
        }
        var augmentName = function (s) {
            if (a === "field") {
                // Replace "member" with "field"/"method" instead of augmenting.
                return s;
            }
            return s + " " + cat.name;
        };
        newCategories.push({ name: augmentName(a), kinds: yes });
        newCategories.push({ name: augmentName(b), kinds: no });
    };
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var cat = categories_1[_i];
        _loop_1(cat);
    }
    return newCategories;
}
function isFunctionLiteral(node) {
    if (node === undefined) {
        return false;
    }
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
            return true;
        default:
            return false;
    }
}
function nameString(name) {
    switch (name.kind) {
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return name.text;
        default:
            return "";
    }
}
/**
 * Returns the last element of an array. (Or undefined).
 */
function arrayLast(array) {
    return array[array.length - 1];
}
/**
 * Array.prototype.findIndex, but the last index.
 */
function arrayFindLastIndex(array, predicate) {
    for (var i = array.length; i-- > 0;) {
        if (predicate(array[i], i, array)) {
            return i;
        }
    }
    return -1;
}
/**
 * Applies a Replacement to a part of the text which starts at offset.
 * See also Replacement.apply
 */
function applyReplacementOffset(content, replacement, offset) {
    return (content.substring(0, replacement.start - offset) +
        replacement.text +
        content.substring(replacement.start - offset + replacement.length));
}
/**
 * Get the indexes of the boundaries between nodes in the node array. The following points must be taken into account:
 * - Trivia should stay with its corresponding node (comments on the same line following the token belong to the
 *   previous token, the rest to the next).
 * - Reordering the subtexts should not result in code being commented out due to being moved between a "//" and
 *   the following newline.
 * - The end of one node must be the start of the next, otherwise the intravening whitespace will be lost when
 *   reordering.
 *
 * Hence, the boundaries are chosen to be _after_ the newline following the node, or the beginning of the next token,
 * if that comes first.
 */
function getSplitIndexes(members, text) {
    var result = members.map(function (member) { return getNextSplitIndex(text, member.getFullStart()); });
    result.push(getNextSplitIndex(text, arrayLast(members).getEnd()));
    return result;
}
/**
 * Calculates the index after the newline following pos, or the beginning of the next token, whichever comes first.
 * See also getSplitIndexes.
 * This method is a modified version of TypeScript's internal iterateCommentRanges function.
 */
function getNextSplitIndex(text, pos) {
    scan: while (pos >= 0 && pos < text.length) {
        var ch = text.charCodeAt(pos);
        switch (ch) {
            case 13 /* carriageReturn */:
                if (text.charCodeAt(pos + 1) === 10 /* lineFeed */) {
                    pos++;
                }
            // falls through
            case 10 /* lineFeed */:
                pos++;
                // split is after new line
                return pos;
            case 9 /* tab */:
            case 11 /* verticalTab */:
            case 12 /* formFeed */:
            case 32 /* space */:
                // skip whitespace
                pos++;
                continue;
            case 47 /* slash */:
                var nextChar = text.charCodeAt(pos + 1);
                if (nextChar === 47 /* slash */ || nextChar === 42 /* asterisk */) {
                    var isSingleLineComment = nextChar === 47 /* slash */;
                    pos += 2;
                    if (isSingleLineComment) {
                        while (pos < text.length) {
                            if (ts.isLineBreak(text.charCodeAt(pos))) {
                                // the comment ends here, go back to default logic to handle parsing new line and result
                                continue scan;
                            }
                            pos++;
                        }
                    }
                    else {
                        while (pos < text.length) {
                            if (text.charCodeAt(pos) === 42 /* asterisk */ &&
                                text.charCodeAt(pos + 1) === 47 /* slash */) {
                                pos += 2;
                                continue scan;
                            }
                            pos++;
                        }
                    }
                    // if we arrive here, it's because pos == text.length
                    return pos;
                }
                break scan;
            default:
                // skip whitespace:
                if (ch > 127 /* maxAsciiCharacter */ && ts.isWhiteSpaceLike(ch)) {
                    pos++;
                    continue;
                }
                break scan;
        }
    }
    return pos;
}
var templateObject_1, templateObject_2, templateObject_3;
