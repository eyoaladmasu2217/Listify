import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function UserProfile({ route, navigation }) {
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const { userId, user: initialUser } = route.params || {};
    
    const [profile, setProfile] = useState(initialUser || null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false); // We can init from profile if we passed it, but better fetch fresh

    // If viewing own profile, redirect or just show? 
    // Usually redirect to tabs/Profile or just render. 
    // Let's just render but hide follow button.
    const isOwnProfile = currentUser?.id === (profile?.id || userId);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // If we don't have an ID, we can't fetch.
                const targetId = userId || profile?.id;
                if (!targetId) return;

                const [profileRes, reviewsRes] = await Promise.all([
                    client.get(`/users/${targetId}`),
                    client.get(`/users/${targetId}/reviews`)
                ]);
                
                const userData = profileRes.data.user || profileRes.data;
                setProfile(userData);
                setReviews(reviewsRes.data);
                
                // Set isFollowing from userData if available (we added is_following to serializer)
                if (userData.is_following !== undefined) {
                    setIsFollowing(userData.is_following);
                }

            } catch (e) {
                console.log("Error fetching user profile", e.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId || profile?.id) {
            fetchProfileData();
        }
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!profile?.id) return;
        
        try {
            // Optimistic update
            setIsFollowing(!isFollowing);
            
            if (isFollowing) {
                // Unfollow
                await client.delete(`/users/${profile.id}/follow`);
            } else {
                // Follow
                await client.post(`/users/${profile.id}/follow`);
            }
        } catch (error) {
            console.log("Follow error:", error.response?.data || error.message);
            // Revert on error
            setIsFollowing(!isFollowing);
        }
    };

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

    if (loading && !profile) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
                <ActivityIndicator color={theme.primary} />
            </View>
        );
    }

    const displayUser = profile || initialUser;
    
    // Fallback profile pic
    const profilePic = (displayUser?.profile_picture_url && displayUser.profile_picture_url.trim() !== "")
        ? displayUser.profile_picture_url
        : `https://picsum.photos/seed/${displayUser?.username || "user"}/200`;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header / Back Button */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Image
                    source={{ uri: profilePic }}
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
            <Text style={[styles.bio, { color: theme.textSecondary }]}>{displayUser?.bio || "No bio yet."}</Text>

            {/* Follow/Unfollow Button - only show when viewing another user */}
            {!isOwnProfile && (
                <TouchableOpacity 
                    style={[styles.followButton, { backgroundColor: isFollowing ? theme.surface : theme.primary }]}
                    onPress={handleFollowToggle}
                >
                    <Text style={[styles.followButtonText, { color: isFollowing ? theme.text : "white" }]}>
                        {isFollowing ? "Following" : "Follow"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Reviews Section */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews</Text>
                <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>{reviews.length}</Text>
            </View>

            {reviews.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                    <Ionicons name="musical-notes-outline" size={40} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No reviews yet.</Text>
                </View>
            ) : (
                <View style={styles.reviewsList}>
                    {reviews.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.reviewCard, { backgroundColor: theme.surface }]}
                            onPress={() => navigation.navigate("ReviewDetail", { review: { ...item, actor: displayUser } })}
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
    container: { flex: 1, padding: 20, paddingTop: 40 },
    topBar: { flexDirection: "row", marginBottom: 10 },
    backButton: { padding: 5 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
    stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
    statItem: { alignItems: "center" },
    statNumber: { fontSize: 20, fontWeight: "bold" },
    statLabel: { fontSize: 12 },
    username: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    bio: { fontSize: 14, marginBottom: 20 },
    followButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignSelf: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: "600"
    },

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

    emptyState: { padding: 40, borderRadius: 16, alignItems: 'center', gap: 10, marginTop: 10 },
    emptyText: { fontSize: 14, textAlign: 'center' },
});
