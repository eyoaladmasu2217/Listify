import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import { useTheme } from "../context/ThemeContext";

export default function ExploreTab({ navigation }) {
    const { theme } = useTheme();
    const [songs, setSongs] = useState([]);
    const [trendingSongs, setTrendingSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Initial Trending Songs
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const res = await client.get("/songs");
                if (res.data) setTrendingSongs(res.data);
            } catch (e) {
                console.log("Initial fetch error:", e);
            }
        };
        fetchInitial();
    }, []);

    const performSearch = async (query) => {
        if (!query.trim()) {
            setSongs([]);
            return;
        }
        setLoading(true);
        try {
            const response = await client.get("/songs/search", {
                params: { q: query }
            });
            if (response.data) {
                setSongs(response.data);
            }
        } catch (error) {
            console.log("Search error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) performSearch(searchQuery);
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const renderSong = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigation.navigate("SongDetail", {
                song: {
                    id: item.id,
                    deezer_id: item.deezer_id,
                    title: item.title,
                    artist: item.artist_name || "Unknown Artist",
                    album_title: item.album_title,
                    cover: item.cover_url || "https://picsum.photos/seed/song/300",
                    preview_url: item.preview_url,
                    duration_ms: item.duration_ms
                }
            })}
        >
            <Image
                source={item.cover_url ? { uri: item.cover_url } : require("../../assets/abbey.png")}
                style={styles.songCover}
            />
            <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.songArtist, { color: theme.textSecondary }]}>{item.artist_name || "Unknown Artist"}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
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
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => performSearch(searchQuery)}
                    returnKeyType="search"
                    autoFocus
                />
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {searchQuery ? "Search Results" : "Trending Now"}
            </Text>

            {loading ? (
                <ActivityIndicator color={theme.primary} />
            ) : (
                <FlatList
                    data={searchQuery ? songs : trendingSongs}
                    renderItem={renderSong}
                    keyExtractor={(item) => (item.id || item.deezer_id || Math.random()).toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ color: theme.textSecondary, textAlign: "center", marginTop: 20 }}>
                            No songs found.
                        </Text>
                    }
                />
            )}
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
});
