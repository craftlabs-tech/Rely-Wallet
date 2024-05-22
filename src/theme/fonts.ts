import { TextStyle } from 'react-native';
import type { FontColors, FontSizes } from '@/types/theme/fonts';
import type { UnionConfiguration } from '@/types/theme/config';
import { config } from '@/theme/_config';

export const generateFontColors = (configuration: UnionConfiguration) => {
	return Object.entries(configuration.fonts.colors ?? {}).reduce((acc, [key, value]) => {
		return Object.assign(acc, {
			[`${key}`]: {
				color: value,
			},
		});
	}, {} as FontColors);
};

export const generateFontSizes = () => {
	return config.fonts.sizes.reduce((acc, size) => {
		return Object.assign(acc, {
			[`size_${size}`]: {
				fontSize: size,
			},
		});
	}, {} as FontSizes);
};

export const staticFontStyles = {
	bold: {
		fontWeight: 'bold',
	},
	uppercase: {
		textTransform: 'uppercase',
	},
	capitalize: {
		textTransform: 'capitalize',
	},
	alignCenter: {
		textAlign: 'center',
	},
	center: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	left: {
		textAlign: 'left',
	},
	right: {
		textAlign: 'right',
	},
	w_400: {
		fontWeight: '400',
	},
	w_500: {
		fontWeight: '500',
	},
	w_600: {
		fontWeight: '600',
	},
	w_700: {
		fontWeight: '700',
	},
	w_800: {
		fontWeight: '800',
	},
	w_900: {
		fontWeight: '900',
	},
	transformNone: {
		textTransform: 'none',
	},
	rubikBlack: {
		fontFamily: 'Rubik-Black',
	},
	rubikBlackItalic: {
		fontFamily: 'Rubik-BlackItalic',
	},
	rubikBold: {
		fontFamily: 'Rubik-Bold',
	},
	rubikBoldItalic: {
		fontFamily: 'Rubik-BoldItalic',
	},
	rubikExtraBold: {
		fontFamily: 'Rubik-ExtraBold',
	},
	rubikExtraBoldItalic: {
		fontFamily: 'Rubik-ExtraBoldItalic',
	},
	rubikItalic: {
		fontFamily: 'Rubik-Italic',
	},
	rubikLight: {
		fontFamily: 'Rubik-Light',
	},
	rubikLightItalic: {
		fontFamily: 'Rubik-LightItalic',
	},
	rubikMedium: {
		fontFamily: 'Rubik-Medium',
	},
	rubikMediumItalic: {
		fontFamily: 'Rubik-MediumItalic',
	},
	rubikRegular: {
		fontFamily: 'Rubik-Regular',
	},
	rubikSemiBold: {
		fontFamily: 'Rubik-SemiBold',
	},
	rubikSemiBoldItalic: {
		fontFamily: 'Rubik-SemiBoldItalic',
	},
} as const satisfies Record<string, TextStyle>;
