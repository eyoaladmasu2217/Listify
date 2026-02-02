import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode"; // Fix import for named export
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored token on launch
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("auth_token");
                if (storedToken) {
                    // Optional: check expiry
                    const decoded = jwtDecode(storedToken);
                    // If expired, logging out... (omitted for MVP)
                    setToken(storedToken);
                    // Fetch user data
                    try {
                        // We'll set the token in the client for this request manually if interceptor isn't fast enough, 
                        // but usually interceptor handles it if we await.
                        // Actually, interceptor reads from SecureStore, so we are good.
                        // For safety, let's just decode the token or fetch /users/me later.
                        setUser({ ...decoded, id: decoded.sub }); // Basic restoring
                    } catch (e) {
                        console.log("Failed to restore user from token", e);
                    }
                }
            } catch (error) {
                console.log("Error restoring session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (email, password) => {
        // MOCK LOGIN FOR DEMO
        console.log("Mock Login Triggered");
        const mockUser = {
            id: 1,
            username: "demo_user",
            email: email,
            profile_picture_url: "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff",
            reviews_count: 12,
            followers_count: 50,
            following_count: 34,
            bio: "Just a demo user browsing around."
        };

        await SecureStore.setItemAsync("auth_token", "mock-token-123");
        setToken("mock-token-123");
        setUser(mockUser);
        return { success: true };
    };

    const register = async (username, email, password) => {
        // MOCK REGISTER FOR DEMO
        const mockUser = {
            id: 1,
            username: username,
            email: email,
            profile_picture_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
            reviews_count: 0,
            followers_count: 0,
            following_count: 0,
            bio: "New user."
        };

        await SecureStore.setItemAsync("auth_token", "mock-token-123");
        setToken("mock-token-123");
        setUser(mockUser);
        return { success: true };
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("auth_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
