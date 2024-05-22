/* eslint-disable no-nested-ternary */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomSheetNavigator } from '@/navigation/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { LinkingOptions, NavigationContainer, NavigationState } from '@react-navigation/native';
import { sentryRoutingInstrumentation } from '@/services/logger/sentry';
import { navigationRef } from '@/navigation/navigationRef';
import { TabNavigator } from '@/navigation/TabNavigator';
import { logger } from '@/services/logger';
import { RootState } from '@/store';
import { useTheme } from '@/theme';
import {
	Onboarding,
	Welcome,
	CreateWallet,
	ImportWallet,
	SetPassword,
	Login,
	Reset,
	Scan,
	Sessions,
	SessionProposal,
	Receive,
	SessionRequest,
	Send,
	ScanAddress,
	Wallet,
} from '@/screens';

const Stack = createNativeStackNavigator();
const BSStack = createBottomSheetNavigator();

function BSNavigator() {
	const insets = useSafeAreaInsets();
	const { height } = useWindowDimensions();

	const topOffset = Platform.OS === 'ios' ? insets.top : insets.top + 16;

	// eslint-disable-next-line react/no-unstable-nested-components
	function Backdrop() {
		const { variant } = useTheme();
		return (
			<BlurView
				blurAmount={1}
				blurType={variant === 'dark' ? 'regular' : 'extraDark'}
				reducedTransparencyFallbackColor="white"
				style={StyleSheet.absoluteFill}
			/>
		);
	}

	return (
		<BSStack.Navigator>
			<BSStack.Screen component={TabNavigator} name="tabs" />
			<BSStack.Screen component={Scan} name="scan" options={{ height: height - topOffset }} />
			<BSStack.Screen component={Sessions} name="walletconnectSessions" options={{ backdropComponent: Backdrop }} />
			<BSStack.Screen component={SessionProposal} name="sessionProposal" options={{ backdropComponent: Backdrop }} />
			<BSStack.Screen component={SessionRequest} name="sessionRequest" options={{ backdropComponent: Backdrop }} />
			{/* <BSStack.Screen component={Receive} name="receive" options={{ backdropComponent: Backdrop }} /> */}
			<BSStack.Screen component={Receive} name="receive" options={{ backdropOpacity: 0.8 }} />
			{/* <BSStack.Screen component={Reset} name="send" options={{ height: height * 0.8 }} /> */}
			<BSStack.Screen component={Reset} name="swap" options={{ height: height * 0.8 }} />
			<BSStack.Screen component={Reset} name="bridge" options={{ height: height * 0.8 }} />
			<BSStack.Screen component={Reset} name="settings" options={{ height: height * 0.8 }} />
		</BSStack.Navigator>
	);
}

function SendNavigator() {
	const { height } = useWindowDimensions();

	return (
		<BSStack.Navigator>
			<BSStack.Screen component={Send} name="receipent" options={{ height: height * 0.5 }} />
			<BSStack.Screen component={ScanAddress} name="scanAddress" options={{ height: height * 0.92 }} />
			<BSStack.Screen component={Reset} name="chooseToken" options={{ height: height * 0.5 }} />
			<BSStack.Screen component={Reset} name="chooseWallet" options={{ height: height * 0.5 }} />
			<BSStack.Screen component={Reset} name="confirmSend" options={{ height: height * 0.5 }} />
		</BSStack.Navigator>
	);
}

function WalletNavigator() {
	const { height } = useWindowDimensions();

	return (
		<BSStack.Navigator>
			<BSStack.Screen component={Welcome} name="home" />
			<BSStack.Screen component={CreateWallet} name="createWallet" options={{ height: height * 0.5 }} />
			<BSStack.Screen component={ImportWallet} name="importWallet" options={{ height: height * 0.5 }} />
			<BSStack.Screen component={SetPassword} name="setPassword" options={{ height: height * 0.5 }} />
		</BSStack.Navigator>
	);
}

function AuthNavigator() {
	const { height } = useWindowDimensions();

	return (
		<BSStack.Navigator>
			<BSStack.Screen component={Login} name="login" />
			<BSStack.Screen component={Reset} name="reset" options={{ height: height * 0.4 }} />
		</BSStack.Navigator>
	);
}

function RootNavigator() {
	const { navigationTheme, variant, backgrounds } = useTheme();

	const initialized = useSelector((state: RootState) => state.wallet.initialized);
	const onboarding = useSelector((state: RootState) => state.wallet.onboarding);

	const initialRouteName = !onboarding ? 'onboarding' : !initialized ? 'welcome' : 'root';

	const barStyle = variant === 'dark' ? 'light-content' : 'dark-content';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const linking: LinkingOptions<any> = {
		prefixes: [
			'wc://',
			'rely://',
			'wallet://',
			'ethereum://',
			'solana://',
			'bitcoin://',
			'mina://',
			'https://getrely.io',
			'https://*.getrely.io',
			'https://craftlabs.tech',
			'https://*.craftlabs.tech',
		],
	};

	const onStateChange = (state: NavigationState | undefined) => {
		// Can be used for analytics
		logger.debug(`onNavigationStateChange: ${state?.key}`);
	};

	const onReady = () => {
		sentryRoutingInstrumentation.registerNavigationContainer(navigationRef);
	};

	return (
		<NavigationContainer
			// @ts-ignore
			ref={navigationRef}
			linking={linking}
			theme={navigationTheme}
			onStateChange={onStateChange}
			onReady={onReady}>
			<StatusBar barStyle={barStyle} backgroundColor={navigationTheme.colors.background} />
			<Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
				<Stack.Screen component={Onboarding} name="onboarding" options={{ gestureEnabled: false }} />
				<Stack.Screen component={WalletNavigator} name="welcome" options={{ gestureEnabled: false }} />
				<Stack.Screen component={AuthNavigator} name="auth" options={{ gestureEnabled: false }} />
				<Stack.Screen component={BSNavigator} name="root" options={{ gestureEnabled: false }} />
				<Stack.Screen component={SendNavigator} name="send" options={{ presentation: 'modal' }} />
				{/* <Stack.Screen component={Receive} name="receive" options={{ presentation: 'modal' }} /> */}
				<Stack.Screen
					component={Wallet}
					name="wallet"
					options={{
						headerShown: true,
						title: 'Wallet',
						headerBackTitle: 'Home',
						headerBackTitleVisible: false,
						headerStyle: backgrounds.ui_background,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export const ApplicationNavigator = memo(RootNavigator);
