import { Stack } from "expo-router";
import Toast from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider, useToast } from "./context/ToastContext";

function ToastWrapper() {
    const { toast } = useToast();
    return toast ? <Toast /> : null;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                    <ToastWrapper />
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
