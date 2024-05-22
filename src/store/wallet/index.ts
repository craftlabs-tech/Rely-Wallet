/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@/services/logger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EVMWallet {
	address: string;
	balance: number;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	ens?: {
		name: string | null;
		avatarUrl: string | null;
	};
}

export interface SolanaWallet {
	publicKey: string;
	address: string;
	balance: number;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export interface MinaWallet {
	publicKey: string;
	address: string;
	balance: number;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export interface CosmosWallet {
	address: string;
	publicKey: string;
	balance: number;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export interface BitcoinWallet {
	address: string;
	publicKey: string;
	balance: number;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

interface WalletSliceState {
	initialized: boolean;
	onboarding: boolean;
	biometrics: boolean;
	notifications: boolean;
	uniqueId: string;
	password: string;
	theme: 'dark' | 'default' | 'system';
	accountIndex: number;
	activeAccount: string;
	evm: EVMWallet[];
	solana: SolanaWallet[];
	mina: MinaWallet[];
	cosmos: CosmosWallet[];
	bitcoin: BitcoinWallet[];
	networks: {
		eip155: {
			name: string;
			chain: string;
			rpc: string[];
			faucets: any[];
			nativeCurrency: {
				name: string;
				symbol: string;
				decimals: number;
			};
			features: any[];
			infoURL: string;
			shortName: string;
			chainId: number;
			networkId: number;
			icon: string;
			explorers: {
				name: string;
				url: string;
				icon: string;
				standard: string;
			}[];
		}[];
		solana: {
			name: string;
			rpcUrl: string;
			explorerUrl: string;
		}[];
		cosmos: {
			name: string;
			rpcUrl: string;
			explorerUrl: string;
		}[];
		mina: {
			name: string;
			rpcUrl: string;
			explorerUrl: string;
		}[];
	};
}

const initialState: WalletSliceState = {
	initialized: false,
	onboarding: false,
	biometrics: false,
	notifications: false,
	uniqueId: '',
	password: '',
	theme: 'system',
	accountIndex: 0,
	activeAccount: '',
	evm: [],
	solana: [],
	mina: [],
	cosmos: [],
	bitcoin: [],
	networks: {
		eip155: [
			{
				name: 'Ethereum Mainnet',
				chain: 'ETH',
				rpc: [`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`],
				faucets: [],
				nativeCurrency: {
					name: 'Ether',
					symbol: 'ETH',
					decimals: 18,
				},
				features: [{ name: 'EIP155' }, { name: 'EIP1559' }],
				infoURL: 'https://ethereum.org',
				shortName: 'eth',
				chainId: 1,
				networkId: 1,
				icon: 'ethereum',
				explorers: [
					{
						name: 'etherscan',
						url: 'https://etherscan.io',
						icon: 'etherscan',
						standard: 'EIP3091',
					},
				],
			},
		],
		solana: [
			{
				name: 'Solana',
				rpcUrl: 'https://api.mainnet-beta.solana.com',
				explorerUrl: 'https://explorer.solana.com',
			},
			{
				name: 'Solana Devnet',
				rpcUrl: 'https://api.devnet.solana.com',
				explorerUrl: 'https://explorer.solana.com',
			},
			{
				name: 'Solana Testnet',
				rpcUrl: 'https://api.testnet.solana.com',
				explorerUrl: 'https://explorer.solana.com',
			},
			{
				name: 'Eclipse Devnet',
				rpcUrl: 'https://staging-rpc.dev2.eclipsenetwork.xyz',
				explorerUrl: 'https://explorer.dev.eclipsenetwork.xyz/?cluster=devnet',
			},
			{
				name: 'Eclipse Testnet',
				rpcUrl: 'https://testnet.dev2.eclipsenetwork.xyz',
				explorerUrl: 'https://explorer.test.eclipsenetwork.xyz/?cluster=testnet',
			},
		],
		mina: [],
		cosmos: [],
	},
};

const walletSlice = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		setInitialised: (state, action: PayloadAction<boolean>) => {
			state.initialized = action.payload;
		},
		setOnboarding: (state, action: PayloadAction<boolean>) => {
			state.onboarding = action.payload;
		},
		setBiometrics: (state, action: PayloadAction<boolean>) => {
			state.biometrics = action.payload;
		},
		setUniqueId: (state, action: PayloadAction<string>) => {
			state.uniqueId = action.payload;
		},
		setNotifications: (state, action: PayloadAction<boolean>) => {
			state.notifications = action.payload;
		},
		setEVMWallet: (state, action: PayloadAction<EVMWallet>) => {
			state.evm.push(action.payload);
		},
		updateEVMWallet: (state, action: PayloadAction<EVMWallet>) => {
			const index = state.evm.findIndex(wallet => wallet.address === action.payload.address);
			state.evm[index] = action.payload;
		},
		setSolanaWallet: (state, action: PayloadAction<SolanaWallet>) => {
			state.solana.push(action.payload);
		},
		setMinaWallet: (state, action: PayloadAction<MinaWallet>) => {
			state.mina.push(action.payload);
		},
		setCosmosWallet: (state, action: PayloadAction<CosmosWallet>) => {
			state.cosmos.push(action.payload);
		},
		setBitcoinWallet: (state, action: PayloadAction<BitcoinWallet>) => {
			state.bitcoin.push(action.payload);
		},
		setAccountIndex: (state, action: PayloadAction<number>) => {
			state.accountIndex = action.payload;
		},
		setActiveAccount: (state, action: PayloadAction<string>) => {
			state.activeAccount = action.payload;
		},
		setTheme: (state, action: PayloadAction<'dark' | 'default' | 'system'>) => {
			state.theme = action.payload;
		},
		setPassword: (state, action: PayloadAction<string>) => {
			state.password = action.payload;
		},
		resetState: state => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			state = initialState;
			logger.warn('resetting redux state');
		},
	},
});

export default walletSlice.reducer;

export const {
	setInitialised,
	setOnboarding,
	setBiometrics,
	setUniqueId,
	setNotifications,
	setEVMWallet,
	updateEVMWallet,
	setSolanaWallet,
	setMinaWallet,
	setCosmosWallet,
	setBitcoinWallet,
	setActiveAccount,
	setAccountIndex,
	setTheme,
	setPassword,
	resetState,
} = walletSlice.actions;
