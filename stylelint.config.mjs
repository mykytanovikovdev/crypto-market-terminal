const BEM_CLASS_PATTERN =
    /^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/;

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    ignoreFiles: ['dist/**', 'coverage/**'],
    rules: {
        'selector-class-pattern': [
            BEM_CLASS_PATTERN,
            { message: (selector) => `Expected class "${selector}" to follow BEM naming` },
        ],
        'custom-property-empty-line-before': null,
        'at-rule-disallowed-list': [['import']],
        // Physical directions break RTL layouts; use logical properties instead.
        'property-disallowed-list': [
            [
                '/^margin-(left|right)$/',
                '/^padding-(left|right)$/',
                '/^border-(left|right)/',
                '/^border-(top|bottom)-(left|right)-radius$/',
                'left',
                'right',
            ],
        ],
        'declaration-property-value-disallowed-list': {
            '/^(text-align|float|clear)$/': ['left', 'right'],
        },
    },
};
