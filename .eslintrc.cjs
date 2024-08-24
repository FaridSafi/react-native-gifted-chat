module.exports = {
  env: {
    es2021: true,
    // jest: true,
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:json/recommended-legacy',
    'plugin:jest/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
        project: './tsconfig.json',
      },
    },
    {
      files: ["tests/**/*"],
      plugins: ["jest"],
      env: {
        'jest/globals': true,
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@stylistic',
    'react',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    '@stylistic/no-explicit-any': 'off',
    'react/no-unknown-property': 0,
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 'first',
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
    'template-curly-spacing': 'off',
    'linebreak-style': ['off', 'unix'],
    'quotes': ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none', // No semicolon for multiline
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma', // Use comma for single line
          requireLast: false,
        },
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'never',
        functions: 'never',
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'no-func-assign': 'off',
    'no-class-assign': 'off',
    'no-useless-escape': 'off',
    'curly': [2, 'multi', 'consistent'],
    'react/prop-types': 'off', // TODO: TURN ON AND FIX ALL WARNINGS
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          '(useAnimatedStyle|useSharedValue|useAnimatedGestureHandler|useAnimatedScrollHandler|useAnimatedProps|useDerivedValue|useAnimatedRef|useAnimatedReact|useAnimatedReaction)',
        // useAnimatedReaction
        // USE RULE FUNC/FUNC/DEPS
      },
    ],
    'no-unused-vars': ['error'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'nonblock-statement-body-position': ['error', 'below'],
    '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'no-unreachable': 'error',
  },
  globals: {
    describe: 'readonly',
    test: 'readonly',
    jest: 'readonly',
    expect: 'readonly',
    fetch: 'readonly',
    navigator: 'readonly',
    __DEV__: 'readonly',
    XMLHttpRequest: 'readonly',
    FormData: 'readonly',
    React$Element: 'readonly',
    requestAnimationFrame: 'readonly',
  },
}
