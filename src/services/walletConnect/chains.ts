export const nonEVM = ['solana', 'molecule', 'merlin', 'bitcoin', 'sui', 'sei', 'aptos', 'near', 'hedera'];

export const eip155 = [
	'eip155:1', // ethereum mainnet
	'eip155:11155111', // ethereum sepolia testnet
	'eip155:61', // etherum classic mainnet
	'eip155:10001', // etherum PoW mainnet
	'eip155:56', // binance smart chain
	'eip155:97', // binance smart chain testnet
	'eip155:137', // polygon
	'eip155:80001', // mumbai testnet
	'eip155:1101', // polygon zkEVM
	'eip155:1442', // polygon zkEVM testnet
	'eip155:80002', // polygon amoy
	'eip155:250', // fantom
	'eip155:4002', // fantom testnet
	'eip155:42161', // arbitrum one
	'eip155:42170', // arbitrum nova
	'eip155:421614', // arbitrum one sepolia testnet
	'eip155:13331371', // arbitrum stylus testnet
	'eip155:10', // optimism
	'eip155:11155420', // optimism sepolia testnet
	'eip155:1313161554', // aurora
	'eip155:43114', // avalanche
	'eip155:43113', // avalanche fuji testnet
	'eip155:324', // zkSync
	'eip155:280', // zkSync testnet
	'eip155:2020', // ronin
	'eip155:81457', // blast
	'eip155:168587773', // blast testnet
	'eip155:8453', // base
	'eip155:59144', // linea
	'eip155:42220', // celo
	'eip155:592', // astar
	'eip155:3776', // astar zkEVM
	'eip155:34443', // mode
	'eip155:169', // manta
	'eip155:170', // mantle testnet
	'eip155:1337', // metis
	'eip155:7777777', // zora
	'eip155:7777777', // gnosis
	'eip155:7777777', // degen
];

const mainnet = [
	{
		name: 'Ethereum Mainnet',
		chain: 'ETH',
		icon: 'ethereum',
		rpc: [
			`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`,
			'https://api.mycryptoapi.com/eth',
			'https://cloudflare-eth.com',
			'https://ethereum-rpc.publicnode.com',
			'wss://ethereum-rpc.publicnode.com',
			'https://mainnet.gateway.tenderly.co',
			'wss://mainnet.gateway.tenderly.co',
			'https://rpc.blocknative.com/boost',
			'https://rpc.flashbots.net',
			'https://rpc.flashbots.net/fast',
			'https://rpc.mevblocker.io',
			'https://rpc.mevblocker.io/fast',
			'https://rpc.mevblocker.io/noreverts',
			'https://rpc.mevblocker.io/fullprivacy',
			'https://eth.drpc.org',
			'wss://eth.drpc.org',
		],
		features: [{ name: 'EIP155' }, { name: 'EIP1559' }],
		faucets: [],
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		infoURL: 'https://ethereum.org',
		shortName: 'eth',
		chainId: 1,
		networkId: 1,
		slip44: 60,
		ens: {
			registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
		},
		explorers: [
			{
				name: 'etherscan',
				url: 'https://etherscan.io',
				standard: 'EIP3091',
			},
			{
				name: 'blockscout',
				url: 'https://eth.blockscout.com',
				icon: 'blockscout',
				standard: 'EIP3091',
			},
			{
				name: 'dexguru',
				url: 'https://ethereum.dex.guru',
				icon: 'dexguru',
				standard: 'EIP3091',
			},
		],
	},
];

const testnet = [
	{
		name: 'Sepolia',
		title: 'Ethereum Testnet Sepolia',
		chain: 'ETH',
		rpc: [
			'https://rpc.sepolia.org',
			'https://rpc2.sepolia.org',
			'https://rpc-sepolia.rockx.com',
			'https://rpc.sepolia.ethpandaops.io',
			`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
			`wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`,
			'https://sepolia.gateway.tenderly.co',
			'wss://sepolia.gateway.tenderly.co',
			'https://ethereum-sepolia-rpc.publicnode.com',
			'wss://ethereum-sepolia-rpc.publicnode.com',
			'https://sepolia.drpc.org',
			'wss://sepolia.drpc.org',
			'https://rpc-sepolia.rockx.com',
		],
		faucets: ['http://fauceth.komputing.org?chain=11155111'],
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		infoURL: 'https://sepolia.otterscan.io',
		shortName: 'sep',
		chainId: 11155111,
		networkId: 11155111,
		slip44: 1,
		explorers: [
			{
				name: 'etherscan-sepolia',
				url: 'https://sepolia.etherscan.io',
				standard: 'EIP3091',
			},
			{
				name: 'otterscan-sepolia',
				url: 'https://sepolia.otterscan.io',
				standard: 'EIP3091',
			},
		],
	},
];

export const chains = {
	mainnet,
	testnet,
};
