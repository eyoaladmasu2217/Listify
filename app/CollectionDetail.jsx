import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function CollectionDetail({ route, navigation }) {
    const { theme } = useTheme();
    const { collection } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const response = await client.get(`/collections/${collection.id}`);
            // Assuming the backend returns song items in the collection
            setItems(response.data.songs || []);
        } catch (error) {
            console.log("Fetch collection items error:", error.message);
            Alert.alert("Error", "Could not load songs in this list.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [collection.id])
    );

    const handleRemoveSong = async (songId) => {
        try {
            await client.delete(`/collections/${collection.id}/items/${songId}`);
            setItems(items.filter(item => item.id !== songId));
        } catch (error) {
            console.log("Remove song error:", error.message);
            Alert.alert("Error", "Could not remove song from list.");
        }
    };

    const renderSong = ({ item }) => (
        <TouchableOpacity
            style={[styles.songItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate("SongDetail", {
                song: {
                    id: item.id,
                    title: item.title,
                    artist: item.artist_name,
                    cover: item.cover_url || item.album?.cover_url
                }
            })}
        >
            <Image
                source={{ uri: item.cover_url || item.album?.cover_url || "https://via.placeholder.com/150" }}
                style={styles.songCover}
            />
            <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.songArtist, { color: theme.textSecondary }]} numberOfLines={1}>{item.artist_name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveSong(item.id)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={[styles.title, { color: theme.text }]}>{collection.title}</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>{collection.description || "No description"}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="musical-note-outline" size={64} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>This list is empty.</Text>
                    <TouchableOpacity
                        style={[styles.exploreButton, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate("Explore")}
                    >
                        <Text style={styles.exploreButtonText}>Find Songs</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderSong}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 20 },
    backButton: { marginRight: 15 },
    headerText: { flex: 1 },
    title: { fontSize: 24, fontWeight: "bold" },
    description: { fontSize: 14, marginTop: 4 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    listContent: { padding: 20 },
    songItem: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 12 },
    songCover: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
    songInfo: { flex: 1 },
    songTitle: { fontSize: 16, fontWeight: "600" },
    songArtist: { fontSize: 14 },
    removeButton: { padding: 5 },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
    emptyText: { fontSize: 16, marginTop: 10, marginBottom: 20 },
    exploreButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    exploreButtonText: { color: "white", fontWeight: "bold" },
});
