import { createStackNavigator } from '@react-navigation/stack';

import type { Web3WalletTypes } from '@walletconnect/web3wallet';
import { EVMWallet, SolanaWallet, CosmosWallet, MinaWallet, BitcoinWallet } from '@/store/wallet';

export type PartialNavigatorConfigOptions = Pick<
	Partial<Parameters<ReturnType<typeof createStackNavigator>['Screen']>[0]>,
	'options'
>;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	onboarding: undefined;
	welcome: undefined;
	auth: undefined;
	login: undefined;
	reset: undefined;
	root: undefined;
	home: undefined;
	createWallet: undefined;
	importWallet: undefined;
	setPassword: { mnemonic: string };
	scan: undefined;
	walletconnectSessions: undefined;
	sessionProposal: {
		proposal: Web3WalletTypes.SessionProposal;
		onApprove: () => void;
		onReject: () => void;
	};
	sessionRequest: {
		message: string;
		// TODO: use enum
		request_method: string;
		request: Web3WalletTypes.SessionRequest;
		onApprove: () => void;
		onReject: () => void;
	};
	sessionAuthenticate: {
		message: string;
		request: Web3WalletTypes.SessionAuthenticate;
		onApprove: () => void;
		onReject: () => void;
	};
	settings: undefined;
	send: undefined;
	receive: undefined;
	swap: undefined;
	bridge: undefined;
	wallet: { wallet: EVMWallet | SolanaWallet | MinaWallet | CosmosWallet | BitcoinWallet };
	switchWallet: undefined;
};
