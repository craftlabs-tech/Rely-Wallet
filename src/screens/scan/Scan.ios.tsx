/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Camera, CodeScanner, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Canvas, DiffRect, rrect, rect } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { Button, Title } from '@/components/template';
import { ErrorLog, logger } from '@/services/logger';
import { useTheme } from '@/theme';
import {
	getWalletClient,
	isWalletConnectURI,
	isWalletConnectURIV1,
	isWalletConnectURIV2,
} from '@/services/walletConnect';

import type { SessionTypes } from '@walletconnect/types';

function Scan() {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { width, height } = useWindowDimensions();
	const { colors, backgrounds, borders, components, fonts, gutters, layout } = useTheme();

	const device = useCameraDevice('back');
	const { hasPermission, requestPermission } = useCameraPermission();

	const [isScanning, setIsScanning] = useState(true);

	const [activeSessions, setActiveSessions] = useState<SessionTypes.Struct[]>([]);

	const codeScanner: CodeScanner = {
		codeTypes: ['qr', 'ean-13'],
		onCodeScanned: codes => {
			setIsScanning(false);
			codes.forEach(code => {
				if (!code.value) return;
				if (isWalletConnectURI(code.value) && isWalletConnectURIV1(code.value)) {
					Toast.show({
						type: 'error',
						text1: 'WalletConnect V1 is deprecated',
						text2: 'WalletConnect V1 is no longer supported2',
						position: 'top',
						topOffset: insets.top * 1.6 || 32,
						text1Style: { fontFamily: 'Rubik-Medium' },
						text2Style: { fontFamily: 'Rubik-Medium' },
					});
				}
				if (isWalletConnectURI(code.value) && isWalletConnectURIV2(code.value)) {
					void pair(code.value);
				}
			});
		},
	};

	const pair = async (uri: string) => {
		try {
			const client = await getWalletClient();
			void client.pair({ uri });
			navigation.goBack();
		} catch (error) {
			logger.error(new ErrorLog(`WalletConnect pairing failed ${JSON.stringify(error)}`), { type: 'error' });
			navigation.goBack();
		}
	};

	useEffect(() => {
		getWalletClient()
			.then(client => setActiveSessions(Object.values(client.getActiveSessions())))
			.catch(error => logger.error(new ErrorLog(JSON.stringify(error)), { type: 'error' }));
	}, []);

	if (!hasPermission)
		return (
			<View style={[components.screen, layout.justifyAround]}>
				<Title title="Camera Permission" subtitle="Please allow camera permission to continue" />
				<LottieView
					loop
					autoPlay
					speed={2}
					style={{ width, height: width }}
					source={require('@/theme/assets/lottie/camera.lottie')}
				/>

				<Button type="primary" text="Allow Camera" style={layout.w_80} onPress={requestPermission} />
			</View>
		);

	if (!device)
		return (
			<View style={[components.screen, layout.justifyAround]}>
				<Title title="Camera Error" subtitle="No camera device found" />
				<Image
					resizeMode="contain"
					style={{ width: width * 0.8, height: width * 0.8 }}
					source={require('@/theme/assets/images/camera-error.png')}
				/>
				<Button type="primary" text="Go back" style={layout.w_80} onPress={() => navigation.goBack()} />
			</View>
		);

	const outer = rrect(rect(0, 0, width, height), 0, 0);
	const inner = rrect(rect(width * 0.1, height * 0.16, width * 0.8, width * 0.8), 20, 20);

	return (
		<View style={[components.screen, layout.justifyBetween, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
			<Camera style={[StyleSheet.absoluteFill]} device={device} codeScanner={codeScanner} isActive={isScanning} />
			<Canvas style={[StyleSheet.absoluteFill, layout.center]}>
				<DiffRect inner={inner} outer={outer} color="black" opacity={0.8} />
			</Canvas>
			<View style={[layout.center, { marginTop: width * 0.8 + height * 0.12 }]}>
				<Text style={[components.buttonText, fonts.size_16, fonts.white]}>
					{'WalletConnect or '}
					<AntDesign name="qrcode" size={20} color={colors.white} style={gutters.marginHorizontal_6} />
					{' QR Code'}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => navigation.navigate('walletconnectSessions')}
				style={[components.button, layout.w_90, borders.w_2, borders.white, borders.rounded_12, backgrounds.ui_03]}>
				<Text style={[components.buttonText, fonts.size_16, fonts.white]}>
					{activeSessions.length ? `${activeSessions.length} Active Sessions` : 'No Active WC Session'}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

export default Scan;
