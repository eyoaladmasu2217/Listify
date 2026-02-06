import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function EditProfile({ navigation }) {
    const { theme } = useTheme();
    const { user, setUser } = useAuth();
    
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [profilePic, setProfilePic] = useState(user?.profile_picture_url || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!username.trim()) {
            Alert.alert("Error", "Username cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const response = await client.patch(`/users/${user.id}`, {
                username,
                bio,
                profile_picture_url: profilePic
            });
            
            Alert.alert("Success", "Profile updated successfully");
            setUser(response.data.user || response.data);
            navigation.goBack();
        } catch (error) {
            console.log("Edit Profile Error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.errors?.join(", ") || error.message || "Something went wrong";
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                        <Text style={[styles.saveText, { color: theme.primary }]}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Edit */}
                <View style={styles.avatarSection}>
                    <Image
                        source={{ uri: (profilePic && profilePic.trim() !== "") ? profilePic : `https://picsum.photos/seed/${username || "user"}/200` }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.changePicButton}>
                        <Text style={[styles.changePicText, { color: theme.primary }]}>Change Profile Picture</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Username</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput, { color: theme.text, backgroundColor: theme.surface }]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself..."
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Profile Picture URL</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                            value={profilePic}
                            onChangeText={setProfilePic}
                            placeholder="https://example.com/image.jpg"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>
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
    saveText: { fontSize: 16, fontWeight: "700" },
    scrollContent: { padding: 20 },
    avatarSection: { alignItems: "center", marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
    changePicText: { fontSize: 16, fontWeight: "600" },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 0.5 },
    input: {
        fontSize: 16,
        padding: 15,
        borderRadius: 12,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    }
});
