import { Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
	type: 'primary' | 'secondary' | 'icon' | 'negative' | 'positive' | 'accent' | 'disabled' | 'monocromatic';
	value: string;
}

function Text({ type, value }: Props) {
	const { colors, fonts } = useTheme();

	const baseTextStyle: TextStyle = {
		...fonts.rubikMedium,
	};

	const getTextStyle = (): TextStyle => {
		switch (type) {
			case 'primary':
				return { ...baseTextStyle, color: colors.text_04 };
			case 'secondary':
				return { ...baseTextStyle, color: colors.text_02 };
			case 'icon':
				return { ...baseTextStyle, color: colors.text_01 };
			case 'negative':
				return { ...baseTextStyle, color: colors.negative_01 };
			case 'positive':
				return { ...baseTextStyle, color: colors.positive_01 };
			case 'accent':
				return { ...baseTextStyle, color: colors.text_05 };
			case 'disabled':
				return { ...baseTextStyle, color: colors.text_02 };
			case 'monocromatic':
				return { ...baseTextStyle, color: colors.text_01 };
			default:
				return { ...baseTextStyle, color: colors.text_04 };
		}
	};

	return <RNText style={getTextStyle()}>{value}</RNText>;
}

export default Text;
