import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Canvas, DiffRect, rrect, rect } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ErrorLog, logger } from '@/services/logger';
import { Camera } from 'react-native-camera-kit';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/theme';
import {
	isWalletConnectURI,
	isWalletConnectURIV1,
	isWalletConnectURIV2,
	getWalletClient,
} from '@/services/walletConnect';

import type { SessionTypes } from '@walletconnect/types';

function Scan() {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { width, height } = useWindowDimensions();
	const { colors, backgrounds, borders, components, fonts, gutters, layout } = useTheme();

	const outer = rrect(rect(0, 0, width, height), 0, 0);
	const inner = rrect(rect(width * 0.1, height * 0.16, width * 0.8, width * 0.8), 20, 20);

	const [isScanning, setIsScanning] = useState(true);

	const [activeSessions, setActiveSessions] = useState<SessionTypes.Struct[]>([]);

	const onReadCode = (value: string) => {
		if (isWalletConnectURI(value) && isWalletConnectURIV1(value)) {
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
		if (isWalletConnectURI(value) && isWalletConnectURIV2(value) && isScanning) {
			setIsScanning(false);
			if (isWalletConnectURI(value) && isWalletConnectURIV1(value)) {
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
			if (isWalletConnectURI(value) && isWalletConnectURIV2(value)) {
				void pair(value);
			}
		}
	};

	const pair = async (uri: string) => {
		try {
			const client = await getWalletClient();
			void client.pair({ uri });
			navigation.goBack();
		} catch (error) {
			logger.error(new ErrorLog(`WalletConnect pairing failed ${JSON.stringify(error)}`), { type: 'error' });
		}
	};

	useEffect(() => {
		getWalletClient()
			.then(client => setActiveSessions(Object.values(client.getActiveSessions())))
			.catch(error => logger.error(new ErrorLog(JSON.stringify(error)), { type: 'error' }));
	}, []);

	return (
		<View
			style={[
				components.screen,
				layout.justifyBetween,
				{ paddingTop: insets.top, paddingBottom: insets.bottom || 16 },
			]}>
			<Camera
				scanBarcode
				showFrame={false}
				laserColor="red"
				frameColor="white"
				style={StyleSheet.absoluteFillObject}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
				onReadCode={(event: any) => onReadCode(event.nativeEvent.codeStringValue)}
			/>
			<Canvas style={[StyleSheet.absoluteFill, layout.center]}>
				<DiffRect inner={inner} outer={outer} color="black" opacity={0.8} />
			</Canvas>
			<View style={[layout.center, { marginTop: width * 0.8 + height * 0.18 }]}>
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
