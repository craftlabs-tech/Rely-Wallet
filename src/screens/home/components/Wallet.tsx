import { Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { abbreviateAddress } from '@/utils/wallet';
import { Avatar } from '@/components/template';
import { alpha } from '@/utils/theme';
import { useTheme } from '@/theme';

import type { RootStackParamList } from '@/navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

function Wallet() {
	const route = useRoute<StackScreenProps<RootStackParamList, 'wallet'>['route']>();
	const { wallet } = route.params;
	const insets = useSafeAreaInsets();
	const { backgrounds, borders, colors, fonts, gutters, layout } = useTheme();

	return (
		<View style={[layout.flex_1, layout.itemsCenter, gutters.padding_12, { paddingBottom: insets.bottom }]}>
			<View
				style={[
					layout.fullWidth,
					backgrounds.ui_01,
					borders.rounded_8,
					borders.w_1,
					{ borderColor: colors.border_02 },
				]}>
				<View style={[layout.fullWidth, layout.rowCenter, layout.justifyBetween, gutters.padding_12]}>
					<View style={[layout.row, layout.center]}>
						<Avatar address={wallet.address} />
						<View style={[layout.center, layout.itemsStart, gutters.paddingHorizontal_12, layout.gap_4]}>
							<Text style={[fonts.text_04, fonts.rubikMedium, layout.opacity_75]}>
								{abbreviateAddress(wallet.address)}
							</Text>
							<Text style={[fonts.text_02, fonts.rubikMedium]}>
								{wallet.balance} {wallet.nativeCurrency.symbol}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={[
						layout.rowCenter,
						// eslint-disable-next-line react-native/no-inline-styles
						{
							height: 40,
							borderBottomLeftRadius: 8,
							borderBottomRightRadius: 8,
							backgroundColor: alpha(colors.black, 0.2),
						},
					]}>
					<TouchableOpacity style={[layout.flex_1, layout.rowCenter, layout.center, layout.gap_16, layout.opacity_80]}>
						<FontAwesome name="send" size={22} color={colors.icon_01} style={[layout.center]} />
						<Text style={[fonts.rubikRegular, fonts.text_01]}>Send</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							layout.flex_1,
							layout.row,
							layout.center,
							layout.gap_16,
							layout.opacity_80,
							// eslint-disable-next-line react-native/no-inline-styles
							{ borderLeftWidth: 1 },
						]}>
						<Ionicons name="qr-code" size={22} color={colors.icon_01} style={[layout.center]} />
						<Text style={[fonts.rubikRegular, fonts.text_01]}>Receive</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default Wallet;
