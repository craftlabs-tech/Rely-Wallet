/* eslint-disable react/require-default-props */
import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type Props = {
	animated?: boolean;
	bordered?: boolean;
	children: React.ReactNode;
	style?: ViewStyle | ViewStyle[];
	onPress?: () => void;
};

function AnimatedButton({ children, style, animated, bordered, onPress }: Props) {
	const { borders, gutters, layout } = useTheme();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const colorAnim = useRef(new Animated.Value(0)).current;
	const pressAnim = useRef(new Animated.Value(1)).current;

	const combinedScale = Animated.multiply(scaleAnim, pressAnim);

	const borderColor = colorAnim.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: ['#ffffff', '#513eff', 'yellow'],
	});

	const shadowStyle = {
		// shadowColor is not directly animatable
		shadowOffset: { height: 0, width: 12 },
		shadowOpacity: 0.4,
		shadowRadius: 12,
		elevation: 12,
	};

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.delay(3000),
				Animated.timing(scaleAnim, {
					toValue: 0.96,
					duration: 600,
					useNativeDriver: false,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 600,
					useNativeDriver: false,
				}),
			]),
		).start();
	}, [scaleAnim]);

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(colorAnim, {
					toValue: 1,
					duration: 3000,
					useNativeDriver: false, // Color animations don't support native driver
				}),
				Animated.timing(colorAnim, {
					toValue: 0,
					duration: 3000,
					useNativeDriver: false,
				}),
			]),
		).start();
	}, [colorAnim]);

	const handlePressIn = () => {
		Animated.spring(pressAnim, {
			toValue: 0.9,
			friction: 5,
			useNativeDriver: false,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(pressAnim, {
			toValue: 1,
			friction: 5,
			useNativeDriver: false,
		}).start();
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={[layout.center, layout.fullWidth, shadowStyle]}>
			<Animated.View
				style={[
					layout.w_70,
					layout.center,
					borders.rounded_48,
					gutters.paddingVertical_16,
					gutters.paddingHorizontal_24,
					// eslint-disable-next-line react-native/no-inline-styles
					{ backgroundColor: 'rgba(20,20,20,1)' },
					{ transform: [{ scale: animated ? combinedScale : pressAnim }] },
					bordered && { borderColor, ...borders.w_3 },
					style,
				]}>
				{children}
			</Animated.View>
		</TouchableOpacity>
	);
}

export default AnimatedButton;
