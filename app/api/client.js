import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const TIMEOUT_MS = 10000;

// Configuration for API host
const getApiConfig = () => {
  const extra = Constants?.expoConfig?.extra;
  const host = extra?.EXPO_PUBLIC_API_HOST || extra?.host || '192.168.1.4';

  // In development, prioritize local network interaction
  if (__DEV__) {
    return {
      baseURL: `http://${host}:3000/api/v1`,
      isDev: true
    };
  }

  return {
    baseURL: "https://YOUR_PRODUCTION_DOMAIN/api/v1", // TODO: Update with production URL
    isDev: false
  };
};

const { baseURL } = getApiConfig();

const client = axios.create({
  baseURL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Attach Auth Token
client.interceptors.request.use(async (config) => {
  // Public endpoints bypass
  if (config.url?.includes('/auth/logout')) {
    return config;
  }

  try {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token && token !== 'mock.jwt.token') {
      config.headers.Authorization = `Bearer ${token}`;

      if (__DEV__) {
        console.debug(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
      }
    } else if (__DEV__) {
      console.debug(`[API Request] No auth token for: ${config.url}`);
    }
  } catch (err) {
    console.error("[API Error] Failed to retrieve auth token:", err.message);
  }
  return config;
});

// Response Interceptor: Error Handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with non-2xx code
      console.error(`[API Error ${error.response.status}]`, error.response.data || error.message);

      if (error.response.status === 401) {
        // TODO: Trigger global logout or token refresh if implemented
        console.warn("Unauthorized access - token might be expired");
      }
    } else if (error.request) {
      // Request made but no response
      console.error("[API Error] No response received:", error.request);
    } else {
      // Request setup error
      console.error("[API Error] Request setup failed:", error.message);
    }
    return Promise.reject(error);
  }
);

export default client;
