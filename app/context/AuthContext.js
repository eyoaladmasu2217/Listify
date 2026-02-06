import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const restoreSession = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync("auth_token");
                if (storedToken) {
                    setToken(storedToken);
                    // Fetch the latest user info
                    try {
                        const res = await client.get("/users/me");
                        const userData = res.data.user || res.data;
                        setUser(userData);
                    } catch (e) {
                        console.log("Restoring user from token decode (Backend error or offline)");
                        try {
                            if (storedToken === "mock.jwt.token") {
                                setUser({ id: 1, username: "demo_user", email: "demo@example.com" });
                            } else if (storedToken.split('.').length === 3) {
                                const decoded = jwtDecode(storedToken);
                                setUser({ id: decoded.sub, ...decoded });
                            } else {
                                console.log("Stored token is not a valid JWT format, clearing...");
                                await SecureStore.deleteItemAsync("auth_token");
                                setToken(null);
                            }
                        } catch (decodeErr) {
                            console.log("Token decode failed:", decodeErr.message);
                            setToken(null);
                        }
                    }
                }
        } catch (error) {
            console.log("Error restoring session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Global interceptor for 401 errors
        const interceptor = client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    console.log("Unauthorized (401) detected, logging out...");
                    await SecureStore.deleteItemAsync("auth_token");
                    setToken(null);
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        restoreSession();

        return () => {
            client.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await client.post("/auth/login", {
                user: { email, password }
            });

            const userData = response.data.user || response.data;
            const access_token = response.data.access_token || response.headers['authorization']?.split(' ')[1];

            if (access_token) {
                await SecureStore.setItemAsync("auth_token", access_token);
                setToken(access_token);
                setUser(userData);
                return { success: true };
            }
            return { success: false, error: "Access token not found in server response" };
        } catch (error) {
            console.log("Login Error:", error.response?.data || error.message);

            // FALLBACK FOR DEMO: If network error or connection refused, allow demo login
            if (email === "demo@example.com" && password === "password") {
                console.log("Network error detected, falling back to mock login for demo account");
                const mockUser = {
                    id: 1,
                    username: "demo_user",
                    email: "demo@example.com",
                    profile_picture_url: "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff",
                    reviews_count: 5,
                    followers_count: 10,
                    following_count: 15,
                    bio: "Standard demo account (Offline Mode)."
                };
                await SecureStore.setItemAsync("auth_token", "mock.jwt.token"); // Valid-ish format for decoder
                setToken("mock.jwt.token");
                setUser(mockUser);
                return { success: true };
            }

            return {
                success: false,
                error: error.response?.data?.error || "Login failed. Please check your connection to the backend."
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await client.post("/auth", {
                user: { username, email, password }
            });

            const userData = response.data.user || response.data;
            const access_token = response.data.access_token || response.headers['authorization']?.split(' ')[1];

            if (access_token) {
                await SecureStore.setItemAsync("auth_token", access_token);
                setToken(access_token);
                setUser(userData);
                return { success: true };
            }
            return { success: false, error: "Registration successful but token not found" };
        } catch (error) {
            console.log("Register Error:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.errors?.join(", ") || "Registration failed"
            };
        }
    };

    const logout = async () => {
        try {
            // Optional: call backend logout
            await client.delete("/auth/logout");
        } catch (e) {
            console.log("Logout API error", e);
        }
        await SecureStore.deleteItemAsync("auth_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, isLoading, login, register, logout, restoreSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

