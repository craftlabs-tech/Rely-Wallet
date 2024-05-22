/* eslint-disable react/style-prop-object */
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

import { ImageVariant } from '@/components/atoms';
// import { Brand } from '@/components/molecules';
import { useTheme } from '@/theme';
import { fetchOne } from '@/services/users';

import { isImageSourcePropType } from '@/types/guards/image';

import SendImage from '@/theme/assets/images/send.png';
import ColorsWatchImage from '@/theme/assets/images/colorswatch.png';
import TranslateImage from '@/theme/assets/images/translate.png';
import QRCode from 'react-native-qrcode-skia';
import { BlurMask, DashPathEffect, LinearGradient, vec } from '@shopify/react-native-skia';

function Example() {
	const navigation = useNavigation();
	const { t } = useTranslation(['example', 'welcome']);

	const { colors, variant, changeTheme, layout, gutters, fonts, components, backgrounds } = useTheme();

	const [currentId, setCurrentId] = useState(-1);

	const { isSuccess, data, isFetching } = useQuery({
		queryKey: ['example', currentId],
		queryFn: () => {
			return fetchOne(currentId);
		},
		enabled: currentId >= 0,
	});

	useEffect(() => {
		if (isSuccess) {
			Alert.alert(t('example:welcome', data.name));
		}
	}, [isSuccess, data]);

	const onChangeTheme = () => {
		changeTheme(variant === 'default' ? 'dark' : 'default');
	};

	const onChangeLanguage = (lang: 'fr' | 'en') => {
		console.log('Changing language to', lang);
		void i18next.changeLanguage(lang);
	};

	if (
		!isImageSourcePropType(SendImage) ||
		!isImageSourcePropType(ColorsWatchImage) ||
		!isImageSourcePropType(TranslateImage)
	) {
		throw new Error('Image source is not valid');
	}

	return (
		<ScrollView>
			{/* <View style={[layout.justifyCenter, layout.itemsCenter, gutters.marginTop_96]}>
				<View style={[layout.relative, backgrounds.gray100, components.circle250]} />

				<View style={[layout.absolute, gutters.paddingTop_96]}>
					<Brand height={300} width={300} />
				</View>
			</View> */}

			<QRCode value="https://patreon.com/reactiive" size={200} strokeWidth={1}>
				<LinearGradient start={vec(50, 50)} end={vec(200, 200)} colors={['#52e5ff', '#513eff']} />
				{/* <SweepGradient c={vec(100, 100)} colors={['cyan', 'magenta', 'yellow', 'cyan']} /> */}
				{/* <RadialGradient c={vec(100, 100)} r={100} colors={['#52e5ff', '#513eff']} /> */}
				{/* <TwoPointConicalGradient start={vec(128, 128)} startR={128} end={vec(128, 16)} endR={16} colors={['blue', 'yellow']} /> */}
				{/* <Blur blur={1} mode="clamp" /> */}
				<BlurMask blur={4} style="solid" />
				<DashPathEffect intervals={[4, 4]} />
				{/* <DashPathEffect intervals={[3.5, 0.5]} /> */}
				{/* <DashPathEffect intervals={[12, 1]} /> */}
				{/* <DiscretePathEffect length={8} deviation={4} /> */}
				{/* <CornerPathEffect r={64} /> */}
				{/* <Turbulence freqX={0.05} freqY={0.05} octaves={4} /> */}
				{/* <FractalNoise freqX={0.05} freqY={0.05} octaves={4} /> */}
			</QRCode>

			<View style={[gutters.paddingHorizontal_32, gutters.marginTop_48]}>
				<View style={[gutters.marginTop_48]}>
					<Text style={[fonts.size_32, fonts.gray800, fonts.bold]}>{t('welcome:title')}</Text>
					<Text style={[fonts.gray400, fonts.bold, fonts.size_24, gutters.marginBottom_32]}>
						{t('welcome:subtitle')}
					</Text>
					<Text style={[fonts.size_16, fonts.gray200, gutters.marginBottom_48]}>{t('welcome:description')}</Text>
				</View>

				<View style={[layout.row, layout.justifyBetween, layout.fullWidth, gutters.marginTop_16]}>
					<TouchableOpacity
						testID="fetch-user-button"
						style={[components.buttonCircle, gutters.marginBottom_16]}
						onPress={() => navigation.navigate('scan')}>
						{isFetching ? (
							<ActivityIndicator />
						) : (
							<ImageVariant source={SendImage} style={{ tintColor: colors.purple500 }} />
						)}
					</TouchableOpacity>

					<TouchableOpacity
						testID="fetch-user-button"
						style={[components.buttonCircle, gutters.marginBottom_16]}
						onPress={() => setCurrentId(Math.ceil(Math.random() * 10 + 1))}>
						{isFetching ? (
							<ActivityIndicator />
						) : (
							<ImageVariant source={SendImage} style={{ tintColor: colors.purple500 }} />
						)}
					</TouchableOpacity>

					<TouchableOpacity
						testID="change-theme-button"
						style={[components.buttonCircle, gutters.marginBottom_16]}
						onPress={() => onChangeTheme()}>
						<ImageVariant source={ColorsWatchImage} style={{ tintColor: colors.purple500 }} />
					</TouchableOpacity>

					<TouchableOpacity
						testID="change-language-button"
						style={[components.buttonCircle, gutters.marginBottom_16]}
						onPress={() => onChangeLanguage(i18next.language === 'fr' ? 'en' : 'fr')}>
						<ImageVariant source={TranslateImage} style={{ tintColor: colors.purple500 }} />
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
}

export default Example;
