import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import html from "eslint-plugin-html";

export default [
  eslint.configs.recommended,
  prettier,
  {
	plugins: {
		prettier: eslintPluginPrettier,
	},
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
	files: ['*.js','*.html'],
	plugins: {
		html: html,
	}
  },
];
