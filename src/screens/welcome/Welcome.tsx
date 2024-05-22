import { useEffect } from 'react';
import { Image, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { triggerHapticFeedback } from '@/utils/haptics';
import { AnimatedButton } from '@/components/template';
import { getRandomColor } from '@/utils/theme';
import { useTheme } from '@/theme';

function Welcome() {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { width, height } = useWindowDimensions();
	const { backgrounds, layout, fonts, gutters, variant } = useTheme();

	const leftColor = useSharedValue('#513eff');
	const rightColor = useSharedValue('#52e5ff');

	const colors = useDerivedValue(() => [leftColor.value, rightColor.value], []);

	useEffect(() => {
		const interval = setInterval(() => {
			leftColor.value = withTiming(getRandomColor(), { duration: 3000 });
			rightColor.value = withTiming(getRandomColor(), { duration: 3000 });
		}, 3000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	const createWallet = () => {
		triggerHapticFeedback('soft', { ignoreAndroidSystemSettings: true });
		navigation.navigate('createWallet');
	};

	const importWallet = () => {
		triggerHapticFeedback('soft', { ignoreAndroidSystemSettings: true });
		navigation.navigate('importWallet');
	};

	return (
		<View style={[layout.flex_1, backgrounds.white]}>
			<Canvas style={layout.flex_1}>
				<Rect x={0} y={0} width={width} height={height}>
					<LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={colors} />
				</Rect>
			</Canvas>
			<View
				style={[
					layout.flex_1,
					layout.fullWidth,
					layout.fullHeight,
					layout.absolute,
					layout.itemsCenter,
					layout.justifyBetween,
					layout.z10,
					{ paddingTop: insets.top, paddingBottom: insets.bottom },
				]}>
				<View style={[layout.flex_1, layout.fullWidth, layout.center]}>
					<Text
						style={[
							fonts.size_32,
							fonts.rubikMedium,
							gutters.paddingBottom_24,
							variant === 'dark' ? fonts.text_01 : fonts.text_05,
						]}>
						Rely Wallet
					</Text>
					<AnimatedButton
						bordered
						animated
						onPress={createWallet}
						style={[gutters.marginVertical_6, gutters.paddingHorizontal_32, gutters.paddingVertical_14]}>
						<Text style={[fonts.size_20, fonts.rubikMedium, variant === 'dark' ? fonts.text_01 : fonts.text_05]}>
							Create a wallet
						</Text>
					</AnimatedButton>
					<AnimatedButton animated={false} onPress={importWallet} style={[gutters.marginVertical_8]}>
						<Text style={[fonts.size_20, fonts.rubikMedium, variant === 'dark' ? fonts.text_01 : fonts.text_05]}>
							I already have one
						</Text>
					</AnimatedButton>
				</View>
				<View style={[layout.center, gutters.paddingHorizontal_24, gutters.paddingVertical_6]}>
					<Text style={[fonts.alignCenter, fonts.rubikRegular, variant === 'dark' ? fonts.text_01 : fonts.text_05]}>
						By proceeding, you agree to our <Text style={[fonts.text_04, fonts.rubikRegular]}>Terms of Service</Text>
					</Text>
				</View>
			</View>
			<Image
				resizeMode="contain"
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				source={require('@/theme/assets/images/wallet-money.png')}
				style={[
					layout.absolute,
					layout.opacity_75,
					{
						width: width * 0.8,
						height: (width * 0.8) / (width / 500),
						bottom: height > 800 ? height * 0.02 : height * -0.1,
						right: width * 0.12,
					},
				]}
			/>
		</View>
	);
}

export default Welcome;
