/* eslint-disable radix */
const accountColors = [
	'blue',
	'yellow',
	'purple',
	'turquoise',
	'magenta',
	'sky',
	'orange',
	'army',
	'flamingo',
	'camel',
	'copper',
];

const alpha = (value: string, opacity: number) => {
	if (value.startsWith('#')) {
		const hex = value.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		return `rgba(${r},${g},${b},${opacity})`;
	}
	const rgb = value.split(',');
	// return `${rgb.slice(0, -1).join(',')},${opacity})`;
	return `${rgb.slice(0, 3).join(',')},${opacity})`;
};

const alphaOpaque = (value: string, opacity: number): string | null => {
	if (!value) return null;

	if (value.startsWith('#')) {
		const hex = value.replace('#', '');
		const r = 255 - opacity * (255 - parseInt(hex.substring(0, 2), 16));
		const g = 255 - opacity * (255 - parseInt(hex.substring(2, 4), 16));
		const b = 255 - opacity * (255 - parseInt(hex.substring(4, 6), 16));
		return `rgb(${r},${g},${b})`;
	}
	const rgb = value.split(',');
	const r = 255 - opacity * (255 - parseInt(rgb[0]));
	const g = 255 - opacity * (255 - parseInt(rgb[1]));
	const b = 255 - opacity * (255 - parseInt(rgb[2]));
	return `rgb(${r},${g},${b})`;
};

const themeAlpha = (color: string, lightOpacity: number, darkOpacity: number, theme: string): string | null => {
	return theme === 'dark' ? alpha(color, lightOpacity) : alpha(color, darkOpacity);
};

// Neutral Colors
const neutral = {
	'2.5': '#FAFBFC',
	'5': '#F5F6F8',
	'10': '#F0F2F5',
	'20': '#E7EAEE',
	'30': '#DCE0E5',
	'40': '#A1ABBD',
	'50': '#647084',
	'60': '#303D55',
	'70': '#202C42',
	'80': '#1B273D',
	'90': '#131D2F',
	'95': '#0D1625',
	'100': '#09101C',
};

const getAlphaColors = (baseColor: string) => {
	return {
		'opa-0': alpha(baseColor, 0),
		'opa-5': alpha(baseColor, 0.05),
		'opa-10': alpha(baseColor, 0.1),
		'opa-20': alpha(baseColor, 0.2),
		'opa-30': alpha(baseColor, 0.3),
		'opa-40': alpha(baseColor, 0.4),
		'opa-50': alpha(baseColor, 0.5),
		'opa-60': alpha(baseColor, 0.6),
		'opa-70': alpha(baseColor, 0.7),
		'opa-80': alpha(baseColor, 0.8),
		'opa-90': alpha(baseColor, 0.9),
		'opa-95': alpha(baseColor, 0.95),
	};
};

const neutral50Opa40 = alpha(neutral['50'], 0.4);
const neutral80Opa = getAlphaColors(neutral['80']);
const neutral90Opa = getAlphaColors(neutral['90']);
const neutral95Opa = getAlphaColors(neutral['95']);
const neutral100Opa = getAlphaColors(neutral['100']);
const neutral80Opa5Opaque = alphaOpaque(neutral['80'], 0.05);

const white = '#ffffff';
const whiteOpa = getAlphaColors(white);
const white70Blur = alpha(white, 0.7);
const white70BlurOpaque = alphaOpaque(white, 0.7);

const primary = {
	'50': '#4360DF',
	'60': '#354DB2',
};

const primary50Opa = getAlphaColors(primary['50']);

const success = {
	'50': '#23ADA0',
	'60': '#1C8A80',
};

const success50Opa = getAlphaColors(success['50']);
const success60Opa = getAlphaColors(success['60']);

const danger = '#E95460';
const dangerOpa40 = alpha(danger, 0.4);
const danger50 = {
	'50': '#E95460',
	'60': '#BA434D',
};

const danger50Opa = getAlphaColors(danger50['50']);
const danger60Opa = getAlphaColors(danger50['60']);

const warning = {
	'50': '#FF7D46',
	'60': '#CC6438',
};

const warning50Opa = getAlphaColors(warning['50']);

const customization = {
	blue: { 50: '#2A4AF5', 60: '#223BC4' },
	yellow: { 50: '#F6B03C', 60: '#C58D30' },
	turquoise: { 50: '#2A799B', 60: '#22617C' },
	copper: { 50: '#CB6256', 60: '#A24E45' },
	sky: { 50: '#1992D7', 60: '#1475AC' },
	camel: { 50: '#C78F67', 60: '#9F7252' },
	orange: { 50: '#FF7D46', 60: '#CC6438' },
	army: { 50: '#216266', 60: '#1A4E52' },
	flamingo: { 50: '#F66F8F', 60: '#C55972' },
	purple: { 50: '#7140FD', 60: '#5A33CA' },
	magenta: { 50: '#EC266C', 60: '#BD1E56' },
};

const networks = {
	ethereum: '#758EEB',
	mainnet: '#758EEB',
	optimism: '#E76E6E',
	arbitrum: '#6BD5F0',
	zkSync: '#9FA0FE',
	hermez: '#EB8462',
	xDai: '#3FC0BD',
	polygon: '#AD71F3',
	unknown: '#EEF2F5',
};

const socials = {
	socialLink: '#647084',
	facebook: '#1877F2',
	github: '#000000',
	instagram: '#D8408E0F',
	lens: '#00501E',
	linkedin: '#0B86CA',
	mirror: '#3E7EF7',
	opensea: '#2081E2',
	pinterest: '#CB2027',
	rarible: '#FEDA03',
	snapchat: '#FFFC00',
	spotify: '#00DA5A',
	superrare: '#000000',
	tumblr: '#37474F',
	twitch: '#673AB7',
	twitter: '#262E35',
	youtube: '#FF3000',
};

const colorsMap = {
	primary,
	beige: { 50: '#CAAE93', 60: '#AA927C' },
	green: { 50: '#5BCC95', 60: '#4CAB7D' },
	brown: { 50: '#99604D', 60: '#805141' },
	red: { 50: '#F46666', 60: '#CD5656' },
	indigo: { 50: '#496289', 60: '#3D5273' },
	danger: danger50,
	success,
	warning,
	...customization,
	...networks,
	...socials,
};

const hexString = (s: string): boolean => {
	return s.startsWith('#');
};

const getFromColorsMap = (color: string, suffix: number): string | undefined => {
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const colorWithoutSuffix = colorsMap[color];
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const resolvedColor = hexString(colorWithoutSuffix);
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
	return resolvedColor ? colorWithoutSuffix : colorsMap[color][suffix];
};

const resolveColor = (color: string, theme: string, opacity?: number): string | null => {
	const suffix = !color.startsWith('#') && (opacity || theme === 'light') ? 50 : 60;
	let resolvedColor = color;

	if (!hexString(color)) {
		resolvedColor = getFromColorsMap(color, suffix) || color;
	}

	return opacity ? alpha(resolvedColor, opacity) : resolvedColor;
};

const resolveHexColor = (color: string, suffix: number): string | undefined => {
	return hexString(color) ? color : getFromColorsMap(color, suffix);
};

type Theme = {
	positive01: string;
	positive02: string;
	positive03: string;
	negative01: string;
	negative02: string;
	warning01: string;
	warning02: string;
	interactive01: string;
	interactive02: string;
	interactive03: string;
	interactive04: string;
	uiBackground: string;
	ui01: string;
	ui02: string;
	ui03: string;
	text01: string;
	text02: string;
	text03: string;
	text04: string;
	text05: string;
	icon01: string;
	icon02: string;
	icon03: string;
	icon04: string;
	icon05: string;
	shadow01: string;
	backdrop: string;
	border01: string;
	border02: string;
	highlight: string;
	blurredBg: string;
};

export const lightTheme: Theme = {
	positive01: 'rgba(68,208,88,1)',
	positive02: 'rgba(78,188,96,0.1)',
	positive03: 'rgba(78,188,96,1)',
	negative01: 'rgba(255,45,85,1)',
	negative02: 'rgba(255,45,85,0.1)',
	warning01: 'rgba(255, 202, 15, 1)',
	warning02: 'rgba(255, 202, 15, 0.1)',
	interactive01: 'rgba(67,96,223,1)',
	interactive02: 'rgba(236,239,252,1)',
	interactive03: 'rgba(255,255,255,0.1)',
	interactive04: 'rgba(147,155,161,1)',
	uiBackground: 'rgba(255,255,255,1)',
	ui01: 'rgba(238,242,245,1)',
	ui02: 'rgba(0,0,0,0.1)',
	ui03: 'rgba(0,0,0,0.86)',
	text01: 'rgba(0,0,0,1)',
	text02: 'rgba(147,155,161,1)',
	text03: 'rgba(255,255,255,0.7)',
	text04: 'rgba(67,96,223,1)',
	text05: 'rgba(255,255,255,1)',
	icon01: 'rgba(0,0,0,1)',
	icon02: 'rgba(147,155,161,1)',
	icon03: 'rgba(255,255,255,0.4)',
	icon04: 'rgba(67,96,223,1)',
	icon05: 'rgba(255,255,255,1)',
	shadow01: 'rgba(0,9,26,0.12)',
	backdrop: 'rgba(0,0,0,0.4)',
	border01: 'rgba(238,242,245,1)',
	border02: 'rgba(67, 96, 223, 0.1)',
	highlight: 'rgba(67,96,223,0.4)',
	blurredBg: 'rgba(255,255,255,0.3)',
};

export const darkTheme: Theme = {
	positive01: 'rgba(68,208,88,1)',
	positive02: 'rgba(78,188,96,0.1)',
	positive03: 'rgba(78,188,96,1)',
	negative01: 'rgba(252,95,95,1)',
	negative02: 'rgba(252,95,95,0.1)',
	warning01: 'rgba(255, 202, 15, 1)',
	warning02: 'rgba(255, 202, 15, 0.1)',
	interactive01: 'rgba(97,119,229,1)',
	interactive02: 'rgba(35,37,47,1)',
	interactive03: 'rgba(255,255,255,0.1)',
	interactive04: 'rgba(131,140,145,1)',
	uiBackground: 'rgba(20,20,20,1)',
	ui01: 'rgba(37,37,40,1)',
	ui02: 'rgba(0,0,0,0.1)',
	ui03: 'rgba(0,0,0,0.86)',
	text01: 'rgba(255,255,255,1)',
	text02: 'rgba(131,140,145,1)',
	text03: 'rgba(255,255,255,0.7)',
	text04: 'rgba(97,119,229,1)',
	text05: 'rgba(20,20,20,1)',
	icon01: 'rgba(255,255,255,1)',
	icon02: 'rgba(131,140,145,1)',
	icon03: 'rgba(255,255,255,0.4)',
	icon04: 'rgba(97,119,229,1)',
	icon05: 'rgba(20,20,20,1)',
	shadow01: 'rgba(0,0,0,0.75)',
	backdrop: 'rgba(0,0,0,0.4)',
	border01: 'rgba(37,37,40,1)',
	border02: 'rgba(97,119,229,0.1)',
	highlight: 'rgba(67,96,223,0.4)',
	blurredBg: 'rgba(0,0,0,0.3)',
};

const oldColorsMappingLight = {
	mentionedBackground: '#def6fc',
	mentionedBorder: '#b8ecf9',
	pinBackground: '#FFEECC',
};

const oldColorsMappingDark = {
	mentionedBackground: '#2a4046',
	mentionedBorder: '#2a4046',
	pinBackground: '#34232B',
};

export const oldColorsMappingThemes = {
	dark: oldColorsMappingDark,
	light: oldColorsMappingLight,
};

export {
	accountColors,
	alpha,
	alphaOpaque,
	themeAlpha,
	neutral,
	neutral50Opa40,
	neutral80Opa,
	neutral90Opa,
	neutral95Opa,
	neutral100Opa,
	neutral80Opa5Opaque,
	white,
	whiteOpa,
	white70Blur,
	white70BlurOpaque,
	primary,
	primary50Opa,
	success,
	success50Opa,
	success60Opa,
	danger,
	dangerOpa40,
	danger50,
	danger50Opa,
	danger60Opa,
	warning,
	warning50Opa,
	customization,
	networks,
	socials,
	colorsMap,
	hexString,
	getFromColorsMap,
	resolveColor,
	resolveHexColor,
};
