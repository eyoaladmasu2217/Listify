import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LogoTitle from "./components/LogoTitle";
import { useTheme } from "./context/ThemeContext";

export default function ForgotPasswordScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                "Reset Link Sent",
                "If an account exists with this email, you will receive a password reset link shortly.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.header}>
                <LogoTitle fontSize={40} color={theme.text} style={{ marginBottom: 20 }} />
                <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Enter your email address and we'll send you a link to reset your password.
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { color: theme.text }]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: theme.primary }]}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: "center" },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center", lineHeight: 22 },
    inputContainer: { backgroundColor: "#1A1A1A", height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 25, flexDirection: "row", alignItems: "center" },
    input: { flex: 1, borderWidth: 0, fontSize: 16 },
    resetButton: { height: 55, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    resetButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
});
