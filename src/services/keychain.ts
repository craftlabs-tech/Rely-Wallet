import * as Keychain from 'react-native-keychain';

export enum ServiceKey {
	password = 'password',
	mnemonic = 'mnemonic',
	seedBuffer = 'seedBuffer',
}

export const getSupportedBiometryType = async (): Promise<Keychain.BIOMETRY_TYPE | null> => {
	try {
		const biometryType = await Keychain.getSupportedBiometryType();
		return biometryType;
	} catch (error) {
		console.log(error, 'error');
		throw new Error('Failed to get supported biometry type');
	}
};

export const getFromKeychain = async (key: string, authenticationPrompt?: Keychain.AuthenticationPrompt) => {
	try {
		const credentials = await Keychain.getGenericPassword({ service: key, authenticationPrompt });
		if (credentials) {
			return credentials.password;
		}
		return credentials;
	} catch (error) {
		console.log(error, 'error');
		throw new Error('Failed to get from keychain');
	}
};

export const setInKeychain = async (key: string, value: string, prompt?: Keychain.AuthenticationPrompt) => {
	try {
		const options: Keychain.Options = {
			service: key,
			accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
			accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
			securityLevel: (await Keychain.getSecurityLevel()) ?? undefined,
			authenticationPrompt: prompt,
		};

		const result = await Keychain.setGenericPassword(key, value, options);
		return result;
	} catch (error) {
		console.log(error, 'error');
		throw new Error('Failed to set in keychain');
	}
};

export const removeFromKeychain = async (service: string) => {
	try {
		const credentials = await Keychain.resetGenericPassword({ service });
		return credentials;
	} catch (error) {
		console.log(error, 'error');
		throw new Error('Failed to remove from keychain');
	}
};

export const resetAllKeychain = async () => {
	return Promise.all(Object.values(ServiceKey).map(service => Keychain.resetGenericPassword({ service })));
};
