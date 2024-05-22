/* eslint-disable react/require-default-props */
import { ReactNode } from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import Text from '../Text/Text';

interface Props {
	type: 'primary' | 'secondary' | 'icon' | 'negative' | 'positive' | 'accent' | 'disabled' | 'monocromatic';
	text?: string;
	style?: ViewStyle;
	loading?: boolean;
	disabled?: boolean;
	children?: ReactNode;
	onPress?: () => void;
	onLongPress?: () => void;
}

function Button({ type, text = '', style, loading, disabled, children, onPress, onLongPress }: Props) {
	const { colors, layout } = useTheme();

	const baseViewStyle: ViewStyle = {
		paddingHorizontal: 16,
		borderRadius: 8,
		height: 44,
	};

	const getViewStyle = (): ViewStyle => {
		if (disabled) {
			return { ...baseViewStyle, backgroundColor: colors.ui_01, ...style };
		}
		switch (type) {
			case 'primary':
				return { ...baseViewStyle, backgroundColor: colors.interactive_02, ...style };
			case 'secondary':
				return { ...baseViewStyle, backgroundColor: colors.interactive_02, ...style };
			case 'icon':
				return { ...baseViewStyle, backgroundColor: colors.interactive_02, ...style };
			case 'negative':
				return { ...baseViewStyle, backgroundColor: colors.negative_02, ...style };
			case 'positive':
				return { ...baseViewStyle, backgroundColor: colors.positive_02, ...style };
			case 'accent':
				return { ...baseViewStyle, backgroundColor: colors.interactive_01, ...style };
			case 'disabled':
				return { ...baseViewStyle, backgroundColor: colors.ui_01, ...style };
			case 'monocromatic':
				return { ...baseViewStyle, borderColor: colors.ui_01, backgroundColor: colors.ui_background, ...style };
			default:
				return { ...baseViewStyle, backgroundColor: colors.interactive_01, ...style };
		}
	};

	if (children) {
		return (
			<TouchableOpacity style={[layout.row, layout.center, getViewStyle()]} onPress={onPress} onLongPress={onLongPress}>
				{children}
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={[layout.row, layout.center, getViewStyle()]}>
			{loading ? (
				<ActivityIndicator color={colors.text_01} />
			) : (
				<Text type={disabled ? 'disabled' : type} value={text} />
			)}
		</TouchableOpacity>
	);
}

export default Button;
