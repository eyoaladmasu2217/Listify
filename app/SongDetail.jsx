import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function SongDetail({ route, navigation }) {
    const { theme } = useTheme();
    const { song } = route.params || {};
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!song?.id) return;
            const mockReviews = [
                { id: 1, user: { username: "jane_doe" }, rating: 5, content: "An absolute classic! Must listen." },
                { id: 2, user: { username: "music_buff" }, rating: 4, content: "Great production, though a bit long." }
            ];

            try {
                const res = await client.get(`/songs/${song.id}/reviews`);
                if (res.data && res.data.length > 0) {
                    setReviews(res.data);
                } else {
                    setReviews(mockReviews);
                }
            } catch (e) {
                console.log("Error fetching reviews, using mock", e.message);
                setReviews(mockReviews);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [song?.id]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Modal Handle */}
            <View style={styles.modalHandleContainer}>
                <View style={[styles.modalHandle, { backgroundColor: theme.surface }]} />
            </View>

            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close-circle" size={32} color={theme.textSecondary} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: song?.cover }} style={styles.cover} />

                <Text style={[styles.title, { color: theme.text }]}>{song?.title || "Unknown Song"}</Text>
                <Text style={[styles.artist, { color: theme.textSecondary }]}>{song?.artist || "Unknown Artist"}</Text>

                <TouchableOpacity
                    style={[styles.rateButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate("CreateReview", { song })}
                >
                    <Text style={styles.rateButtonText}>Log / Review</Text>
                </TouchableOpacity>

                <View style={[styles.statsRow, { borderColor: theme.surface }]}>
                    <View style={styles.stat}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{`${reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "-"}`}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Average</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{reviews.length}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews</Text>

                {loading ? (
                    <ActivityIndicator color={theme.primary} />
                ) : reviews.length === 0 ? (
                    <Text style={{ color: theme.textSecondary, marginTop: 10 }}>No reviews yet. Be the first!</Text>
                ) : (
                    reviews.map((item) => (
                        <View key={item.id} style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
                            <View style={styles.reviewHeader}>
                                <Image
                                    source={{ uri: item.user?.profile_picture_url || "https://ui-avatars.com/api/?background=random" }}
                                    style={styles.reviewAvatar}
                                />
                                <View>
                                    <Text style={[styles.reviewUser, { color: theme.text }]}>{String(item.user?.username || "anonymous")}</Text>
                                    <View style={{ flexDirection: 'row', gap: 2 }}>
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const rating = item.rating || 0;
                                            let iconName = "star-outline";
                                            if (rating >= star) iconName = "star";
                                            else if (rating >= star - 0.5) iconName = "star-half";
                                            return <Ionicons key={star} name={iconName} size={14} color="#4ade80" />;
                                        })}
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
                                {item.review_text || item.content}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { alignItems: "center", padding: 20 },
    cover: { width: 200, height: 200, borderRadius: 10, marginBottom: 20, marginTop: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
    artist: { fontSize: 18, marginBottom: 30, textAlign: "center" },
    rateButton: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 30, marginBottom: 30 },
    rateButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    statsRow: { flexDirection: "row", width: "100%", justifyContent: "space-around", borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 15, marginBottom: 30 },
    stat: { alignItems: "center" },
    statValue: { fontSize: 20, fontWeight: "bold" },
    statLabel: { fontSize: 12 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 15 },
    reviewCard: { width: "100%", padding: 15, borderRadius: 12, marginBottom: 10 },
    reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
    reviewAvatar: { width: 32, height: 32, borderRadius: 16 },
    reviewUser: { fontWeight: "bold" },
    reviewText: { fontSize: 14, lineHeight: 20 },
    modalHandleContainer: { height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    modalHandle: { width: 40, height: 4, borderRadius: 2 },
    closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
});
