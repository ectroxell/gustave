import { defineConfig } from 'eslint/config';
import pluginJs from '@eslint/js';
import pluginTs from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';

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
]);
