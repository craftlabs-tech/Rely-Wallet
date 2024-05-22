const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { createSentryMetroSerializer } = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	transformer: {
		babelTransformerPath: require.resolve('react-native-svg-transformer'),
	},
	serializer: { customSerializer: createSentryMetroSerializer() },
	resolver: {
		sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'json', 'svg'],
		assetExts: [...defaultConfig.resolver.assetExts, 'lottie'].filter(ext => ext !== 'svg'),
	},
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === 'crypto') {
		// when importing crypto, resolve to react-native-quick-crypto
		return context.resolveRequest(context, 'react-native-quick-crypto', platform);
	}
	// otherwise chain to the standard Metro resolver.
	return context.resolveRequest(context, moduleName, platform);
};

module.exports = mergeConfig(defaultConfig, config);
