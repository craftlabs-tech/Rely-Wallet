import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { formatCurrency } from '@/utils/wallet';
import { useTheme } from '@/theme';

const Item = React.memo(({ token }: { token: string }) => {
	const { components, fonts, layout, gutters } = useTheme();

	return (
		<View style={[layout.row, layout.fullWidth, gutters.paddingVertical_8, layout.justifyBetween]}>
			<View style={[layout.row, layout.center]}>
				<Image
					style={[components.avatar]}
					source={{
						uri: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
					}}
				/>
				<View style={[layout.justifyCenter, layout.itemsStart, gutters.paddingHorizontal_8]}>
					<Text style={[gutters.paddingVertical_2, fonts.w_600, fonts.text_01]}>{token}</Text>
					<Text style={[gutters.paddingVertical_2, fonts.w_400, fonts.text_02]}>0.34 ETH</Text>
				</View>
			</View>

			<View style={[layout.justifyCenter, layout.itemsEnd, gutters.paddingHorizontal_8]}>
				<Text style={[gutters.paddingVertical_2, fonts.w_600, fonts.text_01]}>{formatCurrency(44.542)}</Text>
				<Text style={[gutters.paddingVertical_2, fonts.w_400, fonts.negative_01]}>-13%</Text>
			</View>
		</View>
	);
});

function NFTs() {
	const { borders, backgrounds, colors, fonts, layout, gutters } = useTheme();

	return (
		<View>
			<FlatList
				data={['Ethereum', 'USDT', 'Arbitrum']}
				keyExtractor={item => item}
				renderItem={({ item }) => <Item token={item} />}
				ListFooterComponent={
					<View style={[layout.row, layout.justifyBetween, gutters.paddingVertical_8]}>
						<TouchableOpacity
							style={[
								layout.row,
								layout.center,
								borders.rounded_16,
								gutters.paddingVertical_4,
								gutters.paddingHorizontal_12,
								backgrounds.interactive_02,
							]}>
							<Text style={[fonts.w_600, fonts.size_16, fonts.text_02]}>All</Text>
							<Entypo name="chevron-right" size={20} color={colors.text_02} />
						</TouchableOpacity>
					</View>
				}
			/>
		</View>
	);
}

export default NFTs;
