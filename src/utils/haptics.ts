import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export type HapticFeedbackType =
	| 'impactLight'
	| 'impactMedium'
	| 'impactHeavy'
	| 'rigid'
	| 'soft'
	| 'notificationSuccess'
	| 'notificationWarning'
	| 'notificationError';

export const triggerHapticFeedback = (
	type: HapticFeedbackType,
	options: { ignoreAndroidSystemSettings: boolean } = { ignoreAndroidSystemSettings: false },
) => {
	ReactNativeHapticFeedback.trigger(type, { ignoreAndroidSystemSettings: options.ignoreAndroidSystemSettings });
};
