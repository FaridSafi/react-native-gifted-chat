/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
export declare const rules: {
    "adjacent-overload-signatures": boolean;
    "ban-types": {
        options: string[][];
    };
    "ban-ts-ignore": boolean;
    "member-access": {
        options: string[];
    };
    "member-ordering": {
        options: {
            order: string;
            alphabetize: boolean;
        };
    };
    "no-any": boolean;
    "no-empty-interface": boolean;
    "no-for-in": boolean;
    "no-import-side-effect": boolean;
    "no-inferrable-types": {
        options: string[];
    };
    "no-internal-module": boolean;
    "no-magic-numbers": boolean;
    "no-namespace": boolean;
    "no-non-null-assertion": boolean;
    "no-reference": boolean;
    "no-restricted-globals": boolean;
    "no-this-assignment": boolean;
    "no-var-requires": boolean;
    "only-arrow-functions": boolean;
    "prefer-for-of": boolean;
    "prefer-readonly": boolean;
    "promise-function-async": boolean;
    typedef: {
        options: string[];
    };
    "typedef-whitespace": {
        options: {
            "call-signature": string;
            "index-signature": string;
            parameter: string;
            "property-declaration": string;
            "variable-declaration": string;
        }[];
    };
    "unified-signatures": boolean;
    "await-promise": boolean;
    "ban-comma-operator": boolean;
    curly: boolean;
    forin: boolean;
    "function-constructor": boolean;
    "label-position": boolean;
    "no-arg": boolean;
    "no-async-without-await": boolean;
    "no-bitwise": boolean;
    "no-conditional-assignment": boolean;
    "no-console": boolean;
    "no-construct": boolean;
    "no-debugger": boolean;
    "no-duplicate-super": boolean;
    "no-duplicate-switch-case": boolean;
    "no-duplicate-variable": {
        options: string[];
    };
    "no-dynamic-delete": boolean;
    "no-empty": boolean;
    "no-eval": boolean;
    "no-floating-promises": boolean;
    "no-for-in-array": boolean;
    "no-implicit-dependencies": boolean;
    "no-inferred-empty-object-type": boolean;
    "no-invalid-template-strings": boolean;
    "no-misused-new": boolean;
    "no-null-keyword": boolean;
    "no-null-undefined-union": boolean;
    "no-object-literal-type-assertion": boolean;
    "no-promise-as-boolean": boolean;
    "no-return-await": boolean;
    "no-shadowed-variable": boolean;
    "no-string-literal": boolean;
    "no-string-throw": boolean;
    "no-sparse-arrays": boolean;
    "no-submodule-imports": boolean;
    "no-tautology-expression": boolean;
    "no-unbound-method": boolean;
    "no-unnecessary-class": {
        options: string[];
    };
    "no-unsafe-any": boolean;
    "no-unsafe-finally": boolean;
    "no-unused-expression": boolean;
    "no-var-keyword": boolean;
    "no-void-expression": boolean;
    "prefer-conditional-expression": boolean;
    radix: boolean;
    "restrict-plus-operands": boolean;
    "static-this": boolean;
    "strict-boolean-expressions": boolean;
    "strict-string-expressions": boolean;
    "strict-comparisons": boolean;
    "strict-type-predicates": boolean;
    "switch-default": boolean;
    "triple-equals": boolean;
    "unnecessary-constructor": boolean;
    "use-default-type-parameter": boolean;
    "use-isnan": boolean;
    "cyclomatic-complexity": boolean;
    eofline: boolean;
    indent: {
        options: string[];
    };
    "invalid-void": boolean;
    "linebreak-style": {
        options: string;
    };
    "max-classes-per-file": {
        options: number;
    };
    "max-file-line-count": {
        options: number;
    };
    "max-line-length": {
        options: {
            limit: number;
        };
    };
    "no-default-export": boolean;
    "no-default-import": boolean;
    "no-duplicate-imports": boolean;
    "no-irregular-whitespace": boolean;
    "no-mergeable-namespace": boolean;
    "no-parameter-reassignment": boolean;
    "no-require-imports": boolean;
    "no-trailing-whitespace": boolean;
    "object-literal-sort-keys": boolean;
    "prefer-const": boolean;
    "trailing-comma": {
        options: {
            esSpecCompliant: boolean;
            multiline: string;
            singleline: string;
        };
    };
    align: {
        options: string[];
    };
    "array-type": {
        options: string;
    };
    "arrow-parens": boolean;
    "arrow-return-shorthand": {
        options: string;
    };
    "binary-expression-operand-order": boolean;
    "callable-types": boolean;
    "class-name": boolean;
    "comment-format": {
        options: string[];
    };
    "comment-type": {
        options: string[];
    };
    "completed-docs": boolean;
    deprecation: boolean;
    encoding: boolean;
    "file-name-casing": {
        options: string;
    };
    "import-spacing": boolean;
    "increment-decrement": boolean;
    "interface-name": boolean;
    "interface-over-type-literal": boolean;
    "jsdoc-format": {
        options: string;
    };
    "match-default-export-name": boolean;
    "new-parens": boolean;
    "newline-before-return": boolean;
    "newline-per-chained-call": boolean;
    "no-angle-bracket-type-assertion": boolean;
    "no-boolean-literal-compare": boolean;
    "no-consecutive-blank-lines": boolean;
    "no-parameter-properties": boolean;
    "no-redundant-jsdoc": boolean;
    "no-reference-import": boolean;
    "no-unnecessary-callback-wrapper": boolean;
    "no-unnecessary-initializer": boolean;
    "no-unnecessary-qualifier": boolean;
    "no-unnecessary-type-assertion": boolean;
    "number-literal-format": boolean;
    "object-literal-key-quotes": {
        options: string;
    };
    "object-literal-shorthand": boolean;
    "one-line": {
        options: string[];
    };
    "one-variable-per-declaration": boolean;
    "ordered-imports": {
        options: {
            "grouped-imports": boolean;
            "import-sources-order": string;
            "named-imports-order": string;
            "module-source-path": string;
        };
    };
    "prefer-function-over-method": boolean;
    "prefer-method-signature": boolean;
    "prefer-object-spread": boolean;
    "prefer-switch": boolean;
    "prefer-template": boolean;
    "prefer-while": boolean;
    quotemark: {
        options: string[];
    };
    "return-undefined": boolean;
    semicolon: {
        options: string[];
    };
    "space-before-function-paren": {
        options: {
            anonymous: string;
            asyncArrow: string;
            constructor: string;
            method: string;
            named: string;
        };
    };
    "space-within-parens": {
        options: number;
    };
    "switch-final-break": boolean;
    "type-literal-delimiter": boolean;
    "unnecessary-bind": boolean;
    "unnecessary-else": boolean;
    "variable-name": {
        options: string[];
    };
    whitespace: {
        options: string[];
    };
};
export declare const RULES_EXCLUDED_FROM_ALL_CONFIG: string[];
export declare const jsRules: {
    [key: string]: any;
};
