import { useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

function BottomSheetBackground() {
	// #region hooks
	const { close } = useBottomSheet();
	// #endregion

	// #region callbacks
	const handleOnPress = useCallback(() => {
		close();
	}, [close]);
	// #endregion

	return (
		<TouchableWithoutFeedback onPress={handleOnPress} style={styles.container}>
			<View style={styles.container} />
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
	},
});

export default BottomSheetBackground;
