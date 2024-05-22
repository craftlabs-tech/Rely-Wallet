/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	presets: ['module:@react-native/babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				extensions: ['.js', '.json'],
				alias: {
					'@': './src',
					fs: '@dr.pogodin/react-native-fs',
					crypto: 'react-native-quick-crypto',
					stream: 'stream-browserify',
					buffer: '@craftzdog/react-native-buffer',
				},
			},
		],
		[
			'babel-plugin-inline-import',
			{
				extensions: ['.svg'],
			},
		],
		'inline-dotenv',
		'react-native-reanimated/plugin', // needs to be last
	],
};
