import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LogoTitle from "./components/LogoTitle";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { theme, setTheme, themeName } = useTheme();

  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validation removed for demo
    // if (!email || !password) { ... }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
    }
  };

  return (


    // ... inside the component
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LogoTitle fontSize={60} color={theme.text} style={{ marginBottom: 40 }} />

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          style={[styles.input, { color: theme.text }]}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.forgot, { color: theme.primary }]}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.linkButton}>
        <Text style={[styles.linkText, { color: theme.primary }]}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>

      {/* Theme Selector */}
      <Text style={styles.themeLabel}>Choose your theme</Text>
      <View style={styles.themeRow}>
        <TouchableOpacity
          style={[styles.themeCircle, themeName === "green" && { borderColor: theme.primary }, { backgroundColor: "#1DB954" }]}
          onPress={() => setTheme("green")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, themeName === "blue" && { borderColor: theme.primary }, { backgroundColor: "#3B82F6" }]}
          onPress={() => setTheme("blue")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, themeName === "purple" && { borderColor: theme.primary }, { backgroundColor: "#b4760bff" }]}
          onPress={() => setTheme("purple")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, themeName === "red" && { borderColor: theme.primary }, { backgroundColor: "#e24747ff" }]}
          onPress={() => setTheme("red")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 34, textAlign: "center", fontWeight: "700", marginBottom: 40 },
  inputContainer: { backgroundColor: "#1A1A1A", height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 0, fontSize: 16 },
  loginButton: { height: 55, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  forgot: { marginTop: 12, textAlign: "center" },
  linkButton: { marginTop: 20, alignItems: "center", marginBottom: 20 },
  linkText: { fontSize: 14, fontWeight: "500" },
  themeLabel: { color: "#888", textAlign: "center", marginTop: 18, marginBottom: 8 },
  themeRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 20 },
  themeCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "transparent" },
});
