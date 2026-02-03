import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import { useTheme } from "../context/ThemeContext";

export default function ExploreTab({ navigation }) {
    const { theme } = useTheme();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            const mockSongs = [
                { id: 1, title: "Billie Jean", artist_name: "Michael Jackson", cover_url: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png" },
                { id: 2, title: "Come Together", artist_name: "The Beatles", cover_url: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
                { id: 3, title: "Get Lucky", artist_name: "Daft Punk", cover_url: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg" },
                { id: 4, title: "Blinding Lights", artist_name: "The Weeknd", cover_url: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png" }
            ];

            try {
                const res = await client.get("/songs");
                if (res.data && res.data.length > 0) {
                    setSongs(res.data);
                } else {
                    setSongs(mockSongs);
                }
            } catch (e) {
                console.log("Error fetching songs, using mock", e.message);
                setSongs(mockSongs);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    const renderSong = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigation.navigate("SongDetail", {
                song: {
                    id: item.id,
                    title: item.title,
                    artist: item.artist_name || "Unknown Artist",
                    cover: item.cover_url || "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
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
                />
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Now</Text>

            {loading ? (
                <ActivityIndicator color={theme.primary} />
            ) : (
                <FlatList
                    data={songs}
                    renderItem={renderSong}
                    keyExtractor={(item) => item.id.toString()}
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
