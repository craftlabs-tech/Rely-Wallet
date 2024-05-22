import { ViewStyle } from 'react-native';

export default {
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	col: {
		flexDirection: 'column',
	},
	colCenter: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	colReverse: {
		flexDirection: 'column-reverse',
	},
	wrap: {
		flexWrap: 'wrap',
	},
	row: {
		flexDirection: 'row',
	},
	rowCenter: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rowReverse: {
		flexDirection: 'row-reverse',
	},
	itemsCenter: {
		alignItems: 'center',
	},
	itemsStart: {
		alignItems: 'flex-start',
	},
	itemsStretch: {
		alignItems: 'stretch',
	},
	itemsEnd: {
		alignItems: 'flex-end',
	},
	justifyCenter: {
		justifyContent: 'center',
	},
	justifyAround: {
		justifyContent: 'space-around',
	},
	justifyBetween: {
		justifyContent: 'space-between',
	},
	justifyEnd: {
		justifyContent: 'flex-end',
	},
	justifyStart: {
		justifyContent: 'flex-start',
	},
	selfCenter: {
		alignSelf: 'center',
	},
	/* Sizes Layouts */
	flex_1: {
		flex: 1,
	},
	flex_2: {
		flex: 2,
	},
	flex_3: {
		flex: 3,
	},
	flexGrow_0: {
		flexGrow: 0,
	},
	fullWidth: {
		width: '100%',
	},
	w_90: {
		width: '90%',
	},
	w_80: {
		width: '80%',
	},
	w_70: {
		width: '70%',
	},
	w_60: {
		width: '60%',
	},
	w_50: {
		width: '50%',
	},
	fullHeight: {
		height: '100%',
	},
	/* Positions */
	relative: {
		position: 'relative',
	},
	absolute: {
		position: 'absolute',
	},
	top_0: {
		top: 0,
	},
	bottom_0: {
		bottom: 0,
	},
	left_0: {
		left: 0,
	},
	right_0: {
		right: 0,
	},
	z1: {
		zIndex: 1,
	},
	z10: {
		zIndex: 10,
	},
	opacity_50: {
		opacity: 0.5,
	},
	opacity_60: {
		opacity: 0.6,
	},
	opacity_75: {
		opacity: 0.75,
	},
	opacity_80: {
		opacity: 0.8,
	},
	opacity_90: {
		opacity: 0.9,
	},
	opacity_100: {
		opacity: 1,
	},
	gap_2: {
		gap: 2,
	},
	gap_4: {
		gap: 4,
	},
	gap_6: {
		gap: 6,
	},
	gap_8: {
		gap: 8,
	},
	gap_10: {
		gap: 10,
	},
	gap_12: {
		gap: 12,
	},
	gap_16: {
		gap: 16,
	},
	gap_24: {
		gap: 24,
	},
	gap_32: {
		gap: 32,
	},
	overflowHidden: {
		overflow: 'hidden',
	},
} as const satisfies Record<string, ViewStyle>;
