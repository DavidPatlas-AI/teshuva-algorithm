const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'js', 'jsx', 'json'],
    // brain/ and shared/ have no node_modules of their own — Metro resolves
    // bare imports (e.g. @react-native-async-storage/async-storage) by
    // walking up from the importing file's own directory, which for files
    // outside this project root would miss mobile/node_modules entirely.
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
  // brain/ and shared/ live one level up, outside this Metro project root —
  // Metro won't resolve imports from there unless explicitly watched.
  watchFolders: [
    path.resolve(__dirname, '../brain'),
    path.resolve(__dirname, '../shared'),
  ],
};

module.exports = mergeConfig(defaultConfig, config);
