import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function ChangePassword({ navigation }) {
    const { theme } = useTheme();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New password and confirmation do not match");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await client.patch("/auth", {
                user: {
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword
                }
            });
            
            Alert.alert("Success", "Password changed successfully");
            navigation.goBack();
        } catch (error) {
            console.log("Change Password Error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.errors?.join(", ") || error.message || "Failed to update password. Check your current password.";
            Alert.alert("Update Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Change Password</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoIcon}>
                    <Ionicons name="lock-closed" size={60} color={theme.primary} />
                </View>
                
                <Text style={[styles.instruction, { color: theme.textSecondary }]}>
                    Your password must be at least 6 characters and should include a combination of numbers, letters and special characters.
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Current Password</Text>
                        <View style={[styles.passwordContainer, { backgroundColor: theme.surface }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showPasswords}
                                placeholder="Enter current password"
                                placeholderTextColor={theme.textSecondary}
                            />
                            <TouchableOpacity onPress={() => setShowPasswords(!showPasswords)}>
                                <Ionicons name={showPasswords ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>New Password</Text>
                        <View style={[styles.passwordContainer, { backgroundColor: theme.surface }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showPasswords}
                                placeholder="Enter new password"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm New Password</Text>
                        <View style={[styles.passwordContainer, { backgroundColor: theme.surface }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPasswords}
                                placeholder="Confirm new password"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text style={styles.saveButtonText}>Update Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    scrollContent: { padding: 25 },
    infoIcon: { alignItems: "center", marginBottom: 20, marginTop: 10 },
    instruction: { fontSize: 14, textAlign: "center", marginBottom: 30, lineHeight: 20 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 1 },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 15,
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    saveButtonText: { color: "black", fontSize: 16, fontWeight: "700" },
});
