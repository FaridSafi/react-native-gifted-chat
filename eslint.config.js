import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jestPlugin from 'eslint-plugin-jest'
import perfectionistPlugin from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    ignores: ['**/node_modules/**', '**/lib/**', '**/build/**', '**/.expo/**', '**/android/**', '**/ios/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        fetch: 'readonly',
        navigator: 'readonly',
        __DEV__: 'readonly',
        XMLHttpRequest: 'readonly',
        FormData: 'readonly',
        React$Element: 'readonly',
        requestAnimationFrame: 'readonly',

        // Node.js globals for build scripts and configuration files
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        global: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': typescriptEslint,
      'import': importPlugin,
      'perfectionist': perfectionistPlugin,
      'react': react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks:
            '(useAnimatedStyle|useSharedValue|useAnimatedGestureHandler|useAnimatedScrollHandler|useAnimatedProps|useDerivedValue|useAnimatedRef|useAnimatedReact|useAnimatedReaction|useCallbackDebounced|useCallbackThrottled)',
        },
      ],

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      // Stylistic rules
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        },
      ],
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 'first',
          ignoredNodes: ['TemplateLiteral'],
        },
      ],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'never',
          functions: 'never',
        },
      ],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/template-curly-spacing': 'off',
      '@stylistic/linebreak-style': ['off', 'unix'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],

      // General rules
      'no-func-assign': 'off',
      'no-class-assign': 'off',
      'no-useless-escape': 'off',
      'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars instead
      'no-unreachable': 'error',
      'curly': [2, 'multi', 'consistent'],
      'nonblock-statement-body-position': ['error', 'below'],

      // Perfectionist rules
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'react',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          customGroups: {
            value: {
              react: ['^react$', '^react-native$'],
            },
          },
          newlinesBetween: 'ignore',
        },
      ],
      'perfectionist/sort-interfaces': 'off',
    },
  },
  {
    files: ['tests/**/*', 'src/__tests__/**/*'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
]
