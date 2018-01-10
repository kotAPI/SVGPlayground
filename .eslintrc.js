module.exports = {
  env: {
    'browser': true,
    'es6': true
  },
  extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  rules: {
    'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
    eqeqeq: ['error', 'always'], // adding some custom ESLint rules
  },
  parserOptions: {
    'ecmaVersion': 6
  },
};