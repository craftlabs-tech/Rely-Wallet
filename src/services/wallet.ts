import * as ed25519 from 'ed25519-hd-key';
import * as bs58check from 'bs58check';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import ecc from '@bitcoinerlab/secp256k1';
import { ethers } from 'ethers';
import { BIP32Factory } from 'bip32';
import { EnglishMnemonic, stringToPath } from '@cosmjs/crypto';
import Client, { NetworkId } from 'mina-signer';
import { base58, isAddress } from 'ethers/lib/utils';
import { AccountData, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { ErrorLog, logger } from '@/services/logger';
import { BitcoinWallet, EVMWallet, MinaWallet, SolanaWallet } from '@/store/wallet';

type CosmosWallet = { wallet: DirectSecp256k1HdWallet; accounts: readonly AccountData[] };

export const generateMnemonic = () => bip39.generateMnemonic();

export const validateMnemonic = (mnemonic: string) => bip39.validateMnemonic(mnemonic);

export const validatePrivateKey = (privateKey: string) => {
	try {
		const wallet = new ethers.Wallet(privateKey);
		if (isAddress(wallet.address)) {
			return true;
		}
		return false;
	} catch (error) {
		return false;
	}
};

export const createEVMWallet = (phrase: string, index = 0): Promise<EVMWallet> => {
	try {
		const derivationPath = `m/44'/60'/0'/0/${index}`;
		const wallet = ethers.Wallet.fromMnemonic(phrase, derivationPath);

		return Promise.resolve({
			balance: 0,
			address: wallet.address,
			nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
		});
	} catch (error) {
		logger.error(new ErrorLog(`Failed to create EVM wallet: ${JSON.stringify(error)}`), { type: 'error' });
		throw new Error('Failed to create EVM wallet');
	}
};

export const createSolanaWallet = (phrase: string, index = 0): Promise<SolanaWallet> => {
	try {
		const derivationPath = `m/44'/501'/${index}'/0'`;
		const seed = bip39.mnemonicToSeedSync(phrase);
		const derivedKey = ed25519.derivePath(derivationPath, seed.toString('hex'));
		const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);
		const wallet = {
			balance: 0,
			address: base58.encode(keyPair.publicKey),
			publicKey: base58.encode(keyPair.publicKey),
			secretKey: base58.encode(keyPair.secretKey),
			nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
		};
		return Promise.resolve(wallet);
	} catch (error) {
		logger.error(new ErrorLog(`Failed to create Solana wallet: ${JSON.stringify(error)}`), { type: 'error' });
		throw new Error('Failed to create Solana wallet');
	}
};

export const createMinaWallet = (phrase: string, network: NetworkId, index = 0): Promise<MinaWallet> => {
	try {
		const bip32 = BIP32Factory(ecc);
		const minaClient = new Client({ network });

		const derivationPath = `m/44'/12586'/${index}'/0/0`;
		const seed = bip39.mnemonicToSeedSync(phrase);
		const masterNode = bip32.fromSeed(seed);
		const childNode = masterNode.derivePath(derivationPath);

		if (childNode.privateKey) {
			// eslint-disable-next-line no-bitwise
			childNode.privateKey[0] &= 0x3f;
			const childPrivateKey = Buffer.from(childNode.privateKey).reverse();
			const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`;
			const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));
			const publicKey = minaClient.derivePublicKey(privateKey);
			const wallet = {
				publicKey,
				privateKey,
				address: publicKey,
				balance: 0,
				nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
			};
			return Promise.resolve(wallet as MinaWallet);
		}
		return Promise.reject(new Error('No private key found'));
	} catch (error) {
		logger.error(new ErrorLog(`Failed to create Mina wallet: ${JSON.stringify(error)}`), { type: 'error' });
		throw new Error('Failed to create Mina wallet');
	}
};

export const createCosmosWallet = async (phrase: string, index = 0): Promise<CosmosWallet> => {
	try {
		const derivationPath = `m/44'/118'/${index}'/0/0`;
		const hdPath = stringToPath(derivationPath);
		const mnemonic = new EnglishMnemonic(phrase);
		const seed = await bip39.mnemonicToSeed(phrase);
		// @ts-ignore
		const wallet = new DirectSecp256k1HdWallet(mnemonic, { seed, hdPaths: [hdPath] }) as DirectSecp256k1HdWallet;
		const accounts: readonly AccountData[] = await wallet.getAccounts();
		return { wallet, accounts };
	} catch (error) {
		logger.error(new ErrorLog(`Failed to create Cosmos wallet: ${JSON.stringify(error)}`), { type: 'error' });
		throw new Error('Failed to create Cosmos wallet');
	}
};

export const createBitcoinWallet = async (phrase: string, index = 0): Promise<BitcoinWallet> => {
	try {
		const bip32 = BIP32Factory(ecc);
		const derivationPath = `m/84'/0'/0'/0/${index}`;
		const seed = await bip39.mnemonicToSeed(phrase);
		const keyPair = bip32.fromSeed(seed).derivePath(derivationPath);

		const wallet = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

		return {
			balance: 0,
			address: wallet.address as string,
			publicKey: wallet.address as string,
			nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
		};
	} catch (error) {
		logger.error(new ErrorLog(`Failed to create Bitcoin wallet: ${JSON.stringify(error)}`), { type: 'error' });
		throw new Error('Failed to create Bitcoin wallet');
	}
};

export function getXPubPrefix(xpub: string, prefix: string) {
	let data = base58.decode(xpub);
	data = data.slice(4);
	data = Buffer.concat([Buffer.from(prefix, 'hex'), data]);
	return base58.encode(data);
}

export const createWallet = async (phrase: string, index = 0) => {
	const wallets = await Promise.all([
		createEVMWallet(phrase, index),
		createSolanaWallet(phrase, index),
		createMinaWallet(phrase, 'mainnet', index),
		createCosmosWallet(phrase, index),
		createBitcoinWallet(phrase, index),
	]);
	return wallets;
};
