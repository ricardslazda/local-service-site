import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores([
        'dist/',
        '.astro/',
        'test-results/',
        'playwright-report/',
        'temp/',
    ]),
    js.configs.recommended,
    tseslint.configs.recommended,
    astro.configs['flat/recommended'],
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    {
        files: ['**/*.{ts,astro}'],
        rules: {
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
        },
    },
    prettier,
    { rules: { curly: ['error', 'all'] } },
);
