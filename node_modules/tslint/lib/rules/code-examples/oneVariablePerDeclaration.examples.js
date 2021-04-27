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
        description: "Disallows multiple variable definitions in the same declaration statement.",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"one-variable-per-declaration\": true }\n        "], ["\n            \"rules\": { \"one-variable-per-declaration\": true }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            const foo = 1;\n            const bar = '2';\n        "], ["\n            const foo = 1;\n            const bar = '2';\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            const foo = 1, bar = '2';\n       "], ["\n            const foo = 1, bar = '2';\n       "]))),
    },
    {
        description: "Disallows multiple variable definitions in the same declaration statement but allows them in for-loops.",
        config: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"one-variable-per-declaration\": [true, \"ignore-for-loop\"] }\n        "], ["\n            \"rules\": { \"one-variable-per-declaration\": [true, \"ignore-for-loop\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n            for (let i = 0, j = 10; i < 10; i++) {\n                doSomething(j, i);\n            }\n        "], ["\n            for (let i = 0, j = 10; i < 10; i++) {\n                doSomething(j, i);\n            }\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
