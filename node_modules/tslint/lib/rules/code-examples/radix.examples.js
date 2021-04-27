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
        description: "Requires the inclusion of the radix parameter when calling `parseInt`.",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"radix\": true }\n        "], ["\n            \"rules\": { \"radix\": true }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            const x: string = '11';\n            const dec: number = parseInt(x, 10);\n            const bin: number = parseInt(x, 2);\n            const hex: number = parseInt(x, 16);\n        "], ["\n            const x: string = '11';\n            const dec: number = parseInt(x, 10);\n            const bin: number = parseInt(x, 2);\n            const hex: number = parseInt(x, 16);\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            const x: string = '11';\n            const dec: number = parseInt(x);\n        "], ["\n            const x: string = '11';\n            const dec: number = parseInt(x);\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3;
