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
var completedDocsRule_1 = require("../completedDocsRule");
var blockExclusion_1 = require("./blockExclusion");
var classExclusion_1 = require("./classExclusion");
var constructorExclusion_1 = require("./constructorExclusion");
var tagExclusion_1 = require("./tagExclusion");
exports.constructExclusionsMap = function (ruleArguments) {
    var exclusions = new Map();
    for (var _i = 0, ruleArguments_1 = ruleArguments; _i < ruleArguments_1.length; _i++) {
        var ruleArgument = ruleArguments_1[_i];
        addRequirements(exclusions, ruleArgument);
    }
    return exclusions;
};
var addRequirements = function (exclusionsMap, descriptors) {
    if (typeof descriptors === "string") {
        exclusionsMap.set(descriptors, createRequirementsForDocType(descriptors, {}));
        return;
    }
    for (var _i = 0, _a = Object.keys(descriptors); _i < _a.length; _i++) {
        var docType = _a[_i];
        exclusionsMap.set(docType, createRequirementsForDocType(docType, descriptors[docType]));
    }
};
var createRequirementsForDocType = function (docType, descriptor) {
    var requirements = [];
    var overloadsSeparateDocs = false;
    if (typeof descriptor === "object" && completedDocsRule_1.DESCRIPTOR_OVERLOADS in descriptor) {
        overloadsSeparateDocs = !!descriptor[completedDocsRule_1.DESCRIPTOR_OVERLOADS];
    }
    switch (docType) {
        case "constructors":
            requirements.push(new constructorExclusion_1.ConstructorExclusion(descriptor));
            break;
        case "methods":
        case "properties":
            requirements.push(new classExclusion_1.ClassExclusion(descriptor));
            break;
        default:
            requirements.push(new blockExclusion_1.BlockExclusion(descriptor));
    }
    if (descriptor.tags !== undefined) {
        requirements.push(new tagExclusion_1.TagExclusion(descriptor));
    }
    return {
        overloadsSeparateDocs: overloadsSeparateDocs,
        requirements: requirements,
    };
};
