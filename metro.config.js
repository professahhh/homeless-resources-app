const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};
const defaultConfig = getDefaultConfig(__dirname);

module.exports = () => {
    const mergedConfig = mergeConfig(withNativeWind(defaultConfig, { input: './src/styles/globals.css'}), config);
    mergedConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
    mergedConfig.resolver.assetExts = mergedConfig.resolver.assetExts.filter(ext => ext !== 'svg');
    mergedConfig.resolver.sourceExts.push('svg');
    return mergedConfig;
}
