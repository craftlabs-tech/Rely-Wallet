import chroma from 'chroma-js';

export const getRandomColor = (threshold?: number): string => {
	const getComponent = (): number => Math.floor(Math.random() * 256);
	const componentToHex = (c: number): string => c.toString(16).padStart(2, '0');

	if (threshold !== undefined) {
		const getNonBlackComponent = (): number => Math.max(Math.floor(Math.random() * (256 - threshold)) + threshold, 0);
		const r: number = getNonBlackComponent();
		const g: number = getNonBlackComponent();
		const b: number = getNonBlackComponent();
		return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
	}
	const r: number = getComponent();
	const g: number = getComponent();
	const b: number = getComponent();
	return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const alpha = (color: string, alphaValue = 1) => `rgba(${chroma(color).rgb()},${alphaValue})`;
