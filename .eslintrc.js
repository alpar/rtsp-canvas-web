module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    mocha: true,
    es6: true
  },
  extends: 'standard',
  plugins: [
    'html',
    'standard',
    'promise'
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": 1,
    'eqeqeq': 1
    // 'semi': 0
    // 'semi': [2, "always"]
  },
  globals: {
    expect: true
  }
}
