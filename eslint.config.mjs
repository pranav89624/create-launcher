import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['node_modules', 'dist', 'build', 'templates/**', 'assets/**', '.husky/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts', 'bin/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                process: 'readonly',
                Buffer: 'readonly'
            }
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true
                }
            ],
            '@typescript-eslint/no-explicit-any': [
                'error',
                { ignoreRestArgs: false }
            ],
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
        }
    }
];
