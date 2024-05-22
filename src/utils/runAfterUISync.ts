/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const syncUI = () => new Promise(r => requestAnimationFrame(r));

export const runAfterUISync = async <T extends Function>(callback: T, syncFrames = 1) => {
	for (let i = 0; i < syncFrames; i++) {
		await syncUI();
	}
	return callback();
};
