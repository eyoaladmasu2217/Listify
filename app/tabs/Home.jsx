import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import LogoTitle from "../components/LogoTitle";
import { useTheme } from "../context/ThemeContext";

export default function HomeTab() {
    const { theme } = useTheme();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await client.get("/feed/following");
                setFeed(res.data);
            } catch (e) {
                console.log("Error fetching feed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LogoTitle fontSize={28} color={theme.text} style={{ justifyContent: 'flex-start' }} />

                {/* Featured Carousel */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30 }}>
                    {[
                        {
                            title: "Abbey Road",
                            artist: "The Beatles",
                            cover: require("../../assets/abbey.png"),
                            color: "#1DB954"
                        },
                        {
                            title: "Nevermind",
                            artist: "Nirvana",
                            cover: require("../../assets/Nirvana.webp"),
                            color: "#3B82F6"
                        },
                        {
                            title: "The Bends",
                            artist: "Radiohead",
                            cover: require("../../assets/Radiohead - The Bends.jpg"),
                            color: "#8b5cff"
                        }
                    ].map((album, index) => (
                        <View key={index} style={[styles.card, { backgroundColor: theme.surface, width: 300, marginRight: 15 }]}>
                            <Image source={album.cover} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>FEATURED ALBUM</Text>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>{album.title}</Text>
                                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{album.artist}</Text>

                                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.actionButtonText}>Rate Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Feed Section Title */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Friends Activity</Text>

                {loading ? (
                    <ActivityIndicator color={theme.primary} />
                ) : feed.length === 0 ? (
                    <Text style={{ color: theme.textSecondary }}>No recent activity from friends.</Text>
                ) : (
                    feed.map((item, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={{ color: theme.text }}>{item.user?.username} rated {item.song?.title}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingTop: 60 },
    headerTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
    card: { borderRadius: 16, overflow: "hidden", marginBottom: 30 },
    cardImage: { width: "100%", height: 300, resizeMode: "cover" },
    cardContent: { padding: 20 },
    cardLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 5 },
    cardTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
    cardSubtitle: { fontSize: 16, marginBottom: 15 },
    actionButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, alignSelf: "flex-start" },
    actionButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
});
