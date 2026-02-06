import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
import { themes } from "../config/theme";
import { useAuth } from "../context/AuthContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [themeName, setThemeName] = useState("green");
    const theme = themes[themeName];

    // 1. Initial Load: Load saved theme from SecureStore (device preference)
    useEffect(() => {
        const loadLocalTheme = async () => {
            const saved = await SecureStore.getItemAsync("user_theme");
            if (saved && themes[saved]) {
                setThemeName(saved);
            }
        };
        loadLocalTheme();
    }, []);

    // 2. Sync with User Profile: When user logs in/updates, respect their backend theme preference
    useEffect(() => {
        if (user?.theme && themes[user.theme] && user.theme !== themeName) {
            setThemeName(user.theme);
            SecureStore.setItemAsync("user_theme", user.theme);
        }
    }, [user]);

    const setTheme = async (name) => {
        if (themes[name]) {
            setThemeName(name);
            await SecureStore.setItemAsync("user_theme", name);

            // 3. Persist to Backend if logged in
            if (user) {
                try {
                    await client.patch(`/users/${user.id}`, { theme: name });
                } catch (error) {
                    console.error("Failed to save theme to backend:", error);
                }
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
