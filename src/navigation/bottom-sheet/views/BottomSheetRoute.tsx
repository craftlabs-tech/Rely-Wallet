/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard, Platform, View, ViewStyle } from 'react-native';
import { ReduceMotion, WithSpringConfig } from 'react-native-reanimated';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import { isKeyboardOpen } from '@/utils';
import { BottomSheetNavigatorContext } from '../contexts/internal';
import { CONTAINER_HEIGHT, DEFAULT_BACKDROP_COLOR, DEFAULT_BACKDROP_OPACITY, DEFAULT_HEIGHT } from '../constants';

import type { BottomSheetDescriptor } from '../types';

const IS_ANDROID = Platform.OS === 'android';

interface Props {
	routeKey: string;
	descriptor: BottomSheetDescriptor;
	removing?: boolean;
	onDismiss: (key: string, removed: boolean) => void;
}

function BottomSheetRoute({
	routeKey,
	descriptor: { options, render, navigation },
	onDismiss,
	removing = false,
}: Props) {
	// #region extract options

	const {
		enableContentPanningGesture,
		enableHandlePanningGesture,
		index = 0,
		snapPoints = ['100%'],
		backdropColor = DEFAULT_BACKDROP_COLOR,
		backdropOpacity = DEFAULT_BACKDROP_OPACITY,
		backdropComponent = null,
		backdropPressBehavior = 'close',
		height = DEFAULT_HEIGHT,
		offsetY = IS_ANDROID ? 20 : 3,
		animationConfig,
	} = options || {};
	// #endregion

	// #region refs
	const ref = useRef<BottomSheet>(null);

	const removingRef = useRef(false);
	removingRef.current = removing;

	// const
	// #endregion

	// #region styles
	const screenContainerStyle: ViewStyle = useMemo(
		() => ({
			bottom: 0,
			height,
			position: 'absolute',
			width: '100%',
		}),
		[height],
	);

	const backdropStyle = useMemo(
		() => ({
			backgroundColor: backdropColor,
		}),
		[backdropColor],
	);
	// #endregion

	// #region context methods
	const handleSettingSnapPoints = useCallback(
		(_snapPoints: (string | number)[]) => {
			navigation.setOptions({ snapPoints: _snapPoints });
		},

		[],
	);

	const handleSettingEnableContentPanningGesture = useCallback(
		(value: boolean) => {
			navigation.setOptions({ enableContentPanningGesture: value });
		},

		[],
	);

	const handleSettingEnableHandlePanningGesture = useCallback(
		(value: boolean) => {
			navigation.setOptions({ enableHandlePanningGesture: value });
		},

		[],
	);

	const contextVariables = useMemo(
		() => ({
			setEnableContentPanningGesture: handleSettingEnableContentPanningGesture,
			setEnableHandlePanningGesture: handleSettingEnableHandlePanningGesture,
			setSnapPoints: handleSettingSnapPoints,
		}),
		[handleSettingEnableContentPanningGesture, handleSettingEnableHandlePanningGesture, handleSettingSnapPoints],
	);
	// #endregion

	// #region callbacks
	const handleOnClose = useCallback(() => {
		onDismiss(routeKey, removingRef.current);
	}, []);
	// #endregion

	// #region effects
	useEffect(() => {
		if (removing === true && ref.current) {
			// close keyboard before closing the modal
			if (isKeyboardOpen() && IS_ANDROID) {
				Keyboard.dismiss();

				ref.current.close();
			} else {
				ref.current.close();
			}
		}
	}, [removing]);
	// #endregion

	// #region renders
	const renderBackdropComponent = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={backdropOpacity}
				style={backdropStyle}
				pressBehavior={backdropPressBehavior}
				{...props}
			/>
		),
		[backdropOpacity, backdropStyle],
	);

	const animationConfigs = useBottomSheetSpringConfigs({
		mass: 1,
		damping: 30,
		stiffness: 360,
		restSpeedThreshold: 1,
		restDisplacementThreshold: 1,
		overshootClamping: false,
		reduceMotion: ReduceMotion.System,
		...(animationConfig as WithSpringConfig),
	});

	return (
		<BottomSheetNavigatorContext.Provider value={contextVariables}>
			<BottomSheet
				animateOnMount
				activeOffsetY={[-offsetY, offsetY]}
				animationConfigs={animationConfigs}
				backdropComponent={backdropComponent || renderBackdropComponent}
				backgroundComponent={null}
				containerHeight={CONTAINER_HEIGHT}
				enableContentPanningGesture={enableContentPanningGesture}
				enableHandlePanningGesture={enableHandlePanningGesture}
				enablePanDownToClose
				handleComponent={null}
				keyboardBehavior="interactive"
				android_keyboardInputMode="adjustResize"
				index={index}
				onClose={handleOnClose}
				ref={ref}
				simultaneousHandlers={[]}
				snapPoints={snapPoints}
				waitFor={[]}>
				<View style={screenContainerStyle}>{render()}</View>
			</BottomSheet>
		</BottomSheetNavigatorContext.Provider>
	);
}

export default BottomSheetRoute;
