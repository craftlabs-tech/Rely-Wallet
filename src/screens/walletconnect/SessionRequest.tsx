/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { triggerHapticFeedback } from '@/utils/haptics';
import { abbreviateAddress } from '@/utils/wallet';
import { Avatar } from '@/components/template';
import { useTheme } from '@/theme';

import type { RootState } from '@/store';
import type { EVMWallet } from '@/store/wallet';
import type { RootStackParamList } from '@/navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

function SessionRequest() {
	const route = useRoute<StackScreenProps<RootStackParamList, 'sessionRequest'>['route']>();
	const { message, request, request_method, onApprove, onReject } = route.params;

	const insets = useSafeAreaInsets();
	const { height } = useWindowDimensions();
	const { colors, components, backgrounds, borders, fonts, layout, gutters } = useTheme();

	const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
	const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;

	const [loading, setLoading] = useState(false);

	const approve = () => {
		setLoading(true);
		onApprove();
	};

	useEffect(() => {
		triggerHapticFeedback('impactHeavy');
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
			<Text style={[components.buttonText, fonts.text_01, fonts.w_600, fonts.size_18]}>Sign message to continue</Text>
			<View style={[layout.center, layout.gap_12]}>
				<View style={[layout.rowCenter, layout.gap_4]}>
					{request.verifyContext.verified.validation === 'VALID' && !request.verifyContext.verified.isScam ? (
						<MaterialIcons name="verified" size={16} color={colors.icon_04} />
					) : (
						<Feather name="link" size={16} color={colors.text_02} />
					)}
					<Text style={[components.buttonText, fonts.text_02]}>
						{new URL(request.verifyContext.verified.origin).host}
					</Text>
				</View>
			</View>

			{request.verifyContext.verified.isScam && (
				<View
					style={[
						layout.w_90,
						layout.itemsStart,
						layout.justifyStart,
						layout.gap_6,
						borders.w_1,
						borders.border_02,
						borders.rounded_12,
						gutters.padding_12,
						backgrounds.negative_01,
					]}>
					<View style={[layout.rowCenter, layout.gap_12, layout.justifyCenter, gutters.paddingHorizontal_16]}>
						<Ionicons name="information-circle" size={24} color={colors.white} />
						<Text style={[components.buttonText, fonts.size_14, fonts.w_500]}>
							This domain is flagged as unsafe by multiple security providers. {'\n'} Proceed with caution.
						</Text>
					</View>
				</View>
			)}

			{request.verifyContext.verified.validation === 'INVALID' && (
				<View
					style={[
						layout.w_90,
						layout.itemsStart,
						layout.justifyStart,
						layout.gap_6,
						borders.w_1,
						borders.border_02,
						borders.rounded_12,
						gutters.padding_12,
						backgrounds.ui_01,
					]}>
					<View style={[layout.rowCenter, layout.gap_12, layout.justifyCenter, gutters.padding_10]}>
						<Ionicons name="information-circle" size={24} color={colors.text_02} />
						<Text style={[components.buttonText, fonts.size_14, fonts.w_500, fonts.text_01]}>
							This website has a domain that does not match the sender of this request.
						</Text>
					</View>
				</View>
			)}

			<View
				style={[
					layout.w_90,
					layout.itemsStart,
					layout.justifyStart,
					layout.gap_6,
					borders.w_1,
					borders.border_02,
					borders.rounded_12,
					gutters.padding_12,
					backgrounds.ui_01,
				]}>
				<Text style={[components.buttonText, fonts.text_01, gutters.paddingBottom_6]}>Sign message to continue</Text>
				<View style={[layout.flex_1, { maxHeight: height / 2.4 }]}>
					<ScrollView contentContainerStyle={layout.center} style={layout.flexGrow_0}>
						<Text
							style={[
								components.buttonText,
								fonts.size_13,
								fonts.w_500,
								fonts.text_02,
								request_method === 'personal_sign' ? fonts.center : fonts.left,
							]}>
							{message}
						</Text>
					</ScrollView>
				</View>
			</View>

			<View
				style={[
					layout.w_90,
					layout.itemsStart,
					layout.justifyStart,
					borders.w_1,
					borders.border_02,
					borders.rounded_12,
					gutters.padding_12,
					backgrounds.ui_01,
				]}>
				<Text style={[components.buttonText, gutters.paddingBottom_6, fonts.text_01]}>With wallet: </Text>
				<View style={[layout.row, layout.center]}>
					<View style={[layout.rowCenter, layout.flex_1, layout.gap_6]}>
						<Avatar address={evmWallet.address} />
						<Text style={[components.buttonText, fonts.size_16, fonts.text_01]}>
							{abbreviateAddress(evmWallet.address)}
						</Text>
					</View>
				</View>
			</View>

			<View style={[layout.w_90, layout.rowCenter, layout.justifyAround, layout.gap_10]}>
				<TouchableOpacity style={[components.button, layout.flex_1, backgrounds.negative_01]} onPress={onReject}>
					<Text style={[components.buttonText, fonts.white]}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[components.button, layout.flex_1, backgrounds.positive_01]} onPress={approve}>
					{loading ? (
						<ActivityIndicator size="small" color={colors.white} />
					) : (
						<Text style={[components.buttonText, fonts.white]}>Sign</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default SessionRequest;
