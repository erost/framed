import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },

  // Base ESLint recommended rules
  js.configs.recommended,

  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Global configuration
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'max-len': ['warn', { code: 100 }],
      'complexity': ['warn', 10],
      'max-depth': ['warn', 3],
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
    },
  },
];
