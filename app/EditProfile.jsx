import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function EditProfileScreen({ navigation }) {
    const { theme } = useTheme();
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSave = async () => {
        if (!username) {
            Alert.alert("Error", "Username cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("bio", bio);

            if (image) {
                const uriParts = image.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('profile_picture', {
                    uri: image.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            const response = await client.patch("/users/me", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update local user context if possible
            if (setUser) setUser(response.data.user);
            Alert.alert("Success", "Profile updated successfully!");
            navigation.goBack();
        } catch (error) {
            console.log("Edit Profile Error:", error.response?.data || error.message);
            Alert.alert("Update Failed", error.response?.data?.error || "Could not update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                        <Text style={[styles.saveButtonText, { color: theme.primary }]}>Done</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar Change */}
                <View style={styles.avatarSection}>
                    <Image
                        source={{ uri: image ? image.uri : (user?.profile_picture_url || "https://ui-avatars.com/api/?name=" + (user?.username || "User")) }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={[styles.changePhotoText, { color: theme.primary }]}>Change profile photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View style={styles.form}>
                    <View style={[styles.inputGroup, { borderBottomColor: theme.surface }]}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Username</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={[styles.inputGroup, { borderBottomColor: theme.surface }]}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Bio</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            placeholder="Add a bio to your profile"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(255,255,255,0.1)"
    },
    backButton: { width: 50 },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    saveButtonText: { fontSize: 18, fontWeight: "600", width: 50, textAlign: 'right' },
    scrollContent: { padding: 20, alignItems: 'center' },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
    changePhotoText: { fontSize: 16, fontWeight: "600" },
    form: { width: '100%' },
    inputGroup: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5 },
    label: { width: 100, fontSize: 16 },
    input: { flex: 1, fontSize: 16 },
});
