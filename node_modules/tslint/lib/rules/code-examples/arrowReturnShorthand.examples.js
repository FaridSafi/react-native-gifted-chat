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
        description: "Enforces usage of the shorthand return syntax when an arrow function's body does not span multiple lines.",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"arrow-return-shorthand\": true }\n        "], ["\n            \"rules\": { \"arrow-return-shorthand\": true }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n        "], ["\n            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n       "], ["\n            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n       "]))),
    },
    {
        description: "Enforces usage of the shorthand return syntax even when an arrow function's body spans multiple lines.",
        config: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n            \"rules\": { \"arrow-return-shorthand\": [true, \"multiline\"] }\n        "], ["\n            \"rules\": { \"arrow-return-shorthand\": [true, \"multiline\"] }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });\n            const calc2 = (x: number, y: number) =>\n                ({ add: x + y, sub: x - y, mul: x * y });\n        "], ["\n            const calc = (x: number, y: number) => ({ add: x + y, sub: x - y, mul: x * y });\n            const calc2 = (x: number, y: number) =>\n                ({ add: x + y, sub: x - y, mul: x * y });\n        "]))),
        fail: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n       "], ["\n            const calc = (x: number, y: number) => { return { add: x + y, sub: x - y, mul: x * y } };\n            const calc2 = (x: number, y: number) => {\n                return { add: x + y, sub: x - y, mul: x * y }\n            };\n       "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
