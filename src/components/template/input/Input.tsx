/* eslint-disable react/require-default-props */
/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { KeyboardTypeOptions, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type Props = {
	value: string;
	style?: ViewStyle;
	autoFocus?: boolean;
	bottomSheet?: boolean;
	placeholder: string;
	keyboardType: KeyboardTypeOptions;
	onChangeText: ((text: string) => void) | undefined;
};

function Input({
	value,
	style,
	autoFocus = false,
	bottomSheet = false,
	placeholder,
	keyboardType,
	onChangeText,
}: Props) {
	const Component = bottomSheet ? BottomSheetTextInput : TextInput;

	const { backgrounds, borders, colors, fonts, gutters, layout } = useTheme();

	const [secureTextEntry, setSecureTextEntry] = useState(true);

	return (
		<View style={[layout.fullWidth, layout.center, style]}>
			<Component
				style={[
					layout.fullWidth,
					gutters.paddingHorizontal_12,
					borders.rounded_8,
					backgrounds.ui_01,
					fonts.rubikRegular,
					fonts.text_01,
					{ height: 44 },
				]}
				placeholderTextColor={colors.text_02}
				placeholder={placeholder}
				keyboardType={keyboardType}
				autoCapitalize="none"
				autoCorrect={false}
				autoFocus={autoFocus}
				numberOfLines={1}
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
			/>
			<View style={[layout.absolute, layout.right_0]}>
				<TouchableOpacity
					onPress={() => setSecureTextEntry(!secureTextEntry)}
					style={[layout.flex_1, layout.center, gutters.paddingRight_12]}>
					<Ionicons name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.text_01} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default Input;
