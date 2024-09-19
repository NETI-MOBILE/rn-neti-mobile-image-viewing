module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        curly: 2, // never omit curly braces around blocks
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }], // class methods new line
        'padding-line-between-statements': [
          'error',
          { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }, // vars new line
          { blankLine: 'always', prev: '*', next: ['block-like', 'try'] }, // before try, throw, if, for etc... new line
          { blankLine: 'always', prev: ['block-like', 'try'], next: ['return'] }, // before return after try, throw, if, for etc... new line
        ],
        'default-param-last': 2,
        'max-classes-per-file': 2,
        'no-else-return': 2,
        'no-nested-ternary': 2,
        'no-unneeded-ternary': 2,
        'no-var': 2,
        'no-unused-vars': 0,
        'no-case-declarations': 0,
        '@typescript-eslint/no-non-null-assertion': 0, //foo.property!.includes('baz');
        'no-useless-escape': 0, //let baz = /\:/
        '@typescript-eslint/no-explicit-any': 0, //a:any
        '@typescript-eslint/no-inferrable-types': 0, //a: boolean = false
        '@typescript-eslint/no-non-null-asserted-optional-chain': 0, //foo?.bar!
        '@typescript-eslint/ban-ts-comment': 0, //@ts - ignore
        '@typescript-eslint/ban-types': 0, //lowerObj: Object = {};
        '@typescript-eslint/no-var-requires': 0, //requires(../../images)
        'no-extra-boolean-cast': 0, //!!Component
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-empty-interface': 0,
        'no-console': 2,
        'unused-imports/no-unused-imports': 2,
        'prefer-const': 0,
        '@typescript-eslint/no-empty-function': 0,
      },
    },
  ],
};
