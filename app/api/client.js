import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
// For physical devices, you must use your LAN IP (e.g., http://192.168.1.X:3000)
const DEV_API_URL = Platform.select({
    android: "http://192.168.1.7:3000/api/v1",
    ios: "http://192.168.1.7:3000/api/v1",
    default: "http://localhost:3000/api/v1",
});

const client = axios.create({
    baseURL: DEV_API_URL,
    timeout: 5000, // 5 second timeout to prevent hanging on connection issues
});

client.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
