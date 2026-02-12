import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const storage = {
    getItem: async (key) => {
        if (isWeb) {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(key);
            }
            return null;
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },
    setItem: async (key, value) => {
        if (isWeb) {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, value);
            }
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    deleteItem: async (key) => {
        if (isWeb) {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
            }
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};

export default storage;
