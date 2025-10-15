import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config([
  {
    ignores: [
      '.workshop',
      'babel.config.cjs',
      'jest.config.cjs',
      'lint-staged.config.cjs',
      'v2-incompatible.js',
      'lib',
    ],
  },

  {
    extends: [js.configs.recommended, ...ts.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2018,
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
        ...globals.es2018,
      },
      sourceType: 'module',
    },
    linterOptions: {reportUnusedDisableDirectives: 'error'},
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
])
