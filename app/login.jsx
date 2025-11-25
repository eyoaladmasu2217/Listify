import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-web";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("green");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listify</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor="#777"
          style={styles.input}
          underlineColorAndroid="transparent"
          spellCheck={false}
          autoCorrect={false}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry={!showPassword}
          style={styles.input}
          underlineColorAndroid="transparent"
          spellCheck={false}
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Login */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.forgot}>Forgot Password?</Text>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialButton}>
        <Image source={require("../assets/images/spotify.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue with Spotify</Text>
      </View>

      <View style={styles.socialButton}>
        <Ionicons name="logo-google" size={20} color="white" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </View>

      <View style={styles.socialButton}>
        <Ionicons name="logo-apple" size={20} color="white" />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </View>
      
        {/* Theme selector */}
        <Text style={styles.themeLabel}>Choose your theme</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeCircle, theme === "green" ? styles.themeSelected : null, { backgroundColor: "#1DB954" }]}
            onPress={() => setTheme("green")}
          />

          <TouchableOpacity
            style={[styles.themeCircle, theme === "blue" ? styles.themeSelected : null, { backgroundColor: "#3B82F6" }]}
            onPress={() => setTheme("blue")}
          />

          <TouchableOpacity
            style={[styles.themeCircle, theme === "purple" ? styles.themeSelected : null, { backgroundColor: "#b4760bff" }]}
            onPress={() => setTheme("purple")}
          />

          <TouchableOpacity
            style={[styles.themeCircle, theme === "light" ? styles.themeSelectedLight : null, { backgroundColor: "#e24747ff" }]}
            onPress={() => setTheme("light")}
          />
        </View>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070708ff",
    padding: 30,
    justifyContent: "center",
  },

  title: {
    color: "white",
    fontSize: 34,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 40,
  },

  inputContainer: {
    backgroundColor: "#1A1A1A",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    color: "white",
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",
    boxShadow: "none",
    borderWidth: 0,
  },

  loginButton: {
    backgroundColor: "#1DB954",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  forgot: {
    color: "#1DB954",
    marginTop: 12,
    textAlign: "center",
  },

  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },

  or: {
    color: "gray",
    marginHorizontal: 10,
  },

  socialButton: {
    backgroundColor: "#1A1A1A",
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 12,
  },

  socialIcon: {
    width: 24,
    height: 24,
  },

  socialText: {
    color: "white",
    fontSize: 16,
  },

  themeLabel: {
    color: "#888",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 8,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  themeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },

  themeSelected: {
    borderColor: "#1DB954",
  },

  themeSelectedLight: {
    borderColor: "#1DB954",
  },
});
