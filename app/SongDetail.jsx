import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function SongDetail({ route, navigation }) {
    const { theme } = useTheme();
    const { song } = route.params || {};
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [addingToList, setAddingToList] = useState(false);

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

    const fetchCollections = async () => {
        try {
            const response = await client.get("/collections");
            setCollections(response.data);
        } catch (error) {
            console.log("Fetch collections error:", error.message);
        }
    };

    const handleAddToList = async (collectionId) => {
        setAddingToList(true);
        try {
            await client.post(`/collections/${collectionId}/items`, {
                song_id: song.id
            });
            Alert.alert("Success", "Added to list!");
            setShowListModal(false);
        } catch (error) {
            console.log("Add to list error:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Could not add to list.");
        } finally {
            setAddingToList(false);
        }
    };

    const openListModal = () => {
        fetchCollections();
        setShowListModal(true);
    };

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

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.rateButton, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate("CreateReview", { song })}
                    >
                        <Text style={styles.rateButtonText}>Log / Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.addToListButton, { backgroundColor: theme.surface }]}
                        onPress={openListModal}
                    >
                        <Ionicons name="list-outline" size={20} color={theme.text} />
                        <Text style={[styles.addToListText, { color: theme.text }]}>Add to List</Text>
                    </TouchableOpacity>
                </View>

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

            {/* List Selection Modal */}
            <Modal
                visible={showListModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowListModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Add to List</Text>
                            <TouchableOpacity onPress={() => setShowListModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {collections.length === 0 ? (
                            <View style={styles.emptyCollections}>
                                <Text style={{ color: theme.textSecondary }}>No lists found. Create one in the Library tab!</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={collections}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.collectionItem, { backgroundColor: theme.surface }]}
                                        onPress={() => handleAddToList(item.id)}
                                        disabled={addingToList}
                                    >
                                        <Text style={[styles.collectionTitle, { color: theme.text }]}>{item.title}</Text>
                                        {addingToList ? <ActivityIndicator size="small" color={theme.primary} /> : <Ionicons name="add" size={20} color={theme.textSecondary} />}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { alignItems: "center", padding: 20 },
    cover: { width: 200, height: 200, borderRadius: 10, marginBottom: 20, marginTop: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
    artist: { fontSize: 18, marginBottom: 30, textAlign: "center" },
    actionRow: { flexDirection: 'row', gap: 10, width: '100%', paddingHorizontal: 20, marginBottom: 30 },
    rateButton: { flex: 2, paddingVertical: 12, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    rateButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    addToListButton: { flex: 1, flexDirection: 'row', gap: 8, paddingVertical: 12, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    addToListText: { fontSize: 14, fontWeight: "600" },
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
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: "bold" },
    collectionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10 },
    collectionTitle: { fontSize: 16, fontWeight: '600' },
    emptyCollections: { padding: 20, alignItems: 'center' },
});
