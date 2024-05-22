/* eslint-disable no-underscore-dangle */
import { Dimensions } from 'react-native';
import { Core } from '@walletconnect/core';
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { navigationRef } from '@/navigation/navigationRef';
import { triggerHapticFeedback } from '@/utils/haptics';
import { toUtf8String } from 'ethers/lib/utils';
import Toast from 'react-native-toast-message';
import { BytesLike } from 'ethers';
import { isObject } from 'lodash';
import { ErrorLog, logger } from '@/services/logger';
import { getFromKeychain } from '@/services/keychain';
import { createEVMWallet } from '@/services/wallet';
import { EIP712 } from '@/utils/wallet';
import { store } from '@/store';

const metadata = {
	name: 'Rely Wallet',
	description: 'Rely Wallet',
	url: 'https://getrely.io',
	icons: ['https://avatars2.githubusercontent.com/u/48327834?s=200&v=4'],
	redirect: {
		native: 'rely://wc',
		universal: 'https://getrely.io/wc',
	},
};

/**
 * MAY BE UNDEFINED if WC v2 hasn't been instantiated yet
 */
let syncWalletClient: Awaited<ReturnType<(typeof Web3Wallet)['init']>> | undefined;

const core = new Core({ projectId: process.env.WALLETCONNECT_PROJECT_ID });

const walletClient = Web3Wallet.init({ core, metadata });

/**
 * Returns the WalletConnect client instance
 * Ensures that the client is initialized only once
 */
export async function getWalletClient() {
	if (!syncWalletClient) {
		logger.debug(`Initializing WalletConnect syncWalletClient ${syncWalletClient}`);
		syncWalletClient = await walletClient;
	}
	return syncWalletClient;
}

export async function initializeWalletConnect() {
	const client = await getWalletClient();

	client.on('auth_request', payload => logger.debug(`auth_request: ${JSON.stringify(payload)}`));
	client.on('proposal_expire', onProposalExpire);
	client.on('session_authenticate', onSessionAuthenticate);
	client.on('session_delete', onSessionDelete);
	client.on('session_proposal', onSessionProposal);
	client.on('session_request', onSessionRequest);
	client.on('session_request_expire', onSessionRequestExpire);
	logger.info('WalletConnect initialized');

	// TODO: subscribe to walletconnect push notifications
	// TODO: initialize walletconnect inbox with push notifications
}

function onSessionProposal({ id, params, verifyContext }: Web3WalletTypes.SessionProposal) {
	logger.debug(`session_proposal: ${JSON.stringify({ id, params, verifyContext })}`);
	// TODO: check if the chain is supported
	// TODO: run after UI interaction (approve/reject)

	const supportedNamespaces = buildNamespaces({ id, params, verifyContext });
	const approvedNamespaces = buildApprovedNamespaces({ proposal: params, supportedNamespaces });

	const onApprove = async () => {
		try {
			triggerHapticFeedback('soft');
			const client = await getWalletClient();
			void client.approveSession({ id, namespaces: approvedNamespaces });
			navigationRef.goBack();
			Toast.show({
				type: 'success',
				text1: 'Session approved',
				text2: 'The session has been approved',
				position: 'top',
				topOffset: Dimensions.get('window').height * 0.05,
				text1Style: { fontFamily: 'Rubik-Medium' },
				text2Style: { fontFamily: 'Rubik-Medium' },
			});
		} catch (error) {
			logger.error(new ErrorLog(`session approve error: ${JSON.stringify(error)}`), { type: 'error' });
			navigationRef.goBack();
		}
	};

	const onReject = async () => {
		try {
			triggerHapticFeedback('soft');
			const client = await getWalletClient();
			void client.rejectSession({ id, reason: getSdkError('USER_REJECTED') });
			navigationRef.goBack();
			Toast.show({
				type: 'error',
				text1: 'Session rejected',
				text2: 'The session has been rejected',
				position: 'top',
				topOffset: Dimensions.get('window').height * 0.05,
				text1Style: { fontFamily: 'Rubik-Medium' },
				text2Style: { fontFamily: 'Rubik-Medium' },
			});
		} catch (error) {
			logger.error(new ErrorLog(`session reject error: ${JSON.stringify(error)}`), { type: 'error' });
			navigationRef.goBack();
		}
	};

	const props = { proposal: { id, params, verifyContext }, onApprove, onReject };

	navigationRef.navigate('sessionProposal', props);
}

function onProposalExpire({ id }: Web3WalletTypes.ProposalExpire) {
	logger.debug(`proposal_expire: ${id}`);
	triggerHapticFeedback('impactHeavy');
	Toast.show({
		type: 'error',
		text1: 'Session proposal expired',
		text2: 'The session proposal has expired',
		position: 'top',
		topOffset: Dimensions.get('window').height * 0.05,
		text1Style: { fontFamily: 'Rubik-Medium' },
		text2Style: { fontFamily: 'Rubik-Medium' },
	});
	// TODO: dismiss the modal if it's open
}

function onSessionDelete({ id, topic }: Web3WalletTypes.SessionDelete) {
	logger.debug(`session_delete: ${JSON.stringify({ id, topic })}`);
}

function onSessionAuthenticate({ id, topic, params }: Web3WalletTypes.SessionAuthenticate) {
	logger.debug(`session_authenticate: ${JSON.stringify({ id, topic, params })}`);
}

async function onSessionRequest(sessionRequest: Web3WalletTypes.SessionRequest) {
	logger.debug(`session_request: ${JSON.stringify(sessionRequest)}`);
	const { id, topic, params } = sessionRequest;
	const chainSupported = isChainSupported(params.chainId);
	const client = await getWalletClient();

	if (!chainSupported) {
		const response = { id, jsonrpc: '2.0', error: { code: 5000, message: 'Chain not supported' } };
		await client.respondSessionRequest({ topic, response });
		return;
	}

	if (params.request.method === 'personal_sign') {
		logger.debug('personal_sign');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const messageBytes: BytesLike = params.request.params[0] as BytesLike;
		const message = toUtf8String(messageBytes);
		logger.debug(`message: ${message}`);
		const onApprove = async () => {
			try {
				triggerHapticFeedback('soft');
				const mnemonic = await getFromKeychain('mnemonic');
				const wallet = await createEVMWallet(mnemonic as string, 0);
				const signature = await wallet.signMessage(message);
				const response = { id, result: signature, jsonrpc: '2.0' };
				await client.respondSessionRequest({ topic, response });
				navigationRef.goBack();
				Toast.show({
					type: 'success',
					text1: 'Message signed',
					text2: 'The message has been signed successfully',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			} catch (error) {
				logger.error(new ErrorLog(`session request error: ${JSON.stringify(error)}`), { error });
				navigationRef.goBack();
				Toast.show({
					type: 'error',
					text1: 'Error signing message',
					text2: 'An error occurred while signing the message',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			}
		};
		const onReject = () => {
			try {
				triggerHapticFeedback('soft');
				const response = { id, jsonrpc: '2.0', error: { code: 4001, message: 'User rejected request' } };
				void client.respondSessionRequest({ topic, response });
				navigationRef.goBack();
				Toast.show({
					type: 'error',
					text1: 'Request rejected',
					text2: 'The request has been rejected',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			} catch (error) {
				logger.error(new ErrorLog(`session request error: ${JSON.stringify(error)}`), { error });
				navigationRef.goBack();
				Toast.show({
					type: 'error',
					text1: 'Error rejecting request',
					text2: 'An error occurred while rejecting the request',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			}
		};
		const props = { request: sessionRequest, message, request_method: 'personal_sign', onApprove, onReject };
		navigationRef.navigate('sessionRequest', props);
		return;
	}
	if (params.request.method === 'eth_sign') {
		logger.debug('Rely Wallet does not support eth_sign');
	}
	if (params.request.method === 'eth_signTypedData') {
		logger.debug('Rely Wallet does not support eth_signTypedData');
	}
	if (params.request.method === 'eth_signTypedData_v4') {
		logger.debug('eth_signTypedData_v4');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!params.request.params && !params.request.params[1]) {
			logger.debug('Invalid typed data');
			const response = { id, jsonrpc: '2.0', error: { code: 5000, message: 'Invalid typed data' } };
			await client.respondSessionRequest({ topic, response });
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		const typedData = JSON.parse(params.request.params[1]) as EIP712;

		const onApprove = async () => {
			try {
				triggerHapticFeedback('soft');

				// https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
				delete typedData.types.EIP712Domain;

				const mnemonic = await getFromKeychain('mnemonic');
				const wallet = await createEVMWallet(mnemonic as string, 0);
				const signature = await wallet._signTypedData(typedData.domain, typedData.types, typedData.message);
				const response = { id, result: signature, jsonrpc: '2.0' };
				await client.respondSessionRequest({ topic, response });
				navigationRef.goBack();
				Toast.show({
					type: 'success',
					text1: 'Typed data signed',
					text2: 'The typed data has been signed successfully',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			} catch (error) {
				logger.debug(`Error signing typed data: ${JSON.stringify(error)}`);
				const response = { id, jsonrpc: '2.0', error: { code: 5000, message: 'Error signing typed data' } };
				void client.respondSessionRequest({ topic, response });
			}
		};
		const onReject = () => {
			try {
				triggerHapticFeedback('soft');
				const response = { id, jsonrpc: '2.0', error: { code: 4001, message: 'User rejected request' } };
				void client.respondSessionRequest({ topic, response });
				navigationRef.goBack();
				Toast.show({
					type: 'error',
					text1: 'Request rejected',
					text2: 'The request has been rejected',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			} catch (error) {
				logger.error(new ErrorLog(`session request error: ${JSON.stringify(error)}`), { error });
				navigationRef.goBack();
				Toast.show({
					type: 'error',
					text1: 'Error rejecting request',
					text2: 'An error occurred while rejecting the request',
					position: 'top',
					topOffset: Dimensions.get('window').height * 0.05,
					text1Style: { fontFamily: 'Rubik-Medium' },
					text2Style: { fontFamily: 'Rubik-Medium' },
				});
			}
		};
		navigationRef.navigate('sessionRequest', {
			request: sessionRequest,
			message: JSON.stringify({ primaryType: typedData.primaryType, ...typedData.message }, null, 2),
			request_method: 'eth_signTypedData_v4',
			onApprove,
			onReject,
		});
		return;
	}
	if (params.request.method === 'eth_sendTransaction') {
		logger.debug('Rely Wallet does not support eth_sendTransaction');
	}
	if (params.request.method === 'eth_signTransaction') {
		logger.debug('Rely Wallet does not support eth_signTransaction');
	}
	if (params.request.method === 'eth_sendRawTransaction') {
		logger.debug('Rely Wallet does not support eth_sendRawTransaction');
	}

	logger.debug(`Unknown method: ${params.request.method}`);

	const response = { id, jsonrpc: '2.0', error: { code: 5000, message: 'Unknown method' } };
	await client.respondSessionRequest({ topic, response });

	// const channelId = await notifee.createChannel({
	// 	id: 'default',
	// 	name: 'Default Channel',
	// 	vibration: true,
	// 	vibrationPattern: [300, 500],
	// });
	// void notifee.displayNotification({
	// 	title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
	// 	subtitle: '&#129395;',
	// 	body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
	// 	android: {
	// 		channelId,
	// 		color: '#4caf50',
	// 		category: AndroidCategory.SERVICE,
	// 		importance: AndroidImportance.HIGH,
	// 		fullScreenAction: { id: 'default' },
	// 		actions: [
	// 			{
	// 				title: '<b>Dance</b> &#128111;',
	// 				pressAction: { id: 'dance' },
	// 			},
	// 			{
	// 				title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
	// 				pressAction: { id: 'cry' },
	// 			},
	// 		],
	// 	},
	// });
}

function onSessionRequestExpire({ id }: Web3WalletTypes.SessionRequestExpire) {
	logger.debug(`session_request_expire: ${id}`);
	triggerHapticFeedback('impactHeavy');
	Toast.show({
		type: 'error',
		text1: 'Session request expired',
		text2: 'The session request has expired',
		position: 'top',
		topOffset: Dimensions.get('window').height * 0.05,
		text1Style: { fontFamily: 'Rubik-Medium' },
		text2Style: { fontFamily: 'Rubik-Medium' },
	});
	// TODO: dismiss the modal if it's open
}

export function buildNamespaces({ params }: Web3WalletTypes.SessionProposal) {
	const index = store.getState().wallet.accountIndex;
	const evmWallet = store.getState().wallet.evm.at(index);
	const minaWallet = store.getState().wallet.mina.at(index);
	const solanaWallet = store.getState().wallet.solana.at(index);
	const cosmosWallet = store.getState().wallet.cosmos.at(index);

	const namespaces: Namespace = {
		eip155: {
			accounts: Array.from(
				new Set(
					(params.requiredNamespaces.eip155?.chains?.map(chainId => `${chainId}:${evmWallet?.address}`) ?? []).concat(
						params.optionalNamespaces.eip155?.chains?.map(chainId => `${chainId}:${evmWallet?.address}`) ?? [],
					),
				),
			),
			chains: (params.requiredNamespaces.eip155?.chains ?? []).concat(params.optionalNamespaces.eip155?.chains ?? []),
			events: (params.requiredNamespaces.eip155?.events ?? []).concat(params.optionalNamespaces.eip155?.events ?? []),
			methods: (params.requiredNamespaces.eip155?.methods ?? []).concat(
				params.optionalNamespaces.eip155?.methods ?? [],
			),
		},
		solana: {
			accounts: params.requiredNamespaces.solana?.chains?.map(network => `${network}:${solanaWallet?.address}`) ?? [],
			chains: (params.requiredNamespaces.solana?.chains ?? []).concat(params.optionalNamespaces.solana?.chains ?? []),
			events: (params.requiredNamespaces.solana?.events ?? []).concat(params.optionalNamespaces.solana?.events ?? []),
			methods: (params.requiredNamespaces.solana?.methods ?? []).concat(
				params.optionalNamespaces.solana?.methods ?? [],
			),
		},
		cosmos: {
			accounts: params.requiredNamespaces.cosmos?.chains?.map(network => `${network}:${cosmosWallet?.address}`) ?? [],
			chains: (params.requiredNamespaces.cosmos?.chains ?? []).concat(params.optionalNamespaces.cosmos?.chains ?? []),
			events: (params.requiredNamespaces.cosmos?.events ?? []).concat(params.optionalNamespaces.cosmos?.events ?? []),
			methods: (params.requiredNamespaces.cosmos?.methods ?? []).concat(
				params.optionalNamespaces.cosmos?.methods ?? [],
			),
		},
		mina: {
			accounts: params.requiredNamespaces.mina?.chains?.map(network => `${network}:${minaWallet?.address}`) ?? [],
			chains: (params.requiredNamespaces.mina?.chains ?? []).concat(params.optionalNamespaces.mina?.chains ?? []),
			events: (params.requiredNamespaces.mina?.events ?? []).concat(params.optionalNamespaces.mina?.events ?? []),
			methods: (params.requiredNamespaces.mina?.methods ?? []).concat(params.optionalNamespaces.mina?.methods ?? []),
		},
	};

	return namespaces;
}

export function isChainSupported(chainId: string) {
	return (
		chainId.startsWith('eip155:') ||
		chainId.startsWith('solana:') ||
		chainId.startsWith('cosmos:') ||
		chainId.startsWith('mina:')
	);
}

export function isEIP712(message: unknown): message is EIP712 {
	return isObject(message) && 'primaryType' in message && 'domain' in message && 'message' in message;
}

export function isWalletConnectURI(uri: string) {
	return uri.startsWith('wc:');
}

export function isWalletConnectURIV1(uri: string) {
	return uri.endsWith('@1') || uri.includes('@1?');
}

export function isWalletConnectURIV2(uri: string) {
	return uri.endsWith('@2') || uri.includes('@2?');
}

type Namespace = Record<string, { chains: string[]; methods: string[]; events: string[]; accounts: string[] }>;
