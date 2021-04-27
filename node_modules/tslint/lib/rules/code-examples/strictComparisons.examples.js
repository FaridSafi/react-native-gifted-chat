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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Lint = require("../../index");
// tslint:disable: object-literal-sort-keys
exports.codeExamples = [
    {
        description: "Disallows usage of comparison operators with non-primitive types.",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"strict-comparisons\": true }\n        "], ["\n            \"rules\": { \"strict-comparisons\": true }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            const object1 = {};\n            const object2 = {};\n            if (isEqual(object1, object2)) {}\n        "], ["\n            const object1 = {};\n            const object2 = {};\n            if (isEqual(object1, object2)) {}\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            const object1 = {};\n            const object2 = {};\n            if (object1 === object2) {}\n        "], ["\n            const object1 = {};\n            const object2 = {};\n            if (object1 === object2) {}\n        "]))),
    },
    {
        description: "Allows equality operators to be used with non-primitive types, while still disallowing the use of greater than and less than.",
        config: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"strict-comparisons\": [true, {  \"allow-object-equal-comparison\": true }] }\n        "], ["\n            \"rules\": { \"strict-comparisons\": [true, {  \"allow-object-equal-comparison\": true }] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n            const object1 = {};\n            const object2 = {};\n            if (object1 === object2) {}\n        "], ["\n            const object1 = {};\n            const object2 = {};\n            if (object1 === object2) {}\n        "]))),
        fail: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n            const object1 = {};\n            const object2 = {};\n            if (object1 < object2) {}\n        "], ["\n            const object1 = {};\n            const object2 = {};\n            if (object1 < object2) {}\n        "]))),
    },
    {
        description: "Allows ordering operators to be used with string types.",
        config: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"strict-comparisons\": [true, {  \"allow-string-order-comparison\": true }] }\n        "], ["\n            \"rules\": { \"strict-comparisons\": [true, {  \"allow-string-order-comparison\": true }] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_8 || (templateObject_8 = tslib_1.__makeTemplateObject(["\n            const string1 = \"\";\n            const string2 = \"\";\n            if (string1 < string2) {}\n        "], ["\n            const string1 = \"\";\n            const string2 = \"\";\n            if (string1 < string2) {}\n        "]))),
        fail: Lint.Utils.dedent(templateObject_9 || (templateObject_9 = tslib_1.__makeTemplateObject(["\n            const object1 = {};\n            const object2 = {};\n            if (object1 < object2) {}\n        "], ["\n            const object1 = {};\n            const object2 = {};\n            if (object1 < object2) {}\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
