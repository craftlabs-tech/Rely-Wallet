import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
	setBitcoinWallet,
	setCosmosWallet,
	setEVMWallet,
	setInitialised,
	setMinaWallet,
	setOnboarding,
	setSolanaWallet,
} from '@/store/wallet';
import { Button, Input, Title } from '@/components/template';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { setInKeychain } from '@/services/keychain';
import { encrypt, storage } from '@/services/mmkv';
import { createWallet } from '@/services/wallet';
import { useTheme } from '@/theme';

import type { RootStackParamList } from '@/navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

function SetPassword() {
	const route = useRoute<StackScreenProps<RootStackParamList, 'setPassword'>['route']>();
	const { mnemonic } = route.params;
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation(['welcome', 'common']);
	const { colors, components, gutters, layout } = useTheme();

	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const validPassword = password.length >= 6 && password === confirmPassword;

	const encryptWallet = () => {
		setLoading(true);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		runAfterUISync(async () => {
			encrypt(password);
			storage.set('password', password);
			await setInKeychain('password', `${password}`);
			const [evm, solana, mina, cosmos, bitcoin] = await createWallet(mnemonic);
			dispatch(
				setEVMWallet({
					balance: 0,
					address: evm.address,
					nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
				}),
			);
			dispatch(
				setSolanaWallet({
					balance: 0,
					address: solana.publicKey,
					publicKey: solana.publicKey,
					nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
				}),
			);
			dispatch(
				setMinaWallet({
					balance: 0,
					address: mina.publicKey,
					publicKey: mina.publicKey,
					nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
				}),
			);
			dispatch(
				setCosmosWallet({
					balance: 0,
					address: cosmos.accounts[0].address,
					publicKey: cosmos.accounts[0].address,
					nativeCurrency: { name: 'ATOM', symbol: 'ATOM', decimals: 9 },
				}),
			);
			dispatch(
				setBitcoinWallet({
					balance: 0,
					address: bitcoin.address,
					publicKey: bitcoin.address,
					nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
				}),
			);
			dispatch(setInitialised(true));
			dispatch(setOnboarding(true));
			setLoading(false);
			navigation.navigate('auth');
		});
	};

	return (
		<View style={[layout.justifyAround, layout.gap_12, components.screen]}>
			<Title style={layout.flex_1} title="Set Password" subtitle="Set a password to secure your wallet" />
			<View style={[layout.flex_1, layout.center, layout.fullWidth]}>
				<View style={[layout.rowCenter, gutters.paddingVertical_8]}>
					<Input
						autoFocus
						bottomSheet
						value={password}
						style={layout.w_80}
						keyboardType="number-pad"
						placeholder={t('common:password')}
						onChangeText={setPassword}
					/>
					<View style={[layout.absolute, layout.right_0]}>
						<TouchableOpacity
							style={[layout.flex_1, layout.center, gutters.paddingRight_12]}
							onPress={() => setPasswordVisible(!passwordVisible)}>
							<Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} color={colors.text_01} size={20} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={[layout.rowCenter, gutters.paddingVertical_8]}>
					<Input
						bottomSheet
						value={confirmPassword}
						style={layout.w_80}
						keyboardType="number-pad"
						placeholder={t('common:password')}
						onChangeText={setConfirmPassword}
					/>
					<View style={[layout.absolute, layout.right_0]}>
						<TouchableOpacity
							style={[layout.flex_1, layout.center, gutters.paddingRight_12]}
							onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
							<Ionicons
								name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
								color={colors.text_01}
								size={20}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={[layout.flex_1, layout.center, layout.fullWidth]}>
				<Button
					type="primary"
					text="Set Password"
					style={layout.w_80}
					onPress={encryptWallet}
					loading={loading}
					disabled={!validPassword}
				/>
			</View>
		</View>
	);
}

export default SetPassword;
