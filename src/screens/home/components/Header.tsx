import { Platform, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MenuView } from '@react-native-menu/menu';
import { EVMWallet, setTheme } from '@/store/wallet';
import { abbreviateAddress } from '@/utils/wallet';
import { Avatar } from '@/components/template';
import { useTheme } from '@/theme';

import type { RootState } from '@/store';

const IS_ANDROID = Platform.OS === 'android';

function Header() {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const colorScheme = useColorScheme();
	const { borders, backgrounds, colors, components, fonts, layout, gutters, ...theme } = useTheme();

	const activeTheme = useSelector((s: RootState) => s.wallet.theme);
	const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
	const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;

	const handleMenuPress = (event: string) => {
		const themeVariant = event === 'dark' ? 'dark' : 'default';
		if (event === 'system') {
			const systemTheme = colorScheme === 'dark' ? 'dark' : 'default';
			theme.changeTheme(systemTheme);
			dispatch(setTheme('system'));
		} else if (event === 'settings') {
			navigation.navigate('settings');
		} else {
			theme.changeTheme(themeVariant);
			dispatch(setTheme(themeVariant));
		}
	};

	const scan = () => {
		navigation.navigate('scan');
	};

	return (
		<View style={[layout.fullWidth, layout.rowCenter, layout.justifyBetween, IS_ANDROID && gutters.paddingTop_6]}>
			<View style={[layout.flex_1, layout.center]}>
				<MenuView
					title="Menu"
					shouldOpenOnLongPress={false}
					style={layout.z10}
					themeVariant={theme.variant === 'dark' ? 'dark' : 'light'}
					onPressAction={({ nativeEvent }) => handleMenuPress(nativeEvent.event)}
					actions={[
						{
							id: 'theme',
							title: 'Theme',
							titleColor: colors.black,
							imageColor: colors.icon_01,
							image: 'moon.stars.fill',
							subactions: [
								{
									id: 'dark',
									state: activeTheme === 'dark' ? 'on' : 'off',
									title: 'Dark Theme',
									titleColor: colors.black,
									imageColor: colors.icon_01,
									image: 'moon.stars.fill',
								},
								{
									id: 'light',
									state: activeTheme === 'default' ? 'on' : 'off',
									title: 'Light Theme',
									titleColor: colors.black,
									imageColor: colors.icon_01,
									image: 'sun.max.fill',
								},
								{
									id: 'system',
									state: activeTheme === 'system' ? 'on' : 'off',
									title: 'System Theme',
									titleColor: colors.black,
									imageColor: colors.icon_01,
									image: 'gear',
								},
							],
						},
						{
							id: 'settings',
							title: 'Settings',
							titleColor: colors.black,
							imageColor: colors.icon_01,
							image: 'gear',
						},
					]}>
					<TouchableOpacity>
						<MCIcons size={24} name="dots-horizontal" color={colors.text_01} style={[layout.opacity_75]} />
					</TouchableOpacity>
				</MenuView>
			</View>
			<TouchableOpacity
				style={[
					borders.w_1,
					layout.row,
					layout.flex_3,
					layout.justifyBetween,
					borders.rounded_48,
					gutters.padding_8,
					backgrounds.ui_01,
					{ borderColor: colors.ui_01 },
				]}>
				<View style={[layout.rowCenter]}>
					<Avatar address={evmWallet.address} />
					<View style={[layout.col, layout.justifyCenter, gutters.paddingLeft_12]}>
						<Text style={[fonts.size_14, fonts.rubikBold, fonts.icon_04]}>
							{evmWallet.ens ? evmWallet.ens.name : abbreviateAddress(evmWallet.address)}
						</Text>
						<Text style={[fonts.size_14, fonts.rubikMedium, fonts.text_02]}>{evmWallet.balance.toFixed(4)} ETH</Text>
					</View>
				</View>
				<View style={[layout.justifyCenter, layout.itemsCenter, gutters.paddingRight_8]}>
					<Ionicons name="chevron-down" size={24} color={colors.text_02} />
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={scan} style={[layout.flex_1, layout.justifyCenter, layout.itemsCenter]}>
				<Ionicons name="scan" size={24} color={colors.text_01} style={[layout.opacity_75]} />
			</TouchableOpacity>
		</View>
	);
}

export default Header;
