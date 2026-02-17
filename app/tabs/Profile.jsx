import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import SettingsModal from "../components/SettingsModal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import haptics from "../utils/haptics";

export default function ProfileTab({ navigation, route }) {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isSettingsVisible, setSettingsVisible] = useState(false);

    const fetchProfileData = useCallback(async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            // Fetch profile and reviews in parallel
            const [profileRes, reviewsRes] = await Promise.all([
                client.get("/users/me"),
                client.get("/reviews/me")
            ]);
            setProfile(profileRes.data.user || profileRes.data);
            setReviews(reviewsRes.data);
        } catch (e) {
            console.log("Error fetching profile data", e.message);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfileData(true);
    }, [fetchProfileData]);

    useFocusEffect(
        useCallback(() => {
            fetchProfileData();

            // Check if we need to refresh due to new review
            if (route?.params?.refreshReviews) {
                // Clear the param to avoid repeated refreshes
                navigation.setParams({ refreshReviews: false });
            }
        }, [fetchProfileData, route?.params?.refreshReviews, navigation])
    );

    if (loading) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}><ActivityIndicator color={theme.primary} /></View>;

    const displayUser = profile || user;

    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : (star - 0.5 <= rating ? "star-half" : "star-outline")}
                        size={12}
                        color="#4ade80"
                    />
                ))}
            </View>
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.primary}
                    colors={[theme.primary]}
                />
            }
        >
            <SettingsModal visible={isSettingsVisible} onClose={() => setSettingsVisible(false)} />
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                    <Ionicons name="settings-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Image
                    source={{ uri: displayUser?.profile_picture_url || "https://ui-avatars.com/api/?name=" + (displayUser?.username || "User") }}
                    style={styles.avatar}
                />
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{displayUser?.reviews_count || reviews.length}</Text>
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

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.surface }]}
                    onPress={() => {
                        haptics.trigger('selection');
                        navigation.navigate("EditProfile");
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.text }]}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.surface }]}
                    onPress={() => {
                        haptics.trigger('selection');
                        Share.share({ message: `Check out my music profile on Listify: @${displayUser.username}!` });
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.text }]}>Share Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Reviews Section */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>My Reviews</Text>
                <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>{reviews.length}</Text>
            </View>

            {reviews.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                    <Ionicons name="musical-notes-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>No Reviews Yet</Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Start sharing your music taste with the community!
                    </Text>
                    <TouchableOpacity
                        style={[styles.ctaButton, { backgroundColor: theme.primary }]}
                        onPress={() => {
                            haptics.trigger('selection');
                            navigation.navigate('MainTabs', { screen: 'Search' });
                        }}
                    >
                        <Ionicons name="search" size={18} color="#000" />
                        <Text style={styles.ctaButtonText}>Discover Music</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.reviewsList}>
                    {reviews.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.reviewCard, { backgroundColor: theme.surface }]}
                            onPress={() => {
                                haptics.trigger('light');
                                navigation.navigate("ReviewDetail", { review: { ...item, actor: displayUser } });
                            }}
                        >
                            <Image
                                source={{ uri: item.song?.cover_url || "https://via.placeholder.com/150" }}
                                style={styles.songCover}
                            />
                            <View style={styles.reviewMain}>
                                <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>{item.song?.title}</Text>
                                <Text style={[styles.songArtist, { color: theme.textSecondary }]} numberOfLines={1}>{item.song?.artist_name}</Text>
                                <View style={styles.ratingRow}>
                                    {renderStars(item.rating)}
                                    <Text style={[styles.timeAgo, { color: theme.textSecondary }]}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                {!!item.review_text && (
                                    <Text style={[styles.reviewSnippet, { color: theme.textSecondary }]} numberOfLines={2}>
                                        {`"${String(item.review_text)}"`}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    topBar: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
    stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
    statItem: { alignItems: "center" },
    statNumber: { fontSize: 20, fontWeight: "bold" },
    statLabel: { fontSize: 12 },
    username: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
    bio: { fontSize: 14, marginBottom: 20 },
    actionButtonsRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
    actionButton: { flex: 1, height: 35, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    actionButtonText: { fontSize: 14, fontWeight: '600' },

    // Reviews Section
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 15 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    reviewCount: { fontSize: 14, fontWeight: '600', opacity: 0.6 },
    reviewsList: { gap: 12 },
    reviewCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 16,
        gap: 12,
        alignItems: 'center'
    },
    songCover: { width: 60, height: 60, borderRadius: 8 },
    reviewMain: { flex: 1 },
    songTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    songArtist: { fontSize: 14, opacity: 0.7, marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    timeAgo: { fontSize: 10, opacity: 0.5 },
    reviewSnippet: { fontSize: 12, fontStyle: 'italic', opacity: 0.8 },


    emptyState: { padding: 40, borderRadius: 16, alignItems: 'center', gap: 12, marginTop: 10 },
    emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginTop: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', opacity: 0.7, marginBottom: 8 },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginTop: 8
    },
    ctaButtonText: { color: '#000', fontSize: 15, fontWeight: '700' },


    logoutButton: { padding: 15, borderRadius: 12, borderWidth: 1, alignItems: "center" },
});
