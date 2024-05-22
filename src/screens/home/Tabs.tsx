import { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '@/theme';
import Tokens from './Tokens';
import NFTs from './NFTs';

const renderScene = SceneMap({
	first: Tokens,
	second: NFTs,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderTabBar(props: any) {
	const { backgrounds, colors, fonts } = useTheme();

	return (
		<TabBar
			{...props}
			activeColor={colors.icon_04}
			inactiveColor={colors.text_02}
			indicatorStyle={backgrounds.icon_04}
			labelStyle={[fonts.size_14, fonts.transformNone]}
			style={[styles.tabbar, { borderColor: colors.border_01 }]}
		/>
	);
}

function Tabs() {
	const { width } = useWindowDimensions();
	const { gutters, layout } = useTheme();

	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'first', title: 'Tokens' },
		{ key: 'second', title: 'NFTs' },
	]);

	return (
		<TabView
			swipeEnabled
			onIndexChange={setIndex}
			renderScene={renderScene}
			renderTabBar={RenderTabBar}
			initialLayout={{ width }}
			navigationState={{ index, routes }}
			pagerStyle={[layout.flex_1, layout.fullWidth]}
			sceneContainerStyle={[layout.flex_1, gutters.paddingTop_4]}
			style={[layout.flex_1, layout.w_90, gutters.paddingTop_16]}
		/>
	);
}

export default Tabs;

const styles = StyleSheet.create({
	tabbar: {
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 2,
		backgroundColor: 'transparent',
	},
});
