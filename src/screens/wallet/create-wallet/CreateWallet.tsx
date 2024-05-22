import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import {
	setEVMWallet,
	setMinaWallet,
	setSolanaWallet,
	setInitialised,
	setOnboarding,
	setCosmosWallet,
	setBitcoinWallet,
} from '@/store/wallet';
import { createWallet, generateMnemonic } from '@/services/wallet';
import { Button, Input, Title } from '@/components/template';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { setInKeychain } from '@/services/keychain';
import { encrypt, storage } from '@/services/mmkv';
import { useTheme } from '@/theme';

function CreateWallet() {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation(['welcome', 'common']);
	const { colors, components, gutters, layout } = useTheme();

	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const [validPassword, setValidPassword] = useState(false);

	useEffect(() => {
		setValidPassword(password.length >= 6 && password === confirmPassword);
	}, [password, confirmPassword]);

	const createWallets = useCallback(() => {
		setLoading(true);
		void runAfterUISync(async () => {
			const mnemonic = generateMnemonic();
			await setInKeychain('mnemonic', `${mnemonic}`);
			await setInKeychain('password', `${password}`);
			const [evm, solana, mina, cosmos, bitcoin] = await createWallet(mnemonic);

			encrypt(password);
			storage.set('password', password);
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
	}, [password]);

	return (
		<View style={[layout.justifyAround, layout.gap_12, components.screen]}>
			<Title style={[layout.flex_1, gutters.paddingHorizontal_12]} title="Create a Wallet" subtitle={t('import.tip')} />
			<View style={[layout.flex_1, layout.center, layout.fullWidth, layout.gap_12]}>
				<View style={[layout.center, layout.row]}>
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
				<View style={[layout.center, layout.row]}>
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
					text={t('wallet.create')}
					style={layout.w_80}
					onPress={createWallets}
					loading={loading}
					disabled={!validPassword}
				/>
			</View>
		</View>
	);
}

export default CreateWallet;
