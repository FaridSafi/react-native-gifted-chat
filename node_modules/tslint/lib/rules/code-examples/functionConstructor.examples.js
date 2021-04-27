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
var Lint = require("../../index");
exports.codeExamples = [
    {
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"function-constructor\": true }\n        "], ["\n            \"rules\": { \"function-constructor\": true }\n        "]))),
        description: "Use inline lambdas instead of calling Function",
        fail: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            let doesNothing = new Function();\n        "], ["\n            let doesNothing = new Function();\n        "]))),
        pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            let doesNothing = () => {};\n        "], ["\n            let doesNothing = () => {};\n        "]))),
    },
    {
        config: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"function-constructor\": true }\n        "], ["\n            \"rules\": { \"function-constructor\": true }\n        "]))),
        description: "Use parameters instead of constructor strings",
        fail: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n            let addNumbers = new Function(\"a\", \"b\", \"return a + b\");\n        "], ["\n            let addNumbers = new Function(\"a\", \"b\", \"return a + b\");\n        "]))),
        pass: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n            let addNumbers = (a, b) => a + b;\n        "], ["\n            let addNumbers = (a, b) => a + b;\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
