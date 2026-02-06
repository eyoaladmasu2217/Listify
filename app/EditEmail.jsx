import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function EditEmail({ navigation }) {
    const { theme } = useTheme();
    const { user, setUser } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!email.trim() || !currentPassword) {
            Alert.alert("Error", "Both email and current password are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await client.patch("/auth", {
                user: {
                    email: email,
                    current_password: currentPassword
                }
            });
            
            Alert.alert("Success", "Email updated successfully");
            setUser(response.data.user || response.data);
            navigation.goBack();
        } catch (error) {
            console.log("Edit Email Error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.errors?.email ? "Email " + error.response?.data?.errors?.email.join(", ") : 
                           (error.response?.data?.errors?.current_password ? "Current password is incorrect" : "Failed to update email");
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Email Address</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoIcon}>
                    <Ionicons name="mail" size={60} color={theme.primary} />
                </View>
                
                <Text style={[styles.instruction, { color: theme.textSecondary }]}>
                    Update your account's email address. You'll need to use this new email to sign in to your account next time.
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>New Email Address</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Enter new email"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Current Password</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            placeholder="Confirm with password"
                            placeholderTextColor={theme.textSecondary}
                        />
                        <Text style={[styles.subText, { color: theme.textSecondary }]}>
                            Required to authorize this change.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Email</Text>
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
    input: {
        fontSize: 16,
        padding: 15,
        borderRadius: 12,
    },
    subText: { fontSize: 12, marginTop: 4, marginLeft: 5 },
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
