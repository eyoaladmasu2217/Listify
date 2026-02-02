import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("green");

  const handleLogin = () => {
    navigation.navigate("Homepage", { theme }); // Pass selected theme to Homepage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listify</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor="#777"
          style={styles.input}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.forgot}>Forgot Password?</Text>

      {/* Theme Selector */}
      <Text style={styles.themeLabel}>Choose your theme</Text>
      <View style={styles.themeRow}>
        <TouchableOpacity
          style={[styles.themeCircle, theme === "green" && styles.themeSelected, { backgroundColor: "#1DB954" }]}
          onPress={() => setTheme("green")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, theme === "blue" && styles.themeSelected, { backgroundColor: "#3B82F6" }]}
          onPress={() => setTheme("blue")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, theme === "purple" && styles.themeSelected, { backgroundColor: "#b4760bff" }]}
          onPress={() => setTheme("purple")}
        />
        <TouchableOpacity
          style={[styles.themeCircle, theme === "light" && styles.themeSelectedLight, { backgroundColor: "#e24747ff" }]}
          onPress={() => setTheme("light")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070708ff", padding: 30, justifyContent: "center" },
  title: { color: "white", fontSize: 34, textAlign: "center", fontWeight: "700", marginBottom: 40 },
  inputContainer: { backgroundColor: "#1A1A1A", height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, color: "white", borderWidth: 0 },
  loginButton: { backgroundColor: "#1DB954", height: 55, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  forgot: { color: "#1DB954", marginTop: 12, textAlign: "center" },
  themeLabel: { color: "#888", textAlign: "center", marginTop: 18, marginBottom: 8 },
  themeRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 20 },
  themeCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "transparent" },
  themeSelected: { borderColor: "#1DB954" },
  themeSelectedLight: { borderColor: "#1DB954" },
});
