/* eslint-disable react-native/no-inline-styles */
import { useRef } from 'react';
import { View, Animated, TextInput, TouchableOpacity, Keyboard, useWindowDimensions } from 'react-native';
import { useTheme } from '@/theme';

const Touchable = Animated.createAnimatedComponent(TouchableOpacity);

// eslint-disable-next-line react/require-default-props
function SearchBar({ padding = 16 }: { padding?: number }) {
	const { width } = useWindowDimensions();
	const { backgrounds, borders, colors, fonts, gutters, layout } = useTheme();

	const shrinkWidth = width - padding - 96;
	const searchBarWidth = width - padding * 2;

	const opacity = useRef(new Animated.Value(0)).current;
	const cancel = useRef(new Animated.Value(0)).current;
	const input = useRef(new Animated.Value(width - padding * 2)).current;

	const onFocus = () => {
		Animated.parallel([
			Animated.timing(input, {
				toValue: shrinkWidth,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(cancel, {
				toValue: 16,
				duration: 400,
				useNativeDriver: false,
			}),
			Animated.timing(opacity, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start();
	};

	const onBlur = () => {
		Animated.parallel([
			Animated.timing(input, {
				toValue: searchBarWidth,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(cancel, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start();
	};

	return (
		<View style={[layout.fullWidth, layout.row, gutters.marginVertical_24]}>
			<Animated.View
				style={[
					layout.flex_1,
					layout.row,
					layout.center,
					layout.absolute,
					layout.selfCenter,
					backgrounds.ui_01,
					borders.rounded_8,
					{ left: padding, height: 44, width: input },
				]}>
				<TextInput
					onBlur={onBlur}
					onFocus={onFocus}
					placeholder="Type something"
					placeholderTextColor={colors.text_02}
					style={[layout.flex_1, gutters.paddingHorizontal_12, fonts.rubikRegular]}
				/>
			</Animated.View>

			<Touchable
				style={[layout.absolute, layout.center, layout.selfCenter, gutters.marginHorizontal_16, { right: cancel }]}
				onPress={Keyboard.dismiss}>
				<Animated.Text style={[fonts.rubikRegular, fonts.text_01, { opacity }]}>Cancel</Animated.Text>
			</Touchable>
		</View>
	);
}

export default SearchBar;
