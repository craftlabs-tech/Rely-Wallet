import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';

function Send() {
	const navigation = useNavigation();
	const { backgrounds, components, fonts, gutters, layout } = useTheme();

	return (
		<View style={[components.screen, layout.justifyAround, gutters.paddingBottom_12]}>
			<Text style={[fonts.size_20, fonts.rubikBold, fonts.text_01]}>Send</Text>
			<Text style={[[fonts.center, fonts.rubikRegular, fonts.negative_01, gutters.paddingHorizontal_12]]}>
				Send token
			</Text>
			<TouchableOpacity
				onPress={() => navigation.navigate('scanAddress')}
				style={[components.button, backgrounds.negative_01, gutters.paddingHorizontal_48]}>
				<Text style={[components.buttonText]}>Send Wallet</Text>
			</TouchableOpacity>
		</View>
	);
}

export default Send;
