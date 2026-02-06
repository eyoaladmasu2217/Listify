import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Get API host from environment or use default
// Configure in app.json: { "extra": { "EXPO_PUBLIC_API_HOST": "192.168.1.100" } }
const LOCAL_API_HOST = Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_HOST || 
                          Constants?.expoConfig?.extra?.host || 
                          '192.168.129.188';

// Determine base URL
const getBaseURL = () => {
  if (__DEV__) {
    // For physical devices, use local IP instead of localhost
    return `http://${LOCAL_API_HOST}:3000/api/v1`;
  }
  return "https://YOUR_PRODUCTION_DOMAIN/api/v1";
};

const client = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// Attach token for all environments
client.interceptors.request.use(async (config) => {
  // Skip auth header for logout endpoint
  if (config.url?.includes('/auth/logout')) {
    return config;
  }
  
  try {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token && token !== 'mock.jwt.token') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Sending request to:", config.baseURL + config.url);
      console.log("Token (first 50 chars):", token.slice(0, 50) + "...");
    } else {
      console.log("No valid auth token found for:", config.url);
    }
  } catch (err) {
    console.log("Error getting auth token:", err.message);
  }
  return config;
});

// Log response errors for debugging
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default client;
