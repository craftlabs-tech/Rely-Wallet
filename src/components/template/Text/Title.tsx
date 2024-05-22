/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, StyleProp } from 'react-native';
import { useTheme } from '@/theme';

interface TitleProps {
	title: string;
	subtitle: string;
	style?: StyleProp<any>;
}
function Title({ title, subtitle, ...props }: TitleProps) {
	const { fonts, layout } = useTheme();

	return (
		<View style={[layout.center, layout.gap_8, props.style]}>
			<Text style={[fonts.text_01, fonts.size_17, fonts.center, fonts.rubikRegular, fonts.w_700]}>{title}</Text>
			<Text style={[fonts.text_02, fonts.center, fonts.rubikRegular]}>{subtitle}</Text>
		</View>
	);
}

export default Title;
