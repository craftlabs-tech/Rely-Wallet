import { AnkrProvider, GetAccountBalanceReply } from '@ankr.com/ankr.js';
import { ErrorLog, logger } from '@/services/logger';

const provider = new AnkrProvider(process.env.ANKR_ENDPOINT as string);

export const getBalance = async (address: string): Promise<GetAccountBalanceReply> => {
	try {
		const balance = await provider.getAccountBalance({
			walletAddress: address,
			blockchain: [
				'arbitrum',
				'avalanche',
				'base',
				'bsc',
				'eth',
				'fantom',
				'flare',
				'gnosis',
				'linea',
				'optimism',
				'polygon',
				'polygon_zkevm',
				'scroll',
				'syscoin',
			],
		});
		return balance;
	} catch (error) {
		logger.error(new ErrorLog(`Failed to fetch balance: ${JSON.stringify(error)}`), { type: 'query' });
		throw error;
	}
};
