import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsModal({ visible, onClose }) {
    const { theme, setTheme, themeName } = useTheme();
    const { logout, user } = useAuth();

    // Local state for MVP toggles (would sync to backend in real implementation)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleThemeSelect = (name) => {
        setTheme(name);
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out", style: "destructive", onPress: () => {
                        onClose();
                        logout();
                    }
                }
            ]
        );
    };

    const renderSectionHeader = (title) => (
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    );

    const renderItem = (label, icon, type = "chevron", value = false, onValueChange = null, danger = false) => (
        <TouchableOpacity
            style={[styles.itemContainer, { borderBottomColor: theme.surface }]}
            onPress={type === "chevron" || type === "logout" ? onValueChange : null}
            disabled={type === "switch"}
        >
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={22} color={danger ? "#ef4444" : theme.textSecondary} />
                <Text style={[
                    styles.itemLabel,
                    { color: danger ? "#ef4444" : theme.text }
                ]}>
                    {label}
                </Text>
            </View>
            {type === "chevron" && (
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            )}
            {type === "switch" && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#767577", true: theme.primary }}
                    thumbColor="#f4f3f4"
                />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: theme.surface }]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* 1. Account & Profile */}
                        <View style={styles.section}>
                            {renderSectionHeader("Account & Profile")}
                            {renderItem("Edit Profile", "person-outline")}
                            {renderItem("Change Password", "lock-closed-outline")}
                            {renderItem("Email", "mail-outline")}
                        </View>

                        {/* 4. Appearance (Theme) - Custom Render */}
                        <View style={styles.section}>
                            {renderSectionHeader("Appearance")}
                            <Text style={[styles.subLabel, { color: theme.textSecondary }]}>App Color Theme</Text>
                            <View style={styles.themeRow}>
                                <ThemeSwatch color="#1DB954" selected={themeName === "green"} onPress={() => handleThemeSelect("green")} theme={theme} />
                                <ThemeSwatch color="#3B82F6" selected={themeName === "blue"} onPress={() => handleThemeSelect("blue")} theme={theme} />
                                <ThemeSwatch color="#b4760bff" selected={themeName === "purple"} onPress={() => handleThemeSelect("purple")} theme={theme} />
                                <ThemeSwatch color="#e24747ff" selected={themeName === "red"} onPress={() => handleThemeSelect("red")} theme={theme} />
                            </View>
                            {renderItem("Dark Mode", "moon-outline", "switch", true, () => { })}
                        </View>

                        {/* 2. Lists & Reviews */}
                        <View style={styles.section}>
                            {renderSectionHeader("Lists & Reviews")}
                            {renderItem("List Visibility", "eye-outline")}
                            {renderItem("Collaboration", "people-outline")}
                        </View>

                        {/* 3. Notifications */}
                        <View style={styles.section}>
                            {renderSectionHeader("Notifications")}
                            {renderItem("Push Notifications", "notifications-outline", "switch", notificationsEnabled, setNotificationsEnabled)}
                            {renderItem("New Followers", "person-add-outline", "switch", true, () => { })}
                        </View>

                        {/* 5. Privacy & Security */}
                        <View style={styles.section}>
                            {renderSectionHeader("Privacy & Security")}
                            {renderItem("Private Profile", "shield-checkmark-outline", "switch", isPrivate, setIsPrivate)}
                        </View>

                        {/* 6. Content & Discovery */}
                        <View style={styles.section}>
                            {renderSectionHeader("Content & Discovery")}
                            {renderItem("Explicit Content Filter", "alert-circle-outline", "switch", false, () => { })}
                        </View>

                        {/* 7. Support & Legal */}
                        <View style={styles.section}>
                            {renderSectionHeader("Support & Legal")}
                            {renderItem("Help & FAQ", "help-circle-outline")}
                            {renderItem("Terms of Service", "document-text-outline")}
                        </View>

                        {/* Logout & Delete */}
                        <View style={[styles.section, { marginTop: 20 }]}>
                            {renderItem("Log Out", "log-out-outline", "logout", false, handleLogout, true)}
                            {renderItem("Delete Account", "trash-outline", "chevron", false, null, true)}
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// Swatch Component
function ThemeSwatch({ color, selected, onPress, theme }) {
    return (
        <TouchableOpacity
            style={[
                styles.swatch,
                { backgroundColor: color },
                selected && { borderColor: theme.text, borderWidth: 3 }
            ]}
            onPress={onPress}
        >
            {selected && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        flexDirection: "row",
        justifyContent: "flex-end", // Align to right for side panel
    },
    modalView: {
        width: "85%", // Slightly wider for list readability
        height: "100%",
        padding: 20,
        paddingTop: 50,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 10,
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subLabel: {
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    themeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5,
        marginBottom: 15,
    },
    swatch: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        // borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
    }
});
