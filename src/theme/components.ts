import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/types/theme/theme';

export default ({ layout, backgrounds, borders, fonts, colors, gutters, variant }: ComponentTheme) => {
	return {
		buttonCircle: {
			...layout.justifyCenter,
			...layout.itemsCenter,
			...backgrounds.purple100,
			...fonts.gray400,
			height: 70,
			width: 70,
			borderRadius: 35,
		},
		circle250: {
			borderRadius: 140,
			height: 250,
			width: 250,
		},
		screen: {
			...layout.flex_1,
			...layout.center,
			...layout.fullWidth,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16,
			backgroundColor: colors.ui_background,
		},
		searchBar: {
			...borders.rounded_16,
			...fonts.rubikRegular,
			backgroundColor: colors.ui_01,
			color: colors.text_01,
			paddingVertical: 12,
			paddingHorizontal: 36,
			height: 44,
			textAlign: 'center',
			textAlignVertical: 'center',
		},
		textInput: {
			...borders.rounded_8,
			...layout.w_80,
			color: colors.text_01,
			backgroundColor: colors.ui_01,
			paddingVertical: 12,
			paddingHorizontal: 8,
			height: 44,
			textAlign: 'left',
			textAlignVertical: 'center',
		},
		textArea: {
			...borders.rounded_8,
			...layout.w_80,
			color: colors.text_01,
			backgroundColor: colors.ui_01,
			padding: 12,
			height: 88,
			textAlign: 'left',
			textAlignVertical: 'center',
		},
		avatar: {
			...borders.w_1,
			...borders.rounded_24,
			borderColor: colors.border_02,
			height: 48,
			width: 48,
		},
		button: {
			...layout.center,
			...borders.rounded_8,
			height: 44,
			backgroundColor: variant === 'dark' ? colors.interactive_01 : colors.ui_03,
		},
		buttonText: {
			...fonts.center,
			...fonts.rubikMedium,
			color: colors.white,
			overflow: 'hidden',
		},
		handle: {
			backgroundColor: colors.white,
			opacity: 0.6,
			borderRadius: 32,
			width: 48,
			height: 6,
		},
		base: {
			...layout.center,
			...borders.rounded_8,
			backgroundColor: colors.ui_01,
		},
		card: {
			...borders.rounded_8,
			...gutters.padding_8,
			borderWidth: 1,
			borderColor: colors.ui_01,
			backgroundColor: colors.ui_background,
		},
	} as const satisfies Record<string, ImageStyle | TextStyle | ViewStyle>;
};
