import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/template';
import { useTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Actions() {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const { borders, colors, fonts, gutters, layout } = useTheme();

	const send = () => {
		navigation.navigate('send');
	};

	const receive = () => {
		navigation.navigate('receive');
	};

	const swap = () => {
		Toast.show({
			type: 'info',
			text1: 'Coming Soon',
			text2: 'This feature is currently under development',
			position: 'top',
			topOffset: insets.top || 16,
		});
	};

	const bridge = () => {
		Toast.show({
			type: 'info',
			text1: 'Coming Soon',
			text2: 'This feature is currently under development',
			position: 'top',
			topOffset: insets.top || 16,
		});
	};

	return (
		<View style={[layout.flex_1, layout.row, layout.gap_8, gutters.paddingHorizontal_16]}>
			<Button type="primary" onPress={send} style={layout.flex_1}>
				<FontAwesome name="send" size={22} color={colors.icon_04} style={[layout.center]} />
			</Button>
			<Button type="primary" onPress={receive} style={layout.flex_1}>
				<Ionicons name="qr-code" size={22} color={colors.icon_04} style={[layout.center]} />
			</Button>
			<Button type="primary" onPress={bridge} style={layout.flex_1}>
				<Ionicons name="layers" size={22} color={colors.icon_04} style={[layout.center]} />
			</Button>
			<Button
				type="primary"
				onPress={swap}
				style={{
					...layout.flex_3,
					...layout.center,
					...layout.gap_8,
					...borders.w_1,
					borderColor: colors.ui_01,
					backgroundColor: colors.surface,
				}}>
				<AntDesign name="retweet" size={22} color={colors.text_06} style={[layout.center]} />
				<Text style={[fonts.size_16, fonts.rubikMedium, fonts.text_06]}>Swap</Text>
			</Button>
		</View>
	);
}

export default Actions;
