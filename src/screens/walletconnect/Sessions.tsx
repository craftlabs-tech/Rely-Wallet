import { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { getWalletClient } from '@/services/walletConnect';
import { ErrorLog, logger } from '@/services/logger';
import { getSdkError } from '@walletconnect/utils';
import { Title } from '@/components/template';
import { useTheme } from '@/theme';

import type { SessionTypes } from '@walletconnect/types';

function Sessions() {
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const { colors, backgrounds, borders, components, fonts, gutters, layout } = useTheme();

	const [loading, setLoading] = useState(false);
	const [activeSessions, setActiveSessions] = useState<SessionTypes.Struct[]>([]);

	const disconnectSession = async (session: SessionTypes.Struct) => {
		const client = await getWalletClient();
		const reason = getSdkError('USER_DISCONNECTED');
		await client.disconnectSession({ topic: session.topic, reason });
		getActiveSessions();
		Toast.show({
			type: 'success',
			text1: 'Session Disconnected',
			text2: `Session with ${new URL(session.peer.metadata.url).hostname} has been disconnected`,
			position: 'top',
			topOffset: insets.top || 16,
			text1Style: { fontFamily: 'Rubik-Medium' },
			text2Style: { fontFamily: 'Rubik-Medium' },
		});
	};

	const extendSession = async (session: SessionTypes.Struct) => {
		const client = await getWalletClient();
		await client.extendSession({ topic: session.topic });
		getActiveSessions();
		Toast.show({
			type: 'success',
			text1: 'Session Extended',
			text2: `Session with ${new URL(session.peer.metadata.url).hostname} has been extended`,
			position: 'top',
			topOffset: insets.top || 16,
			text1Style: { fontFamily: 'Rubik-Medium' },
			text2Style: { fontFamily: 'Rubik-Medium' },
		});
	};

	const disconnectAllSessions = async () => {
		setLoading(true);
		const client = await getWalletClient();
		await Promise.all(
			activeSessions.map(session => {
				return client
					.disconnectSession({ topic: session.topic, reason: getSdkError('USER_DISCONNECTED') })
					.then(() => setActiveSessions([]))
					.catch(error => logger.error(new ErrorLog(JSON.stringify(error)), { type: 'error' }));
			}),
		);
	};

	const getActiveSessions = () => {
		getWalletClient()
			.then(client => setActiveSessions(Object.values(client.getActiveSessions())))
			.catch(error => logger.error(new ErrorLog(JSON.stringify(error)), { type: 'error' }));
	};

	useEffect(() => {
		getActiveSessions();
	}, []);

	return (
		<View
			style={[
				components.screen,
				gutters.paddingTop_16,
				layout.justifyBetween,
				layout.fullWidth,
				layout.gap_12,
				layout.absolute,
				layout.bottom_0,
				{ paddingBottom: insets.bottom || 16 },
			]}>
			<Title title="Active WalletConnect Sessions" subtitle="" />

			{activeSessions.length ? (
				<>
					<FlatList
						data={activeSessions}
						keyExtractor={item => item.topic}
						renderItem={({ item }) => (
							<TouchableOpacity
								key={item.topic}
								onPress={() =>
									Alert.alert('WalletConnect Session', 'You can extend or disconnect the session', [
										{ text: 'Disconnect', onPress: () => disconnectSession(item), style: 'destructive' },
										{ text: 'Extend', onPress: () => extendSession(item) },
										{ text: 'Cancel', style: 'cancel' },
									])
								}
								onLongPress={() =>
									Alert.alert('WalletConnect Session', 'You can extend or disconnect the session', [
										{ text: 'Disconnect', onPress: () => disconnectSession(item), style: 'destructive' },
										{ text: 'Extend', onPress: () => extendSession(item) },
										{ text: 'Cancel', style: 'cancel' },
									])
								}
								style={[
									layout.flex_1,
									layout.fullWidth,
									layout.rowCenter,
									layout.justifyBetween,
									borders.border_02,
									gutters.padding_8,
									// eslint-disable-next-line react-native/no-inline-styles
									{ borderBottomWidth: 1 },
								]}>
								<View style={[[layout.row, layout.itemsCenter, layout.w_90, layout.overflowHidden]]}>
									<Image
										source={{ uri: item.peer.metadata.icons[0] }}
										// eslint-disable-next-line react-native/no-inline-styles
										style={[borders.rounded_4, { width: 36, height: 36 }]}
									/>
									<View style={[layout.justifyCenter, gutters.paddingLeft_12]}>
										<Text style={[components.buttonText, fonts.text_02, fonts.size_14, fonts.left]}>
											{item.peer.metadata.name.slice(0, 36)}
											{item.peer.metadata.name.length > 36 && '...'}
										</Text>
										<Text style={[components.buttonText, fonts.text_02, fonts.size_13, fonts.left]}>
											{item.peer.metadata.url}
										</Text>
									</View>
								</View>
								<Ionicons name="chevron-forward" size={20} color={colors.text_02} />
							</TouchableOpacity>
						)}
					/>
					<TouchableOpacity
						onPress={disconnectAllSessions}
						style={[components.button, backgrounds.negative_01, layout.w_70]}>
						{loading ? (
							<ActivityIndicator color={colors.white} />
						) : (
							<Text style={components.buttonText}>Disconnect All</Text>
						)}
					</TouchableOpacity>
				</>
			) : (
				<View style={[layout.fullWidth, layout.center]}>
					<Text style={[fonts.size_16, fonts.rubikRegular, fonts.text_02]}>No Active Sessions</Text>
					<Image
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						source={require('@/theme/assets/images/link.png')}
						style={{ width: width * 0.6, height: width * 0.6 }}
					/>
				</View>
			)}
		</View>
	);
}

export default Sessions;
