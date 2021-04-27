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
exports.rules = {
    "adjacent-overload-signatures": true,
    "array-type": {
        options: ["array"],
    },
    "ban-types": {
        options: [
            ["Object", "Avoid using the `Object` type. Did you mean `object`?"],
            [
                "Function",
                "Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
            ],
            ["Boolean", "Avoid using the `Boolean` type. Did you mean `boolean`?"],
            ["Number", "Avoid using the `Number` type. Did you mean `number`?"],
            ["String", "Avoid using the `String` type. Did you mean `string`?"],
            ["Symbol", "Avoid using the `Symbol` type. Did you mean `symbol`?"],
        ],
    },
    "callable-types": true,
    "class-name": true,
    "comment-format": {
        options: ["check-space"],
    },
    "cyclomatic-complexity": false,
    forin: true,
    "jsdoc-format": true,
    "label-position": true,
    "max-classes-per-file": { options: 1 },
    "new-parens": true,
    "no-angle-bracket-type-assertion": true,
    "no-any": false,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-console": true,
    "no-construct": true,
    "no-debugger": true,
    "no-duplicate-super": true,
    "no-empty": true,
    "no-empty-interface": true,
    "no-eval": true,
    "no-internal-module": true,
    "no-invalid-this": false,
    "no-misused-new": true,
    "no-namespace": true,
    "no-parameter-properties": false,
    "no-reference": true,
    "no-reference-import": true,
    "no-shadowed-variable": true,
    "no-string-literal": true,
    "no-string-throw": true,
    "no-switch-case-fall-through": false,
    "no-trailing-whitespace": true,
    "no-unnecessary-initializer": true,
    "no-unsafe-finally": true,
    "no-unused-expression": true,
    "no-use-before-declare": false,
    "no-var-keyword": true,
    "no-var-requires": true,
    "object-literal-shorthand": true,
    "one-variable-per-declaration": { options: ["ignore-for-loop"] },
    "only-arrow-functions": {
        options: ["allow-declarations", "allow-named-functions"],
    },
    "prefer-const": true,
    "prefer-for-of": true,
    radix: true,
    "triple-equals": { options: ["allow-null-check"] },
    typedef: false,
    "typeof-compare": false,
    "unified-signatures": true,
    "use-isnan": true,
    "variable-name": {
        options: ["allow-leading-underscore", "ban-keywords", "check-format", "allow-pascal-case"],
    },
};
exports.jsRules = {
    "class-name": true,
    forin: true,
    "import-spacing": true,
    "jsdoc-format": true,
    "label-position": true,
    "new-parens": true,
    "no-arg": true,
    "no-bitwise": true,
    "no-conditional-assignment": true,
    "no-consecutive-blank-lines": true,
    "no-console": true,
    "no-construct": true,
    "no-debugger": true,
    "no-duplicate-super": true,
    "no-duplicate-variable": true,
    "no-empty": true,
    "no-eval": true,
    "no-reference": true,
    "no-shadowed-variable": true,
    "no-string-literal": true,
    "no-string-throw": true,
    "no-switch-case-fall-through": false,
    "no-unused-expression": true,
    // disable this rule as it is very heavy performance-wise and not that useful
    "no-use-before-declare": false,
    "one-variable-per-declaration": { options: ["ignore-for-loop"] },
    radix: true,
    "triple-equals": { options: ["allow-null-check"] },
    "use-isnan": true,
    "variable-name": {
        options: ["allow-leading-underscore", "ban-keywords", "check-format", "allow-pascal-case"],
    },
};
