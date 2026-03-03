import { defineConfig } from 'eslint/config';
import pluginJs from '@eslint/js';
import pluginTs from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
    jsx: false,
    quoteProps: 'as-needed',
    semi: true,
  }),
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
