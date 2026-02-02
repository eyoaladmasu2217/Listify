import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LogoTitle from "./components/LogoTitle";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();
    const { theme } = useTheme();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const result = await register(username, email, password);
        setLoading(false);

        if (!result.success) {
            Alert.alert("Registration Failed", result.error || "Something went wrong");
        }
    };

    return (


        // ...
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={{ marginBottom: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 34, // Match LogoTitle default
                    color: theme.text,
                    fontWeight: "600",
                    fontFamily: "serif",
                    fontStyle: "italic",
                    marginRight: 8 // Space between Join and Logo
                }}>Welcome to</Text>
                <LogoTitle fontSize={38} color={theme.text} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { color: theme.text }]}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { color: theme.text }]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { color: theme.text }]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkButton}>
                <Text style={[styles.linkText, { color: theme.primary }]}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: "center" },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 40 },
    inputContainer: { backgroundColor: "#1A1A1A", height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, flexDirection: "row", alignItems: "center" },
    input: { flex: 1, borderWidth: 0, fontSize: 16 },
    button: { height: 55, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
    buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
    linkButton: { marginTop: 20, alignItems: "center" },
    linkText: { fontSize: 14, fontWeight: "500" },
});
