import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import { useTheme } from "../context/ThemeContext";

export default function ExploreTab({ navigation }) {
    const { theme } = useTheme();
    const [songs, setSongs] = useState([]);
    const [trendingAlbums, setTrendingAlbums] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [collections, setCollections] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [addingToList, setAddingToList] = useState(false);

    const fetchCollections = async () => {
        try {
            const response = await client.get("/collections");
            setCollections(response.data);
        } catch (error) {
            console.log("Fetch collections error:", error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCollections();
        }, [])
    );

    const openListModal = (song) => {
        setSelectedSong(song);
        setShowListModal(true);
    };

    const handleAddToList = async (collectionId) => {
        setAddingToList(true);
        try {
            await client.post(`/collections/${collectionId}/items`, {
                song_id: selectedSong.id
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

    useEffect(() => {
        const fetchInitialData = async () => {
            const mockSongs = [
                { id: 1, title: "Billie Jean", artist_name: "Michael Jackson", cover_url: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png" },
                { id: 2, title: "Come Together", artist_name: "The Beatles", cover_url: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
                { id: 3, title: "Get Lucky", artist_name: "Daft Punk", cover_url: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg" },
                { id: 4, title: "Blinding Lights", artist_name: "The Weeknd", cover_url: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png" }
            ];

            try {
                // Fetch trending songs and trending albums in parallel
                const [songsRes, albumsRes] = await Promise.all([
                    client.get("/songs/trending"),
                    client.get("/albums/trending")
                ]);

                setSongs(songsRes.data.length > 0 ? songsRes.data : mockSongs);
                setTrendingAlbums(albumsRes.data);
            } catch (e) {
                console.log("Error fetching initial data", e.message);
                setSongs(mockSongs);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim().length === 0) {
            setIsSearching(false);
            setLoading(true);
            try {
                const res = await client.get("/songs");
                setSongs(res.data || []);
            } catch (e) {
                console.log("Error resetting songs", e.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        setIsSearching(true);
        setLoading(true);
        try {
            const res = await client.get(`/songs?q=${encodeURIComponent(query)}`);
            setSongs(res.data || []);
        } catch (e) {
            console.log("Search error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const renderSong = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigation.navigate("SongDetail", {
                song: {
                    id: item.id,
                    title: item.title,
                    artist: item.artist_name || item.artist?.name || "Unknown Artist",
                    cover: item.cover_url || "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
                }
            })}
        >
            <Image
                source={item.cover_url ? { uri: item.cover_url } : require("../../assets/abbey.png")}
                style={styles.songCover}
            />
            <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.songArtist, { color: theme.textSecondary }]} numberOfLines={1}>{item.artist_name || item.artist?.name || "Unknown Artist"}</Text>
            </View>
            <TouchableOpacity onPress={() => openListModal(item)}>
                <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderAlbum = ({ item }) => (
        <TouchableOpacity
            style={styles.albumItem}
            onPress={() => {
                // If we had an AlbumDetail, we would navigate there.
                // For now, let's just show a message or do nothing.
                Alert.alert("Album", item.title);
            }}
        >
            <Image
                source={{ uri: item.cover_url || "https://via.placeholder.com/150" }}
                style={styles.albumCover}
            />
            <Text style={[styles.albumTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.albumArtist, { color: theme.textSecondary }]} numberOfLines={1}>{item.artist_name || item.artist?.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Search</Text>
            </View>

            <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                <Ionicons name="search" size={20} color={theme.textSecondary} />
                <TextInput
                    placeholder="Artists, Songs, or Albums"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.searchInput, { color: theme.text }]}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                />
            </View>

            {loading ? (
                <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={songs}
                    renderItem={renderSong}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            {!isSearching && trendingAlbums.length > 0 && (
                                <View style={styles.trendingAlbumsContainer}>
                                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Albums</Text>
                                    <FlatList
                                        data={trendingAlbums}
                                        renderItem={renderAlbum}
                                        keyExtractor={(item) => item.id.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                    />
                                    <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 10 }]}>Trending Songs</Text>
                                </View>
                            )}
                            {isSearching && (
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Results for "{searchQuery}"
                                </Text>
                            )}
                            {!isSearching && trendingAlbums.length === 0 && (
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Now</Text>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        <Text style={{ color: theme.textSecondary, textAlign: "center", marginTop: 20 }}>
                            No results found.
                        </Text>
                    }
                />
            )}

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
                                <Text style={{ color: theme.textSecondary }}>No lists found. Create one in the Lists tab!</Text>
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
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { marginBottom: 20 },
    title: { fontSize: 32, fontWeight: "bold" },
    searchBar: { flexDirection: "row", alignItems: "center", height: 50, borderRadius: 12, paddingHorizontal: 15, marginBottom: 30 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    songItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    songCover: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
    songInfo: { flex: 1 },
    songTitle: { fontSize: 16, fontWeight: "600" },
    songArtist: { fontSize: 14 },
    // Album styles
    trendingAlbumsContainer: { marginBottom: 10 },
    albumItem: { width: 140, marginRight: 15 },
    albumCover: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
    albumTitle: { fontSize: 14, fontWeight: "bold" },
    albumArtist: { fontSize: 12, opacity: 0.7 },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: "bold" },
    collectionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10 },
    collectionTitle: { fontSize: 16, fontWeight: '600' },
    emptyCollections: { padding: 20, alignItems: 'center' },
});
