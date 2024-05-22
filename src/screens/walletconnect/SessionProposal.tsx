import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { triggerHapticFeedback } from '@/utils/haptics';
import { abbreviateAddress } from '@/utils/wallet';
import { useRoute } from '@react-navigation/native';
import { Avatar } from '@/components/template';
import { useTheme } from '@/theme';

import type { RootState } from '@/store';
import type { EVMWallet } from '@/store/wallet';
import type { RootStackParamList } from '@/navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

function SessionProposal() {
	const route = useRoute<StackScreenProps<RootStackParamList, 'sessionProposal'>['route']>();
	const { proposal, onApprove, onReject } = route.params;

	const insets = useSafeAreaInsets();
	const { colors, components, backgrounds, borders, fonts, layout, gutters } = useTheme();

	const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
	const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;

	const [approving, setApproving] = useState(false);
	const [rejecting, setRejecting] = useState(false);

	const approve = () => {
		setApproving(true);
		onApprove();
	};

	const reject = () => {
		setRejecting(true);
		onReject();
	};

	const switchWallet = () => {};

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
			<Text style={[components.buttonText, fonts.text_01, fonts.w_600, fonts.size_18]}>Connect Wallet</Text>
			<View style={[layout.center, layout.gap_12]}>
				{proposal.params.proposer.metadata.icons.length > 0 && (
					<Image
						source={{ uri: proposal.params.proposer.metadata.icons[0] }}
						// eslint-disable-next-line react-native/no-inline-styles
						style={[borders.rounded_12, { width: 64, height: 64 }]}
					/>
				)}
				<Text style={[components.buttonText, fonts.text_01, fonts.size_16]}>
					{proposal.params.proposer.metadata.name}
				</Text>
				<View style={[layout.rowCenter, layout.gap_4]}>
					{proposal.verifyContext.verified.validation === 'VALID' && !proposal.verifyContext.verified.isScam ? (
						<MaterialIcons name="verified" size={16} color={colors.icon_04} />
					) : (
						<Feather name="link" size={16} color={colors.text_02} />
					)}
					<Text style={[components.buttonText, fonts.text_02]}>
						{new URL(proposal.params.proposer.metadata.url).host}
					</Text>
				</View>
			</View>

			{proposal.verifyContext.verified.isScam && (
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

			{proposal.verifyContext.verified.validation === 'INVALID' && (
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
				<Text style={[components.buttonText, fonts.text_01, gutters.paddingBottom_6]}>
					Allow {new URL(proposal.params.proposer.metadata.url).host} to:
				</Text>
				<View style={[layout.rowCenter, layout.gap_4]}>
					<Ionicons name="checkmark-circle-outline" size={24} color={colors.positive_01} />
					<Text style={[components.buttonText, fonts.size_13, fonts.w_500, fonts.text_02]}>
						View your balance and activity
					</Text>
				</View>
				<View style={[layout.rowCenter, layout.gap_4]}>
					<Ionicons name="checkmark-circle-outline" size={24} color={colors.positive_01} />
					<Text style={[components.buttonText, fonts.size_13, fonts.w_500, fonts.text_02]}>
						Send requests for approval
					</Text>
				</View>
				<View style={[layout.rowCenter, layout.gap_4]}>
					<Ionicons name="close-circle-outline" size={24} color={colors.negative_01} />
					<Text style={[components.buttonText, fonts.size_13, fonts.w_500, fonts.text_02]}>
						Sign transaction without your approval
					</Text>
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
					<TouchableOpacity
						onPress={switchWallet}
						style={[
							layout.center,
							gutters.paddingHorizontal_12,
							gutters.paddingVertical_6,
							borders.rounded_16,
							borders.w_1,
							borders.border_02,
							backgrounds.ui_03,
						]}>
						<Text style={[components.buttonText, fonts.white, fonts.w_500, fonts.size_13]}>Change</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={[layout.w_90, layout.rowCenter, layout.justifyAround, layout.gap_10]}>
				<TouchableOpacity style={[components.button, layout.flex_1, backgrounds.negative_01]} onPress={reject}>
					{rejecting ? (
						<ActivityIndicator color={colors.white} />
					) : (
						<Text style={[components.buttonText, fonts.white]}>Cancel</Text>
					)}
				</TouchableOpacity>
				<TouchableOpacity style={[components.button, layout.flex_1, backgrounds.positive_01]} onPress={approve}>
					{approving ? (
						<ActivityIndicator color={colors.white} />
					) : (
						<Text style={[components.buttonText, fonts.white]}>Connect</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default SessionProposal;
