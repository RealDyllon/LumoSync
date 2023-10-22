module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        safe: false,
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin', // has to be last
  ],
};
