import { defineConfig } from 'eslint/config';
import pluginJs from '@eslint/js';
import pluginTs from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginTestingLibrary from 'eslint-plugin-testing-library';

export default defineConfig([
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
    jsx: false,
    quoteProps: 'as-needed',
    semi: true,
  }),
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: pluginTs.parser,
      },
    },
  },
  {
    rules: {
      '@stylistic/space-before-function-paren': 'error',
      '@stylistic/newline-per-chained-call': [
        'error',
        { ignoreChainWithDepth: 1 },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: { vitest: pluginVitest },
    rules: pluginVitest.configs.recommended.rules,
  },
  {
    files: ['src/client/**/*.test.{ts,tsx}'],
    ...pluginTestingLibrary.configs['flat/vue'],
  },
]);
