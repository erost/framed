import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

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
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        // ES2021 globals
        Promise: 'readonly',
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
