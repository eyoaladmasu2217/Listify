import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { themes } from "../config/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState("green");
    const theme = themes[themeName];

    useEffect(() => {
        // Load saved theme
        const loadTheme = async () => {
            const saved = await SecureStore.getItemAsync("user_theme");
            if (saved && themes[saved]) {
                setThemeName(saved);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (name) => {
        if (themes[name]) {
            setThemeName(name);
            await SecureStore.setItemAsync("user_theme", name);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
