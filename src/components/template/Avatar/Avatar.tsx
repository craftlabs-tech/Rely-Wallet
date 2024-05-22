import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { buildSVG } from '@nouns/sdk';
import { SvgXml } from 'react-native-svg';
import { ImageData, getNounData, getRandomNounSeed } from '@nouns/assets';
import { useTheme } from '@/theme';

import type { RootState } from '@/store';

function Avatar({ address }: { address: string }) {
	const { colors, components } = useTheme();

	const evmWallet = useSelector((s: RootState) => s.wallet.evm.find(w => w.address === address));

	const { palette } = ImageData;
	const { parts, background } = getNounData(getRandomNounSeed());

	const svgBinary = buildSVG(parts, palette, background);

	return evmWallet && evmWallet.ens && evmWallet.ens.avatarUrl ? (
		<Image source={{ uri: evmWallet.ens.avatarUrl }} style={[components.avatar, { borderColor: colors.ui_01 }]} />
	) : (
		// eslint-disable-next-line react-native/no-inline-styles
		<View style={[components.avatar, { borderColor: colors.ui_01, overflow: 'hidden' }]}>
			<SvgXml xml={svgBinary} height={48} width={48} />
		</View>
	);
}

export default Avatar;
