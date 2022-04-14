module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
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
  },
}
