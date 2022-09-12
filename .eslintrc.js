module.exports = {
  ignorePatterns: [".eslintrc.js"],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ["tsconfig.eslint.json"],
  },
  plugins: ["prettier", "jest", "@typescript-eslint"],
  extends: ["airbnb", "prettier", "plugin:@typescript-eslint/recommended"],
  rules: {
    'member-access': 0,
    'interface-name': 0,
    'ordered-imports': 0,
    'object-literal-sort-keys': 0,
    'variable-name': 0,
    'one-variable-per-declaration': 0,
    'no-empty': 0,
    'no-console': 0,
    'no-shadowed-variable': 0,
    'no-extra-boolean-cast': 0,
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/extensions": [ "error", "ignorePackages", { js: "never", jsx: "never", ts: "never", tsx: "never" }, ],
    "no-underscore-dangle": "off",
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],

    "@typescript-eslint/ban-ts-comment": 0, // FIXME: should be considered
    "@typescript-eslint/no-inferrable-types": 0, // FIXME: should be considered
    "@typescript-eslint/no-non-null-asserted-optional-chain": 0, // FIXME: should be considered
    "@typescript-eslint/no-non-null-assertion": 0,  // FIXME: should be considered
    "@typescript-eslint/no-unused-vars": 0, // FIXME: should be considered
    "arrow-body-style": 0, // FIXME: should be considered
    "class-methods-use-this": 0, // FIXME: should be considered
    "default-param-last": 0, // FIXME: should be considered
    "eqeqeq": 0, // FIXME: should be considered
    "import/no-cycle": 0, // FIXME: should be considered
    "import/order": 0, // FIXME: should be considered
    "import/prefer-default-export": 0, // FIXME: should be considered
    "lines-between-class-members": 0, // FIXME: should be considered
    "no-else-return": 0, // FIXME: should be considered
    "no-lonely-if": 0, // FIXME: should be considered
    "no-param-reassign": 0, //FIME
    "no-return-assign": 0, // FIXME: should be considered
    "no-shadow": 0,
    "no-use-before-define": 0, // FIXME: should be considered
    "no-useless-return": 0, // FIXME: should be considered
    "prefer-destructuring": 0, // FIXME: should be considered
    "react/destructuring-assignment": 0, // FIXME: should be considered
    "react/forbid-prop-types": 0, // FIXME: should be considered
    "react/function-component-definition": 0,// FIXME: should be considered
    "react/jsx-curly-brace-presence": 0, // FIXME: should be considered
    "react/jsx-no-constructed-context-values": 0, // FIXME: should be considered
    "react/jsx-no-constructed-context-values": 0, // FIXME: should be considered
    "react/jsx-props-no-spreading": 0, // FIXME: should be considered
    "react/no-array-index-key": 0, // FIXME: should be considered
    "react/no-unused-class-component-methods": 0, // FIXME: should be considered
    "react/no-unused-prop-types": 0, // FIXME: should be considered
    "react/require-default-props": 0, // FIXME: should be considered
    "react/sort-comp": 0, // FIXME: should be considered
    "react/state-in-constructor": 0, // FIXME: should be considered
    "react/static-property-placement": 0, // FIXME: should be considered
    "spaced-comment": 0, // FIXME: should be considered
  },
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".test.ts", ".test.tsx", ".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
}
