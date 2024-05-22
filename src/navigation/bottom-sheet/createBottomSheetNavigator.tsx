import {
	EventArg,
	StackActions,
	StackRouterOptions,
	useNavigationBuilder,
	StackNavigationState,
	createNavigatorFactory,
	DefaultNavigatorOptions,
	NavigationHelpersContext,
} from '@react-navigation/native';
import { useEffect } from 'react';
import { RootStackParamList } from '@/navigation/types';
import BottomSheetNavigatorView from './views/BottomSheetNavigatorView';
import { router } from './router';

import type { BottomSheetNavigationConfig, BottomSheetNavigationEventMap, BottomSheetNavigationOptions } from './types';

type Props = DefaultNavigatorOptions<
	RootStackParamList,
	StackNavigationState<RootStackParamList>,
	BottomSheetNavigationOptions,
	BottomSheetNavigationEventMap
> &
	StackRouterOptions &
	BottomSheetNavigationConfig;

function BottomSheetNavigator({ initialRouteName, children, screenOptions, ...rest }: Props) {
	const { state, descriptors, navigation } = useNavigationBuilder<
		StackNavigationState<RootStackParamList>,
		StackRouterOptions,
		Record<string, () => void>,
		BottomSheetNavigationOptions,
		BottomSheetNavigationEventMap
	>(router, {
		children,
		initialRouteName,
		// @ts-expect-error doesn't like the typing of RootStackParamList
		screenOptions,
	});

	useEffect(
		() =>
			// @ts-expect-error we're missing this event handler in our custom
			// bottom-sheet types
			navigation.addListener?.('tabPress', e => {
				const isFocused = navigation.isFocused();

				// Run the operation in the next frame so we're sure all listeners have been run
				// This is necessary to know if preventDefault() has been called
				requestAnimationFrame(() => {
					if (state.index > 0 && isFocused && !(e as EventArg<'tabPress', true>).defaultPrevented) {
						// When user taps on already focused tab and we're inside the tab,
						// reset the stack to replicate native behaviour
						navigation.dispatch({
							...StackActions.popToTop(),
							target: state.key,
						});
					}
				});
			}),
		[navigation, state.index, state.key],
	);

	return (
		<NavigationHelpersContext.Provider value={navigation}>
			<BottomSheetNavigatorView {...rest} descriptors={descriptors} navigation={navigation} state={state} />
		</NavigationHelpersContext.Provider>
	);
}

export const createBottomSheetNavigator = createNavigatorFactory<
	StackNavigationState<RootStackParamList>,
	BottomSheetNavigationOptions,
	BottomSheetNavigationEventMap,
	typeof BottomSheetNavigator
>(BottomSheetNavigator);
