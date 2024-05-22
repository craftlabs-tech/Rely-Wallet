/* eslint-disable @typescript-eslint/no-var-requires */
import { BackHandler, SafeAreaView, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setOnboarding } from '@/store/wallet';
import { useTheme } from '@/theme';

function Lottie(source: unknown, scale: number) {
	const { width } = useWindowDimensions();
	return <LottieView source={source as string} style={{ width: width * scale, height: width * 0.8 }} autoPlay loop />;
}

function OnboardingScreen() {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation('onboarding');
	const { backgrounds, colors, layout } = useTheme();

	const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

	const onDone = () => {
		backHandler.remove();
		dispatch(setOnboarding(true));
		navigation.navigate('welcome' as never);
	};

	return (
		<SafeAreaView style={[layout.flex_1, backgrounds.ui_background]}>
			<Onboarding
				onSkip={onDone}
				onDone={onDone}
				pages={[
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/wallet.lottie'), 0.8),
						title: t('title1'),
						subtitle: t('subtitle1'),
					},
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/multichain.lottie'), 0.8),
						title: t('title2'),
						subtitle: t('subtitle2'),
					},
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/secure.lottie'), 0.8),
						title: t('title3'),
						subtitle: t('subtitle3'),
					},
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/browser2.lottie'), 0.8),
						title: t('title4'),
						subtitle: t('subtitle4'),
					},
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/finance.lottie'), 1),
						title: t('title5'),
						subtitle: t('subtitle5'),
					},
					{
						backgroundColor: colors.ui_background,
						image: Lottie(require('@/theme/assets/lottie/nft.lottie'), 0.8),
						title: t('title6'),
						subtitle: t('subtitle6'),
					},
				]}
			/>
		</SafeAreaView>
	);
}

export default OnboardingScreen;
