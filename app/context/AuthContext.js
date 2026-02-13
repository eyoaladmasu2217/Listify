import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

// Get Platform safely - falls back to 'web' if undefined
const getPlatformOS = () => {
  try {
    const ReactNative = require('react-native');
    return ReactNative.Platform?.OS || 'web';
  } catch (e) {
    return 'web';
  }
};

// Detect if running in web browser
const platformOS = getPlatformOS();
const isWeb = platformOS === 'web';

// Get Constants safely
let expoConfig = null;
try {
  expoConfig = require('expo-constants').expoConfig || null;
} catch (e) {
  // expo-constants not available
}

// Force real API login for testing (set true to test with real backend)
// Configure in app.json: { "extra": { "forceRealLogin": true } }
const FORCE_REAL_LOGIN = expoConfig?.extra?.forceRealLogin === true ||
  expoConfig?.extra?.EXPO_FORCE_REAL_LOGIN === 'true';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = async () => {
    try {
      if (isWeb && !FORCE_REAL_LOGIN) {
        // Web demo user (unless FORCE_REAL_LOGIN is true)
        setUser({
          id: 1,
          username: "demo_user",
          email: "demo@example.com",
          profile_picture_url: "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff",
          reviews_count: 5,
          followers_count: 10,
          following_count: 15,
          bio: "Demo user for web testing."
        });
        setToken("mock.jwt.token");
        console.log("Web mode - using mock user");
      } else {
        // Mobile / Expo OR forced real login
        const storedToken = await SecureStore.getItemAsync("auth_token");
        console.log("Mobile mode - restoring session, found token:", storedToken ? "yes" : "no");

        if (storedToken) {
          // Check if token is a mock/invalid token and clear it
          if (storedToken === 'mock.jwt.token' || !storedToken.includes('.')) {
            console.log("Invalid token detected, clearing...");
            await SecureStore.deleteItemAsync("auth_token");
            setIsLoading(false);
            return;
          }

          setToken(storedToken);
          try {
            const res = await client.get("/users/me");
            console.log("User restored from API:", res.data);
            setUser(res.data.user || res.data);
          } catch (error) {
            console.log("Failed to restore user from API:", error.response?.status);
            // Fallback to decoding token directly
            try {
              const decoded = jwtDecode(storedToken);
              console.log("Decoded token:", decoded);
              setUser({ id: decoded.sub, ...decoded });
            } catch (decodeError) {
              console.log("Failed to decode token, clearing...");
              await SecureStore.deleteItemAsync("auth_token");
            }
          }
        }
      }
    } catch (error) {
      console.log("Error restoring session:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email, password) => {
    if (isWeb && !FORCE_REAL_LOGIN) {
      // Web: demo login (unless FORCE_REAL_LOGIN is true)
      setUser({
        id: 1,
        username: "demo_user",
        email: "demo@example.com",
        profile_picture_url: "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff",
        reviews_count: 5,
        followers_count: 10,
        following_count: 15,
        bio: "Demo user for web testing."
      });
      setToken("mock.jwt.token");
      return { success: true };
    }

    // Mobile / Expo login OR forced real login - use real API
    try {
      console.log("Attempting mobile login for:", email);
      const response = await client.post("/auth/login", {
        user: { email, password }
      });

      console.log("Login response status:", response.status);
      console.log("Login response data:", response.data);

      const { access_token, user: userData } = response.data;

      if (access_token) {
        console.log("Login successful, token received:", access_token.slice(0, 50) + "...");
        await SecureStore.setItemAsync("auth_token", access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true };
      }

      console.log("Login response missing access_token:", response.data);
      return { success: false, error: "Token missing in response" };
    } catch (error) {
      console.log("Login Error:", error.response?.status, error.response?.data || error.message);
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed - check your credentials";
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    // Clear token from storage FIRST to prevent interceptor from sending old token
    await SecureStore.deleteItemAsync("auth_token");
    setToken(null);
    setUser(null);

    if (!isWeb || FORCE_REAL_LOGIN) {
      try {
        // Logout endpoint - clear token first so no auth header is sent
        // Since we're not using warden-jwt_auth token storage, just return success
        await client.delete("/auth/logout");
      } catch (e) {
        // Ignore errors - logout is successful when token is cleared
        console.log("Logout API call result:", e.response?.status || e.message);
      }
    }
  };

  const register = async (username, email, password) => {
    if (isWeb && !FORCE_REAL_LOGIN) {
      // Web demo registration
      const mockUser = {
        id: Date.now(),
        username,
        email,
        profile_picture_url: "https://ui-avatars.com/api/?name=" + username + "&background=1DB954&color=fff",
        reviews_count: 0,
        followers_count: 0,
        following_count: 0,
        bio: "New user"
      };
      setUser(mockUser);
      setToken("mock.jwt.token");
      return { success: true };
    }

    // Mobile / Expo registration - use real API
    try {
      console.log("Attempting registration for:", email);
      // Devise registration endpoint is /auth (not /auth/register)
      const response = await client.post("/auth", {
        user: { username, email, password }
      });

      console.log("Registration response status:", response.status);
      console.log("Registration response data:", response.data);

      // After registration, auto-login
      const { access_token, user: userData } = response.data;

      if (access_token) {
        console.log("Registration successful, auto-login");
        await SecureStore.setItemAsync("auth_token", access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true };
      }

      return { success: false, error: "Registration succeeded but no token received" };
    } catch (error) {
      console.log("Registration Error:", error.response?.status, error.response?.data || error.message);
      const errorMessage = error.response?.data?.status?.message ||
        error.response?.data?.error ||
        error.response?.data?.full_errors?.[0] ||
        "Registration failed";
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
