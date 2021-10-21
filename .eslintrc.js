module.exports = {
    root: true,
    env: {
        browser: true,
        mocha: true,
        es6: true,
        jest: true,
        node: true
    },
    parser: '@typescript-eslint/parser',

    extends: [
        'airbnb-base',
        'airbnb-typescript',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:eslint-comments/recommended',
        'plugin:jest/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'plugin:import/recommended',
        // 'prettier',
    ],

    plugins: [
        '@typescript-eslint',
        'eslint-comments',
        'react',
        'jest',
        'promise',
        'unicorn',
        'import'
    ],

    parserOptions: {
        project: './tsconfig.json',
    },

    globals: {
        expect: true
    },

    rules: {
        '@typescript-eslint/no-this-alias': ['error', {
            allowDestructuring: true, // Allow `const { props, state } = this`; false by default
            allowedNames: ['self'] // Allow `const self = this`; `[]` by default
        }],
        '@typescript-eslint/ban-ts-comment': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/naming-convention': ['off'],
        '@typescript-eslint/no-empty-interface': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-floating-promises': ['off'],
        '@typescript-eslint/no-inferrable-types': ['off'],
        '@typescript-eslint/no-misused-promises': ['off'],
        '@typescript-eslint/no-namespace': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/no-redeclare': ['off'],
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/no-unsafe-argument': ['off'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/no-unsafe-call': ['off'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-unused-vars': ['off'],
        '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true, typedefs: true },],
        '@typescript-eslint/require-await': ['off'],
        '@typescript-eslint/restrict-plus-operands': ['off'],
        '@typescript-eslint/restrict-template-expressions': ['off'],
        '@typescript-eslint/unbound-method': ['off'],
        'array-callback-return': ['off'],
        'arrow-parens': ['off'],
        'comma-dangle': ['off'],
        'consistent-return': ['off'],
        'default-case': ['off'],
        'func-names': ['off'],
        'import/extensions': ['error', 'never', {'vue': 'always'}],
        'import/no-cycle': ['off'],
        'import/no-default-export': ['off'],
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': ['off'],
        'import/prefer-default-export': 'off',
        'jest/expect-expect': ['off'],
        'jest/no-conditional-expect': ['off'],
        'jest/no-done-callback': ['off'],
        'jest/no-focused-tests': ['off'],
        'max-classes-per-file': ['off'],
        'max-len': ['off'],
        'no-case-declarations': ['off'],
        'no-console': ['off'],
        'no-empty-pattern': ['off'],
        'no-multi-assign': ['off'],
        'no-param-reassign': ['off'],
        'no-plusplus': ['off'],
        'no-prototype-builtins': 'off',
        'no-restricted-globals': ['off'],
        'no-underscore-dangle': ['off'],
        'no-unused-vars': 0,
        'no-use-before-define': ['error', { functions: false, classes: true, variables: true },],
        'no-use-before-define': ['off'],
        'no-useless-return': ['off'],
        'promise/always-return': ['off'],
        'promise/catch-or-return': ['off'],
        'quotes': ['warn', 'single', { avoidEscape: true }],
        'react/destructuring-assignment': 'off',
        'react/jsx-filename-extension': 'off',
        'semi-style': ['off'],
        'space-before-function-paren': ['off'],
        'unicorn/consistent-destructuring': ['off'],
        'unicorn/consistent-function-scoping': ['off'],
        'unicorn/filename-case': ['off'],
        'unicorn/no-array-callback-reference': ['off'],
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-null': ['off'],
        'unicorn/prefer-default-parameters': ['off'],
        'unicorn/prefer-dom-node-text-content': ['off'],
        'unicorn/prefer-spread': ['off'],
        'unicorn/prevent-abbreviations': 'off',
        'vue/attributes-order': ['off'],
        'vue/html-indent': ['off'],
        'vue/max-attributes-per-line': ['off'],
        'vue/multiline-html-element-content-newline': 0,
        'vue/no-unused-components': 0,
        'vue/script-indent': ['off'],
    },

    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        }
    ]
}
