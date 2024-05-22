import { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { validateMnemonic, validatePrivateKey } from '@/services/wallet';
import { Button, Title } from '@/components/template';
import { setInKeychain } from '@/services/keychain';
import { logger } from '@/services/logger';
import { useTheme } from '@/theme';

function ImportWallet() {
	const navigation = useNavigation();
	const { t } = useTranslation(['welcome', 'common']);
	const { colors, components, gutters, layout } = useTheme();

	const [loading, setLoading] = useState(false);
	const [credentials, setCredentials] = useState('');

	const validMnemonic = validateMnemonic(credentials.trimStart().trimEnd());
	const validPrivateKey = validatePrivateKey(credentials.trimStart().trimEnd());

	const isCredentialsValid = () => {
		if (validMnemonic || validPrivateKey) {
			return true;
		}
		return false;
	};

	const importCredentials = async () => {
		if (validMnemonic) {
			setLoading(true);
			const phrase = credentials.trimStart().trimEnd();
			await setInKeychain('mnemonic', phrase);
			setLoading(false);
			Keyboard.dismiss();
			navigation.navigate('setPassword', { mnemonic: phrase });
		}
		if (validPrivateKey) {
			logger.debug('TODO: Import using private key');
		}
	};

	return (
		<View style={[layout.justifyAround, layout.gap_12, components.screen]}>
			<Title
				style={[layout.flex_1, gutters.paddingHorizontal_12]}
				title="Import your Wallet"
				subtitle={t('import.description')}
			/>
			<View style={[layout.flex_1, layout.center, layout.fullWidth]}>
				<View style={[layout.rowCenter, gutters.paddingVertical_8]}>
					<BottomSheetTextInput
						multiline
						autoFocus
						autoCorrect={false}
						numberOfLines={4}
						value={credentials}
						keyboardType="default"
						style={components.textArea}
						placeholder={t('common:seedPhrase')}
						placeholderTextColor={colors.text_02}
						onChangeText={text => setCredentials(text)}
					/>
				</View>
			</View>
			<View style={[layout.flex_1, layout.center, layout.fullWidth]}>
				<Button
					type="primary"
					loading={loading}
					style={layout.w_80}
					text={t('wallet.import')}
					onPress={importCredentials}
					disabled={!isCredentialsValid()}
				/>
			</View>
		</View>
	);
}

export default ImportWallet;
