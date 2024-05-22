import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/theme';

function KeyboardAvoidingViewTemplate({ children }: { children: React.ReactNode }) {
	const { layout } = useTheme();

	return (
		<TouchableWithoutFeedback style={[layout.flex_1, layout.center]} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={[layout.flex_1, layout.center]}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				{children}
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

export default KeyboardAvoidingViewTemplate;
