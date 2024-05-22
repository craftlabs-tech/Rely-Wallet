import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'rely', encryptionKey: 'rely' });

/**
 * Redux state is stored in MMKV and user's password is stored in keychain.
 * MMKV is encrypted with the user's password to ensure data is secure.
 * @param password
 */
export const encrypt = (password: string) => {
	storage.recrypt(password);
};
