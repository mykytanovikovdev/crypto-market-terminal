import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier/flat';

export default defineConfigWithVueTs(
    globalIgnores(['dist/**', 'coverage/**']),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,

    {
        name: 'project/rules',
        files: ['**/*.{ts,vue}'],
        rules: {
            'no-console': 'error',
            'no-debugger': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],
            camelcase: ['error', { properties: 'never' }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'scss' } }],
            'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/define-macros-order': 'error',
            'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/prefer-true-attribute-shorthand': 'error',
            'vue/require-typed-ref': 'error',
        },
    },

    prettierConfig,
);
