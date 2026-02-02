import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function ProfileTab() {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get("/users/me");
                setProfile(res.data);
            } catch (e) {
                console.log("Error fetching profile", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}><ActivityIndicator color={theme.primary} /></View>;

    const displayUser = profile || user;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Image
                    source={{ uri: displayUser?.profile_picture_url || "https://ui-avatars.com/api/?name=" + (displayUser?.username || "User") }}
                    style={styles.avatar}
                />
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{displayUser?.reviews_count || 0}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{displayUser?.followers_count || 0}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{displayUser?.following_count || 0}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Following</Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.username, { color: theme.text }]}>@{displayUser?.username || "username"}</Text>
            <Text style={[styles.bio, { color: theme.textSecondary }]}>{displayUser?.bio || "Music enthusiast."}</Text>

            <TouchableOpacity onPress={logout} style={[styles.logoutButton, { borderColor: theme.surface }]}>
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
    stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
    statItem: { alignItems: "center" },
    statNumber: { fontSize: 20, fontWeight: "bold" },
    statLabel: { fontSize: 12 },
    username: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
    bio: { fontSize: 16, marginBottom: 30 },
    logoutButton: { padding: 15, borderRadius: 12, borderWidth: 1, alignItems: "center", marginTop: "auto" },
});
