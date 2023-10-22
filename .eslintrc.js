module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['e2e/**/*.test.js'],
      rules: {
        'no-debugger': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
