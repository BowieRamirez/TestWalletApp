module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@app': './src/app',
            '@processes': './src/processes',
            '@widgets': './src/widgets',
            '@features': './src/features',
            '@entities': './src/entities',
            '@shared': './src/shared',
            '@banking/ui': '../../packages/ui/src/index.ts',
            '@banking/api': '../../packages/api/src/index.ts',
            '@banking/security': '../../packages/security/src/index.ts',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
