import { useEffect, useCallback, useRef, useState } from 'react';
import { View, BackHandler, useWindowDimensions, Keyboard } from 'react-native';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { BIOMETRY_TYPE } from 'react-native-keychain';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSupportedBiometryType, getFromKeychain } from '@/services/keychain';
import { Button, Input, Text, KeyboardAvoidingView } from '@/components/template';
import { logger } from '@/services/logger';
import { storage } from '@/services/mmkv';
import { useTheme } from '@/theme';

function Login() {
	const { t } = useTranslation('login');
	const lottieRef = useRef<LottieView>(null);
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { width } = useWindowDimensions();

	const { colors, layout } = useTheme();

	const [password, setPassword] = useState('');
	const [biometryType, setBiometryType] = useState<BIOMETRY_TYPE | null>(null);

	const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

	const unlock = useCallback(
		(type: 'password' | 'biometry') => {
			lottieRef.current?.play();
			if (biometryType && type === 'biometry') {
				getFromKeychain('password')
					.then(result => {
						if (!result) {
							lottieRef.current?.pause();
							return;
						}
						lottieRef.current?.pause();
						navigation.navigate('root');
					})
					.catch(error => {
						logger.debug(JSON.stringify(error));
						lottieRef.current?.pause();
						Toast.show({
							type: 'error',
							text1: 'Error',
							text2: 'An error occurred while trying to unlock your wallet 🤖',
							topOffset: insets.top || 16,
							text1Style: { fontFamily: 'Rubik-Medium' },
							text2Style: { fontFamily: 'Rubik-Medium' },
						});
					});
			} else if (type === 'password') {
				const passcode = storage.getString('password');
				if (passcode === password) {
					lottieRef.current?.pause();
					navigation.navigate('root');
				} else {
					lottieRef.current?.pause();
					Toast.show({
						type: 'error',
						text1: 'Wrong password',
						text2: 'Check your password and try again 🤖',
						topOffset: insets.top || 16,
						text1Style: { fontFamily: 'Rubik-Medium' },
						text2Style: { fontFamily: 'Rubik-Medium' },
					});
				}
			}
		},
		[password, biometryType],
	);

	useEffect(() => {
		lottieRef.current?.pause();
		getSupportedBiometryType()
			.then(setBiometryType)
			.catch(error => logger.log(JSON.stringify(error)));
	}, []);

	useEffect(() => {
		navigation.addListener('beforeRemove', e => {
			e.preventDefault();
		});

		return () => {
			backHandler.remove();
		};
	}, [backHandler]);

	useFocusEffect(
		useCallback(() => {
			// if (biometryType) unlock('biometry');
		}, [biometryType]),
	);

	const reset = () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		!!Keyboard.isVisible && Keyboard.dismiss();
		navigation.navigate('reset');
	};

	return (
		<KeyboardAvoidingView>
			<View style={[layout.flex_1, layout.center, layout.fullWidth]}>
				<LottieView
					loop
					autoPlay={false}
					ref={lottieRef}
					style={{ width: width * 0.8, height: width * 0.8 }}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require('@/theme/assets/lottie/wallet-loading.lottie')}
				/>
			</View>
			<View style={[layout.flex_1, layout.center, layout.fullWidth, layout.gap_12]}>
				<Input
					value={password}
					style={layout.w_80}
					keyboardType="number-pad"
					placeholder={t('password')}
					onChangeText={setPassword}
				/>
				<View style={[layout.rowCenter, layout.justifyCenter, layout.gap_8]}>
					<Button
						type="primary"
						text={t('unlockWallet')}
						disabled={password.length < 6}
						onPress={() => unlock('password')}
					/>
					{!biometryType && (
						<Button type="primary" onPress={() => unlock('biometry')}>
							{biometryType !== BIOMETRY_TYPE.FACE_ID ? (
								<Svg width={24} height={24} fill="none">
									<Path
										fill={colors.text_04}
										fillRule="evenodd"
										d="M3.75 9V7A3.247 3.247 0 0 1 7 3.75h2a.75.75 0 0 0 0-1.5H7A4.75 4.75 0 0 0 2.25 7v2a.75.75 0 0 0 1.5 0zM15 3.75h2A3.247 3.247 0 0 1 20.25 7v2a.75.75 0 0 0 1.5 0V7A4.75 4.75 0 0 0 17 2.25h-2a.75.75 0 0 0 0 1.5zM2.25 15v2A4.75 4.75 0 0 0 7 21.75h2a.75.75 0 0 0 0-1.5H7A3.247 3.247 0 0 1 3.75 17v-2a.75.75 0 0 0-1.5 0zM15 21.75h2A4.75 4.75 0 0 0 21.75 17v-2a.75.75 0 0 0-1.5 0v2A3.247 3.247 0 0 1 17 20.25h-2a.75.75 0 0 0 0 1.5zM14.75 8.5v1a.75.75 0 0 0 1.5 0v-1a.75.75 0 0 0-1.5 0zm-7 0v1a.75.75 0 0 0 1.5 0v-1a.75.75 0 0 0-1.5 0zm4 4.036V10a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.416.67l-1 .5a.75.75 0 1 1-.67-1.341l.585-.293zm3.22 2.434a.75.75 0 0 1 1.06 1.06l-.002.002a5.698 5.698 0 0 1-8.058 0v-.002a.75.75 0 1 1 1.062-1.059 4.198 4.198 0 0 0 5.935 0h.002z"
										clipRule="evenodd"
									/>
								</Svg>
							) : (
								<MCIcons name="fingerprint" color={colors.text_04} size={20} />
							)}
						</Button>
					)}
				</View>
				<Button type="monocromatic" onPress={() => reset()}>
					<Text type="negative" value={t('forgotPassword')} />
				</Button>
				{/* 
					<Button type="primary" text="Primary" />
					<Button type="secondary" text="Secondary" />
					<Button type="icon" text="Icon" />
					<Button type="negative" text="Negative" />
					<Button type="positive" text="Positive" />
					<Button type="accent" text="Accent" />
					<Button type="disabled" text="Disabled" />
					<Button type="monocromatic" text="Monocromatic" /> */}
			</View>
		</KeyboardAvoidingView>
	);
}

export default Login;
