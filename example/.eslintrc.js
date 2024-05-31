module.exports = {
  env: {
    es2020: true,
    'jest/globals': true,
  },
  parser: '@babel/eslint-parser',
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:json/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jest',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-key': 1,
    indent: [
      'error',
      2, {
        SwitchCase: 1,
        ignoredNodes: [
          'TemplateLiteral',
        ],
      },
    ],
    'template-curly-spacing': 'off',
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    'jsx-quotes': [
      'error',
      'prefer-single',
    ],
    semi: [
      'error',
      'never',
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
    'no-func-assign': 'off',
    'no-class-assign': 'off',
    'no-useless-escape': 'off',
    curly: [2, 'multi', 'consistent'],
    'react/prop-types': 'off', // TODO: TURN ON AND FIX ALL WARNINGS
    'react/display-name': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'react/jsx-curly-spacing': ['error', {
      attributes: { when: 'never' },
      children: { when: 'never' },
      allowMultiline: true,
    }],
    'react/jsx-curly-brace-presence': ['error', {
      props: 'never',
      children: 'always',
    }],
    'arrow-parens': ['error', 'as-needed'],
  },
  overrides: [{
    files: ['**/*.ts', '**/*.tsx'],
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended'],
    // TOREMOVE?
    // rules: {
    //   'no-undef': 'off',
    //   'no-unused-vars': 'off',
    //   '@typescript-eslint/no-unused-vars': 'off',
    // },
  }],
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
