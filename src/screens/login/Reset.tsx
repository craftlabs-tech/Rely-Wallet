import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resetState, setInitialised } from '@/store/wallet';
import { resetAllKeychain } from '@/services/keychain';
import { ErrorLog, logger } from '@/services/logger';
import { useTheme } from '@/theme';
import { storage } from '@/store';
import { Button, Title } from '@/components/template';

function Reset() {
	const dispatch = useDispatch();
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { backgrounds, components, fonts, gutters, layout } = useTheme();

	const reset = () => {
		Alert.prompt('Reset Wallet', 'Type "RESET" to confirm', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Reset',
				onPress: value => {
					if (value === 'RESET') {
						resetAllKeychain()
							.then(() => {
								storage.clearAll();
								dispatch(resetState());
								dispatch(setInitialised(false));
								navigation.navigate('welcome');
							})
							.catch(error =>
								logger.error(new ErrorLog(`Failed to reset wallet: ${JSON.stringify(error)}`), { type: 'error' }),
							);
					} else {
						Toast.show({
							type: 'error',
							text1: 'Reset Wallet',
							text2: 'Type "RESET" to confirm',
							position: 'top',
							topOffset: insets.top || 16,
							text1Style: { fontFamily: 'Rubik-Medium' },
							text2Style: { fontFamily: 'Rubik-Medium' },
						});
					}
				},
			},
		]);
	};

	return (
		<View style={[components.screen, layout.justifyAround, gutters.paddingHorizontal_24]}>
			<Title
				title="Reset Wallet"
				subtitle="Resetting your password will delete all your wallet data. Please make sure you have a backup of your wallet before proceeding."
			/>
			<Button type="negative" text="Reset Wallet" onPress={reset} style={layout.w_70} />
		</View>
	);
}

export default Reset;
