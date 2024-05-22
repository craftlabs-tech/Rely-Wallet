/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useMemo, useRef } from 'react';
import { NavigationHelpersContext, StackActions, StackNavigationState } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { useForceUpdate } from '@/hooks';
import BottomSheetRoute from './BottomSheetRoute';

import type { BottomSheetDescriptorMap, BottomSheetNavigationConfig, BottomSheetNavigationHelpers } from '../types';

type Props = BottomSheetNavigationConfig & {
	state: StackNavigationState<RootStackParamList>;
	navigation: BottomSheetNavigationHelpers;
	descriptors: BottomSheetDescriptorMap;
};

function BottomSheetNavigatorView({ descriptors, state, navigation }: Props) {
	// #region hooks
	const forceUpdate = useForceUpdate();
	// #endregion

	// #region variables
	const descriptorsCache = useRef<BottomSheetDescriptorMap>({});
	const [firstKey, ...restKeys] = useMemo(() => state.routes.map(route => route.key), [state.routes]);

	/**
	 * we cache all presented routes descriptor
	 */
	restKeys.forEach(key => {
		descriptorsCache.current[key] = descriptors[key];
	});

	/**
	 * we flag removed routes in our cache
	 */
	Object.keys(descriptorsCache.current)
		.filter(key => !restKeys.includes(key))
		.forEach(key => {
			descriptorsCache.current[key].removing = true;
		});
	// #endregion

	// #region callbacks
	const handleOnDismiss = useCallback((key: string, removed: boolean) => {
		delete descriptorsCache.current[key];

		/**
		 * if sheet was dismissed by navigation state, we only force re-render the view.
		 * but if it was dismissed by user interaction, we dispatch pop action to navigation state.
		 */
		if (removed) {
			forceUpdate();
		} else {
			navigation?.dispatch?.({
				...StackActions.pop(),
				source: key,
				target: state.key,
			});
		}
	}, []);

	// #endregion
	return (
		<NavigationHelpersContext.Provider value={navigation}>
			{descriptors[firstKey].render()}

			{Object.keys(descriptorsCache.current).map(key => (
				<BottomSheetRoute
					key={key}
					routeKey={key}
					onDismiss={handleOnDismiss}
					descriptor={descriptorsCache.current[key]}
					removing={descriptorsCache.current[key].removing}
				/>
			))}
		</NavigationHelpersContext.Provider>
	);
}

export default BottomSheetNavigatorView;
