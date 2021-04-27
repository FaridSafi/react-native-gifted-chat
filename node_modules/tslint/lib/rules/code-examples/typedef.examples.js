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
var Lint = require("../../index");
// tslint:disable: object-literal-sort-keys
exports.codeExamples = [
    {
        description: "Requires type definitions for call signatures",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"call-signature\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"call-signature\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            function add(x, y): number {\n                return x + y;\n            }\n        "], ["\n            function add(x, y): number {\n                return x + y;\n            }\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            function add(x, y) {\n                return x + y;\n            }\n        "], ["\n            function add(x, y) {\n                return x + y;\n            }\n        "]))),
    },
    {
        description: "Requires type definitions for arrow call signatures",
        config: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"arrow-call-signature\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"arrow-call-signature\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n            const add = (x, y): number => x + y;\n        "], ["\n            const add = (x, y): number => x + y;\n        "]))),
        fail: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n            const add = (x, y) => x + y;\n        "], ["\n            const add = (x, y) => x + y;\n        "]))),
    },
    {
        description: "Requires type definitions for parameters",
        config: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"parameter\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"parameter\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_8 || (templateObject_8 = tslib_1.__makeTemplateObject(["\n            function add(x: number, y: number) {\n                return x + y;\n            }\n        "], ["\n            function add(x: number, y: number) {\n                return x + y;\n            }\n        "]))),
        fail: Lint.Utils.dedent(templateObject_9 || (templateObject_9 = tslib_1.__makeTemplateObject(["\n            function add(x, y) {\n                return x + y;\n            }\n        "], ["\n            function add(x, y) {\n                return x + y;\n            }\n        "]))),
    },
    {
        description: "Requires type definitions for arrow function parameters",
        config: Lint.Utils.dedent(templateObject_10 || (templateObject_10 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"arrow-parameter\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"arrow-parameter\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_11 || (templateObject_11 = tslib_1.__makeTemplateObject(["\n            const add = (x: number, y: number) => x + y;\n        "], ["\n            const add = (x: number, y: number) => x + y;\n        "]))),
        fail: Lint.Utils.dedent(templateObject_12 || (templateObject_12 = tslib_1.__makeTemplateObject(["\n            const add = (x, y) => x + y;\n        "], ["\n            const add = (x, y) => x + y;\n        "]))),
    },
    {
        description: "Requires type definitions for property declarations",
        config: Lint.Utils.dedent(templateObject_13 || (templateObject_13 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"property-declaration\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"property-declaration\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_14 || (templateObject_14 = tslib_1.__makeTemplateObject(["\n            interface I {\n                foo: number;\n                bar: string;\n            }\n    "], ["\n            interface I {\n                foo: number;\n                bar: string;\n            }\n    "]))),
        fail: Lint.Utils.dedent(templateObject_15 || (templateObject_15 = tslib_1.__makeTemplateObject(["\n            interface I {\n                foo;\n                bar;\n            }\n        "], ["\n            interface I {\n                foo;\n                bar;\n            }\n        "]))),
    },
    {
        description: "Requires type definitions for variable declarations",
        config: Lint.Utils.dedent(templateObject_16 || (templateObject_16 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"variable-declaration\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"variable-declaration\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_17 || (templateObject_17 = tslib_1.__makeTemplateObject(["\n            let x: number;\n        "], ["\n            let x: number;\n        "]))),
        fail: Lint.Utils.dedent(templateObject_18 || (templateObject_18 = tslib_1.__makeTemplateObject(["\n            let x;\n        "], ["\n            let x;\n        "]))),
    },
    {
        description: "Requires type definitions for member variable declarations",
        config: Lint.Utils.dedent(templateObject_19 || (templateObject_19 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"member-variable-declaration\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"member-variable-declaration\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_20 || (templateObject_20 = tslib_1.__makeTemplateObject(["\n            class MyClass {\n                x: number;\n            }\n        "], ["\n            class MyClass {\n                x: number;\n            }\n        "]))),
        fail: Lint.Utils.dedent(templateObject_21 || (templateObject_21 = tslib_1.__makeTemplateObject(["\n            class MyClass {\n                x;\n            }\n        "], ["\n            class MyClass {\n                x;\n            }\n        "]))),
    },
    {
        description: "Requires type definitions when destructuring objects.",
        config: Lint.Utils.dedent(templateObject_22 || (templateObject_22 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"object-destructuring\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"object-destructuring\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_23 || (templateObject_23 = tslib_1.__makeTemplateObject(["\n            interface FooBar {\n                foo: number;\n                bar: string;\n            }\n            const foobar = { foo: 1, bar: '2' };\n            const { foo, bar }: FooBar = foobar;\n        "], ["\n            interface FooBar {\n                foo: number;\n                bar: string;\n            }\n            const foobar = { foo: 1, bar: '2' };\n            const { foo, bar }: FooBar = foobar;\n        "]))),
        fail: Lint.Utils.dedent(templateObject_24 || (templateObject_24 = tslib_1.__makeTemplateObject(["\n            interface FooBar {\n                foo: number;\n                bar: string;\n            }\n            const foobar = { foo: 1, bar: '2' };\n            const { foo, bar } = foobar;\n        "], ["\n            interface FooBar {\n                foo: number;\n                bar: string;\n            }\n            const foobar = { foo: 1, bar: '2' };\n            const { foo, bar } = foobar;\n        "]))),
    },
    {
        description: "Requires type definitions when destructuring arrays.",
        config: Lint.Utils.dedent(templateObject_25 || (templateObject_25 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"typedef\": [true, \"array-destructuring\"] }\n        "], ["\n            \"rules\": { \"typedef\": [true, \"array-destructuring\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_26 || (templateObject_26 = tslib_1.__makeTemplateObject(["\n            const foobar = [1, '2'];\n            const [foo, bar]: Array<number | string> = foobar;\n        "], ["\n            const foobar = [1, '2'];\n            const [foo, bar]: Array<number | string> = foobar;\n        "]))),
        fail: Lint.Utils.dedent(templateObject_27 || (templateObject_27 = tslib_1.__makeTemplateObject(["\n            const foobar = [1, '2'];\n            const [foo, bar] = foobar;\n        "], ["\n            const foobar = [1, '2'];\n            const [foo, bar] = foobar;\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27;
