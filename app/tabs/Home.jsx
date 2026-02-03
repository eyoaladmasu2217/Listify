import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LogoTitle from "../components/LogoTitle";
import { useTheme } from "../context/ThemeContext";

export default function HomeTab() {
    const { theme } = useTheme();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Friends"); // "Friends" or "Trending"
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollRef = useRef(null);
    const scrollX = useRef(0);

    useEffect(() => {
        let interval;
        if (autoScroll) {
            interval = setInterval(() => {
                scrollX.current += 1; // Adjust speed here (higher = faster)
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ x: scrollX.current, animated: false });
                }
            }, 30); // Interval in ms
        }
        return () => clearInterval(interval);
    }, [autoScroll]);

    const handleTouch = () => {
        setAutoScroll(false);
    };

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // MOCK DATA for layout demo if API fails or is empty
                const mockFeed = [
                    {
                        user: { username: "Eyoal Yeshewas", avatar: "https://ui-avatars.com/api/?name=Eyoal+Yeshewas&background=0D8ABC&color=fff" },
                        song: { title: "Abbey Road", artist: "The Beatles", cover: require("../../assets/abbey.png") },
                        rating: 5,
                        likes: 42,
                        comments: 12
                    },
                    {
                        user: { username: "Estifanos", avatar: "https://ui-avatars.com/api/?name=Estifanos&background=black&color=fff" },
                        song: { title: "As It Was", artist: "Harry Styles", cover: require("../../assets/Nirvana.webp") },
                        rating: 4,
                        likes: 31,
                        comments: 7
                    },
                    {
                        user: { username: "Nati", avatar: "https://ui-avatars.com/api/?name=Nati&background=random" },
                        song: { title: "Bohemian Rhapsody", artist: "Queen", cover: require("../../assets/Radiohead - The Bends.jpg") },
                        rating: 5,
                        likes: 89,
                        comments: 24
                    },
                    {
                        user: { username: "Kidus Amare", avatar: "https://ui-avatars.com/api/?name=Kidus+Amare&background=random" },
                        song: { title: "Starboy", artist: "The Weeknd", cover: require("../../assets/abbey.png") },
                        rating: 4,
                        likes: 15,
                        comments: 3
                    }
                ];

                try {
                    const res = await client.get("/feed/following");
                    if (res.data && res.data.length > 0) {
                        setFeed(res.data);
                    } else {
                        setFeed(mockFeed);
                    }
                } catch (apiError) {
                    console.log("API Error, using mock", apiError);
                    setFeed(mockFeed);
                }

            } catch (e) {
                console.log("Error fetching feed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={14}
                        color={theme.primary}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LogoTitle fontSize={28} color={theme.text} style={{ justifyContent: 'flex-start', marginBottom: 20 }} />

                {/* Featured Carousel - Compact Overlay Style */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 20 }}
                    onScrollBeginDrag={handleTouch}
                    onScroll={({ nativeEvent }) => {
                        // Keep our scrollX ref in sync for when auto-scroll is resumed or for manual tracking
                        scrollX.current = nativeEvent.contentOffset.x;
                    }}
                    scrollEventThrottle={16}
                >
                    {[
                        {
                            title: "Abbey Road",
                            artist: "The Beatles",
                            cover: require("../../assets/abbey.png"),
                        },
                        {
                            title: "Nevermind",
                            artist: "Nirvana",
                            cover: require("../../assets/Nirvana.webp"),
                        },
                        {
                            title: "The Bends",
                            artist: "Radiohead",
                            cover: require("../../assets/Radiohead - The Bends.jpg"),
                        }
                    ].map((album, index) => (
                        <TouchableOpacity key={index} activeOpacity={0.9} onPressIn={handleTouch}>

                            <ImageBackground
                                source={album.cover}
                                style={styles.featuredCard}
                                imageStyle={{ borderRadius: 16 }}
                            >
                                <View style={styles.featuredOverlay}>
                                    <View>
                                        <Text style={styles.featuredLabel}>FEATURED ALBUM</Text>
                                        <Text style={styles.featuredTitle}>{album.title}</Text>
                                        <Text style={styles.featuredArtist}>{album.artist}</Text>
                                    </View>
                                    <View style={[styles.rateButton, { backgroundColor: theme.primary }]}>
                                        <Text style={styles.rateButtonText}>Rate Now</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Section Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "Friends" && styles.activeTab]}
                        onPress={() => setActiveTab("Friends")}
                    >
                        <Text style={[styles.tabText, { color: activeTab === "Friends" ? theme.text : theme.textSecondary }]}>Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "Trending" && styles.activeTab]}
                        onPress={() => setActiveTab("Trending")}
                    >
                        <Text style={[styles.tabText, { color: activeTab === "Trending" ? theme.text : theme.textSecondary }]}>Trending</Text>
                    </TouchableOpacity>
                </View>

                {/* Activity Feed */}
                {loading ? (
                    <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
                ) : (
                    <View style={{ gap: 15 }}>
                        {feed.map((item, index) => (
                            <View key={index} style={[styles.feedCard, { backgroundColor: "#1A1A1A" }]}>
                                {/* Left Content */}
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    {/* User Header */}
                                    <View style={styles.feedHeader}>
                                        <Image source={{ uri: item.user?.avatar || "https://ui-avatars.com/api/?background=random" }} style={styles.avatar} />
                                        <Text style={[styles.feedUser, { color: theme.textSecondary }]}>
                                            <Text style={{ color: theme.text, fontWeight: "600" }}>{item.user?.username}</Text> rated
                                        </Text>
                                    </View>

                                    {/* Song Info */}
                                    <Text style={[styles.feedTitle, { color: theme.text }]}>{item.song?.title}</Text>
                                    <Text style={[styles.feedArtist, { color: theme.textSecondary }]}>{item.song?.artist}</Text>

                                    {/* Rating */}
                                    <View style={{ marginVertical: 8 }}>
                                        {renderStars(item.rating || 0)}
                                    </View>

                                    {/* Footer Stats */}
                                    <View style={styles.feedFooter}>
                                        <View style={styles.statItem}>
                                            <Ionicons name="heart-outline" size={16} color={theme.textSecondary} />
                                            <Text style={[styles.statText, { color: theme.textSecondary }]}>{item.likes || 0}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Ionicons name="chatbubble-outline" size={16} color={theme.textSecondary} />
                                            <Text style={[styles.statText, { color: theme.textSecondary }]}>{item.comments || 0}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Right: Album Art */}
                                <Image source={typeof item.song?.cover === 'string' ? { uri: item.song?.cover } : item.song?.cover} style={styles.feedCover} />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingTop: 60 },

    // Featured
    featuredCard: {
        width: 320,
        height: 220, // Smaller height as requested
        marginRight: 15,
        justifyContent: "flex-end",
    },
    featuredOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)", // Darken overlay
        borderRadius: 16,
        padding: 20,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    featuredLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "rgba(255,255,255,0.8)",
        letterSpacing: 1,
        marginTop: 20
    },
    featuredTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 2
    },
    featuredArtist: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 10
    },
    rateButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 30
    },
    rateButtonText: {
        color: "black", // Buttons usually allow black text on bright primary colors
        fontWeight: "700",
        fontSize: 14
    },

    // Tabs
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#1A1A1A",
        padding: 4,
        borderRadius: 12,
        marginBottom: 20
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10
    },
    activeTab: {
        backgroundColor: "#2A2A2A"
    },
    tabText: {
        fontWeight: "600",
        fontSize: 14
    },

    // Feed
    feedCard: {
        borderRadius: 12,
        padding: 15,
        flexDirection: "row"
    },
    feedHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8
    },
    feedUser: {
        fontSize: 13
    },
    feedTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2
    },
    feedArtist: {
        fontSize: 14,
        marginBottom: 4
    },
    feedCover: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#333"
    },
    feedFooter: {
        flexDirection: "row",
        gap: 15,
        marginTop: 4
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    statText: {
        fontSize: 12
    }
});
