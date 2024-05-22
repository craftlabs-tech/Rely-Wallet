/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNode, useMemo, useState } from 'react';
import { Share, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Image, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import FastImage, { Source } from 'react-native-fast-image';
import Octicons from 'react-native-vector-icons/Octicons';
import QRCodeUtil, { QRCodeOptions } from 'qrcode';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { BitcoinWallet, CosmosWallet, EVMWallet, MinaWallet, SolanaWallet } from '@/store/wallet';
import { triggerHapticFeedback } from '@/utils/haptics';
import { abbreviateAddress } from '@/utils/wallet';
import { RootState } from '@/store';
import { useTheme } from '@/theme';
import { BlurView } from '@react-native-community/blur';

const generateMatrix = (value: string, options: QRCodeOptions) => {
	const arr = Array.prototype.slice.call(QRCodeUtil.create(value, options).modules.data, 0);
	const sqrt = Math.sqrt(arr.length);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return arr.reduce(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		(rows, key, index) => (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
		[],
	);
};

function Receive() {
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const { backgrounds, borders, colors, gutters, components, fonts, layout } = useTheme();

	const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
	const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;
	const solanaWallet = useSelector((s: RootState) => s.wallet.solana.at(activeWallet)) as SolanaWallet;
	const minaWallet = useSelector((s: RootState) => s.wallet.mina.at(activeWallet)) as MinaWallet;
	const cosmosWallet = useSelector((s: RootState) => s.wallet.cosmos.at(activeWallet)) as CosmosWallet;
	const bitcoinWallet = useSelector((s: RootState) => s.wallet.bitcoin.at(activeWallet)) as BitcoinWallet;

	const [value, setValue] = useState<string>(evmWallet.address);
	const [network, setNetwork] = useState('Ethereum');

	const ethereum = require('@/theme/assets/images/tokens/eth.png');
	const solana = require('@/theme/assets/images/tokens/sol.png');
	const mina = require('@/theme/assets/images/tokens/mina.png');
	const bitcoin = require('@/theme/assets/images/tokens/btc.png');
	const cosmos = require('@/theme/assets/images/tokens/cosmos.png');

	const ecl = 'M';
	const size = width * 0.6;
	const logoWrapperSize = size * 0.5; // 0.5 is larger than before
	const logoSize = logoWrapperSize * 0.85; // slightly smaller than wrapper
	const logoPosition = (size - logoWrapperSize) / 2;
	const logoMargin = (logoWrapperSize - logoSize) / 2;

	const dots = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const dots: unknown[] = [];

		const matrix: unknown[] = generateMatrix(value, { errorCorrectionLevel: ecl });
		const cellSize = size / matrix.length;
		const qrList = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
		];

		qrList.forEach(({ x, y }) => {
			const x1 = (matrix.length - 7) * cellSize * x;
			const y1 = (matrix.length - 7) * cellSize * y;
			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < 3; i++) {
				dots.push(
					<Rect
						key={`rect-${i}-${x}-${y}`}
						fill={i % 2 !== 0 ? 'white' : 'black'}
						height={cellSize * (7 - i * 2)}
						rx={(i - 3) * -6 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
						ry={(i - 3) * -6 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
						width={cellSize * (7 - i * 2)}
						x={x1 + cellSize * i}
						y={y1 + cellSize * i}
					/>,
				);
			}
		});

		const clearArenaSize = Math.floor((logoSize + 3) / cellSize);
		const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
		const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

		// @ts-ignore
		matrix.forEach((row: unknown[], i) => {
			row.forEach((column, j) => {
				// @ts-ignore
				if (matrix[i][j]) {
					if (!((i < 7 && j < 7) || (i > matrix.length - 8 && j < 7) || (i < 7 && j > matrix.length - 8))) {
						if (
							!(
								i > matrixMiddleStart &&
								i < matrixMiddleEnd &&
								j > matrixMiddleStart &&
								j < matrixMiddleEnd &&
								i < j + clearArenaSize / 2 &&
								j < i + clearArenaSize / 2 + 1
							)
						) {
							dots.push(
								<Circle
									cx={i * cellSize + cellSize / 2}
									cy={j * cellSize + cellSize / 2}
									fill="black"
									r={cellSize / 3} // calculate size of single dots
								/>,
							);
						}
					}
				}
			});
		});

		return dots;
	}, [ecl, logoSize, size, value]);

	const onChangeWallet = (chain: 'Ethereum' | 'Solana' | 'Mina' | 'Bitcoin' | 'Cosmos') => {
		setNetwork(chain);
		if (chain === 'Ethereum') {
			setValue(evmWallet.address);
		}
		if (chain === 'Solana') {
			setValue(solanaWallet.address);
		}
		if (chain === 'Mina') {
			setValue(minaWallet.address);
		}
		if (chain === 'Bitcoin') {
			setValue(bitcoinWallet.address);
		}
		if (chain === 'Cosmos') {
			setValue(cosmosWallet.address);
		}
	};

	const getLogo = (token: 'Ethereum' | 'Solana' | 'Mina' | 'Bitcoin' | 'Cosmos'): unknown => {
		if (token === 'Ethereum') {
			return ethereum;
		}
		if (token === 'Solana') {
			return solana;
		}
		if (token === 'Mina') {
			return mina;
		}
		if (token === 'Bitcoin') {
			return bitcoin;
		}
		if (token === 'Cosmos') {
			return cosmos;
		}
		return null;
	};

	const renderChip = (token: 'Ethereum' | 'Solana' | 'Mina' | 'Bitcoin' | 'Cosmos') => {
		return (
			<TouchableOpacity
				key={token}
				onPress={() => onChangeWallet(token)}
				style={[
					layout.flex_1,
					layout.center,
					layout.row,
					layout.gap_2,
					borders.w_2,
					borders.border_02,
					borders.rounded_36,
					gutters.paddingVertical_4,
					gutters.paddingHorizontal_6,
					// eslint-disable-next-line react-native/no-inline-styles
					token === network ? backgrounds.white : { backgroundColor: '#303030' },
				]}>
				<FastImage
					source={getLogo(token) as Source}
					// eslint-disable-next-line react-native/no-inline-styles
					style={[gutters.marginRight_2, { height: 24, width: 24, borderRadius: 12 }]}
				/>
				<Text style={[fonts.rubikMedium, token === network ? fonts.black : fonts.text_02]}>{token}</Text>
			</TouchableOpacity>
		);
	};

	const copyToClipboard = () => {
		triggerHapticFeedback('soft');
		Clipboard.setString(value);
		Toast.show({
			type: 'success',
			text1: 'Copied',
			text2: 'Address copied to clipboard',
			position: 'bottom',
			topOffset: insets.bottom || 16,
			text1Style: { fontFamily: 'Rubik-Medium' },
			text2Style: { fontFamily: 'Rubik-Medium' },
		});
	};

	return (
		<BlurView
			blurAmount={1}
			blurType="extraDark"
			// blurType={variant === 'dark' ? 'regular' : 'extraDark'}
			reducedTransparencyFallbackColor="white"
			style={[
				layout.itemsCenter,
				layout.fullWidth,
				layout.justifyAround,
				layout.absolute,
				layout.bottom_0,
				// backgrounds.bg_dark,
				// eslint-disable-next-line react-native/no-inline-styles
				{ paddingBottom: insets.bottom || 16, borderRadius: 16 },
			]}>
			<View style={[components.handle, gutters.marginVertical_16]} key="handle" />
			<View style={[layout.flex_1, layout.fullWidth, layout.center]}>
				<View style={[layout.w_90, layout.rowCenter, layout.gap_6, gutters.marginVertical_6]} key="enabledChains">
					{renderChip('Ethereum')}
					{renderChip('Solana')}
					{renderChip('Mina')}
				</View>
				<View style={[layout.w_60, layout.rowCenter, layout.gap_6, gutters.marginVertical_6]} key="disabledChains">
					{renderChip('Bitcoin')}
					{renderChip('Cosmos')}
				</View>
				<View style={[backgrounds.white, borders.rounded_36, gutters.padding_24, gutters.marginVertical_24]}>
					<Svg height={size} width={size}>
						<Defs>
							<ClipPath id="clip-wrapper">
								<Rect height={logoWrapperSize} width={logoWrapperSize} />
							</ClipPath>
							<ClipPath id="clip-logo">
								<Rect height={logoSize} width={logoSize} />
							</ClipPath>
						</Defs>
						<Rect fill="white" height={size} width={size} />
						{dots as ReactNode}
						<G x={logoPosition} y={logoPosition}>
							<Rect clipPath="url(#clip-wrapper)" fill="transparent" height={logoWrapperSize} width={logoWrapperSize} />
							<G x={logoMargin} y={logoMargin}>
								<Image
									height={logoSize}
									width={logoSize}
									clipPath="url(#clip-logo)"
									preserveAspectRatio="xMidYMid slice"
									// @ts-ignore
									href={getLogo(network) as string}
								/>
							</G>
						</G>
					</Svg>
				</View>
				<TouchableOpacity onPress={copyToClipboard}>
					<Text style={[fonts.rubikSemiBold, fonts.size_16, fonts.white, layout.gap_6]}>
						{abbreviateAddress(value)}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					key="share"
					onPress={() => Share.share({ message: value })}
					style={[
						components.button,
						backgrounds.ui_02,
						layout.gap_8,
						borders.w_1,
						borders.border_01,
						borders.rounded_32,
						gutters.marginTop_24,
						layout.w_60,
						layout.row,
						layout.center,
					]}>
					<Octicons name="share" size={20} color={colors.white} />
					<Text style={[components.buttonText, fonts.size_16, fonts.white]}>Share</Text>
				</TouchableOpacity>
			</View>
		</BlurView>
	);
}

export default Receive;
