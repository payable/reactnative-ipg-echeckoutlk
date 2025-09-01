const path = require('path');

module.exports = function (api) {
  api.cache(true);

  // Use only the npm package - no local source alias
  console.log('📦 Using NPM package: echeckout-ipg-reactnative-sdk');

  const plugins = [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          // Force resolution to the npm package in node_modules
          'echeckout-ipg-reactnative-sdk': path.join(__dirname, 'node_modules', 'echeckout-ipg-reactnative-sdk-npm'),
        },
      },
    ],
  ];

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
