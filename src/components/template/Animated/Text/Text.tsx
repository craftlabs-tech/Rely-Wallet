/* eslint-disable react/require-default-props */
import { useEffect, useState, useRef } from 'react';
import { Text, View } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { useTheme } from '@/theme';

type Props = {
	text: string;
	typingSpeed?: number;
	cursorVisible?: boolean;
	color?: string;
	opacity?: number;
	onComplete?: () => void;
};

function AnimatedText({ text, color, typingSpeed = 50, cursorVisible = false, opacity = 0.8, onComplete }: Props) {
	const { colors, fonts } = useTheme();

	const effectiveColor = color || colors.text_01;

	const indexRef = useRef(0);
	const displayTextRef = useRef('');

	const [isCursorVisible, setIsCursorVisible] = useState(true);
	const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
	const cursorTimerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		typingTimerRef.current = setInterval(() => {
			if (indexRef.current < text.length) {
				displayTextRef.current += text.charAt(indexRef.current);
				trigger('soft', { ignoreAndroidSystemSettings: false });
				indexRef.current += 1;
			} else {
				clearInterval(typingTimerRef.current as NodeJS.Timeout);
			}
		}, typingSpeed);

		cursorTimerRef.current = setInterval(() => {
			setIsCursorVisible(prev => !prev);
		}, 500);

		return () => {
			if (typingTimerRef.current) clearInterval(typingTimerRef.current);
			if (cursorTimerRef.current) clearInterval(cursorTimerRef.current);
		};
	}, [text, typingSpeed, onComplete]);

	return (
		<View>
			<Text style={[fonts.rubikBold, fonts.size_20, { color: effectiveColor, opacity }]}>
				{`${displayTextRef.current} `}
				{isCursorVisible && cursorVisible && <Text style={[fonts.bold]}>|</Text>}
			</Text>
		</View>
	);
}

export default AnimatedText;
