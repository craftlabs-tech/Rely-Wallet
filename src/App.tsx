/* eslint-disable import/no-duplicates */
/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import '@walletconnect/react-native-compat';
import 'fast-text-encoding';
// import 'react-native-get-random-values';
// import '@ethersproject/shims';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { MMKV } from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import { install } from 'react-native-quick-crypto';
import { publicProvider } from 'wagmi/providers/public';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { initializeWalletConnect } from '@/services/walletConnect';
import { ApplicationNavigator } from '@/navigation/Application';
import { initializeSentry } from '@/services/logger/sentry';
import { persistor, store } from '@/store';
import { logger } from '@/services/logger';
import { ThemeProvider } from '@/theme';
import './translations';

install();
logger.enable();
void initializeSentry();
void initializeWalletConnect();

const queryClient = new QueryClient();

export const storage = new MMKV();

const { publicClient, webSocketPublicClient } = configureChains([mainnet, sepolia], [publicProvider()]);

const config = createConfig({ autoConnect: true, publicClient, webSocketPublicClient });

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider storage={storage}>
							<WagmiConfig config={config}>
								<SafeAreaProvider>
									<ApplicationNavigator />
									<Toast />
								</SafeAreaProvider>
							</WagmiConfig>
						</ThemeProvider>
					</QueryClientProvider>
				</PersistGate>
			</Provider>
		</GestureHandlerRootView>
	);
}

export default Sentry.withProfiler(App);
