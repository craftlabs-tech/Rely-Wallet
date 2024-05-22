/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-native/no-inline-styles */
import { useEffect } from 'react';
import { Animated, BackHandler, View, TouchableOpacity, TextInput, Platform, Text } from 'react-native';
import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import { Example, Home } from '@/screens';
import { alpha } from '@/utils/theme';
import { useTheme } from '@/theme';

const Tab = createMaterialTopTabNavigator();

export function TabNavigator() {
	const { variant } = useTheme();
	const navigation = useNavigation();

	const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

	useEffect(() => {
		navigation.addListener('beforeRemove', (e: any) => {
			e.preventDefault();
		});

		return () => {
			backHandler.remove();
		};
	}, [backHandler, navigation]);

	return (
		<Tab.Navigator
			key={variant}
			initialRouteName="home"
			backBehavior="history"
			tabBarPosition="bottom"
			tabBar={TabBar}
			screenOptions={{
				swipeEnabled: true,
				animationEnabled: true,
			}}>
			<Tab.Screen name="home" component={Home} options={{ tabBarLabel: 'Wallet' }} />
			<Tab.Screen name="explore" component={Example} options={{ tabBarLabel: 'Explore' }} />
			<Tab.Screen name="activity" component={Home} options={{ tabBarLabel: 'Activity' }} />
		</Tab.Navigator>
	);
}

function TabBar({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
	const insets = useSafeAreaInsets();
	const { borders, colors, components, gutters, fonts, layout, variant } = useTheme();

	return (
		<View
			style={[
				layout.absolute,
				borders.w_1,
				Platform.select({
					ios: {
						left: !insets.bottom ? 0 : 8,
						right: !insets.bottom ? 0 : 8,
						bottom: insets.bottom * 0.64,
						borderBottomStartRadius: !insets.bottom ? 0 : 36,
						borderBottomEndRadius: !insets.bottom ? 0 : 36,
						borderTopStartRadius: 24,
						borderTopEndRadius: 24,
					},
					android: { left: 0, right: 0, bottom: 0, borderTopStartRadius: 16, borderTopEndRadius: 16 },
				}),
				{
					borderColor: colors.ui_01,
					backgroundColor: variant === 'dark' ? alpha(colors.black, 0.1) : colors.ui_background,
					shadowOffset: { width: 0, height: 0 },
					shadowColor: colors.shadow_01,
					shadowOpacity: 1,
					shadowRadius: 12,
					elevation: 12,
				},
			]}>
			<View style={[layout.justifyCenter, gutters.paddingHorizontal_10, gutters.paddingTop_10]}>
				<Ionicons
					size={26}
					name="search"
					color={colors.text_02}
					style={[layout.absolute, layout.z1, { left: 16, top: 19 }]}
				/>
				<TextInput
					editable={false}
					onPress={() =>
						Toast.show({
							type: 'info',
							text1: 'Coming Soon',
							text2: 'This feature is currently under development',
							position: 'top',
							topOffset: insets.top || 16,
						})
					}
					style={components.searchBar}
					placeholderTextColor={colors.text_02}
					placeholder="Search for tokens, dapps, and more"
				/>
				<View
					style={[
						layout.z1,
						layout.absolute,
						layout.center,
						borders.rounded_10,
						{ right: 18, top: 18, height: 28, width: 28, borderWidth: 2, borderColor: colors.text_02 },
					]}>
					<Text style={[fonts.rubikMedium, fonts.text_02, fonts.size_12]}>24</Text>
				</View>
			</View>
			<View style={layout.row}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];

					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: 'tabLongPress',
							target: route.key,
						});
					};

					const inputRange = state.routes.map((_, i) => i);
					const opacity = position.interpolate({
						inputRange,
						outputRange: inputRange.map(i => (i === index ? 1 : 0.4)),
					});

					const renderIcon = (name: string) => {
						switch (name) {
							case 'home':
								return <Entypo name="wallet" size={26} color={colors.text_01} />;
							case 'explore':
								return <Ionicons name="layers" size={26} color={colors.text_01} />;
							case 'activity':
								return <Ionicons name="file-tray-full" size={26} color={colors.text_01} />;
							default:
								return null;
						}
					};

					return (
						<TouchableOpacity
							key={route.key}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							style={[layout.flex_1, layout.itemsCenter, gutters.paddingVertical_16]}
							onPress={onPress}
							onLongPress={onLongPress}>
							<Animated.Text style={{ opacity }}>{renderIcon(route.name)}</Animated.Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}
