import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import client from "../api/client";
import LogoTitle from "../components/LogoTitle";
import Skeleton from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";

export default function HomeTab({ navigation }) {
    const { theme } = useTheme();
    const [feed, setFeed] = useState([]);
    const [trendingAlbums, setTrendingAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("Friends"); // "Friends" or "Trending"
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollRef = useRef(null);
    const scrollX = useRef(0);
    const direction = useRef(1); // 1 for right, -1 for left
    const maxScroll = useRef(0);
    const [layoutWidth, setLayoutWidth] = useState(0);

    useEffect(() => {
        let interval;
        if (autoScroll) {
            interval = setInterval(() => {
                scrollX.current += direction.current;

                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ x: scrollX.current, animated: false });
                }

                // Boundary detection
                if (direction.current === 1 && scrollX.current >= maxScroll.current) {
                    direction.current = -1;
                } else if (direction.current === -1 && scrollX.current <= 0) {
                    direction.current = 1;
                }
            }, 30);
        }
        return () => clearInterval(interval);
    }, [autoScroll]);

    const handleTouch = () => {
        setAutoScroll(false);
    };

    const fetchFeed = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            // Determine endpoint based on active tab
            const endpoint = activeTab === "Friends" ? "/feed/following" : "/feed/explore";

            console.log("Fetching feed for tab:", activeTab, "-> endpoint:", endpoint);

            const requests = [client.get(endpoint)];
            if (activeTab === "Trending") {
                requests.push(client.get("/albums/trending"));
            }

            const results = await Promise.all(requests);
            const feedRes = results[0];
            const albumsRes = results[1];

            if (feedRes.data) {
                setFeed(feedRes.data);
            }

            if (albumsRes && albumsRes.data) {
                setTrendingAlbums(albumsRes.data);
            }
        } catch (e) {
            console.log("Error fetching feed", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchFeed(false);
    };

    useEffect(() => {
        fetchFeed();
    }, [activeTab]);

    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    let iconName = "star-outline";
                    if (rating >= star) {
                        iconName = "star";
                    } else if (rating >= star - 0.5) {
                        iconName = "star-half";
                    }
                    return (
                        <Ionicons
                            key={star}
                            name={iconName}
                            size={14}
                            color={theme.primary}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
            >
                <LogoTitle fontSize={28} color={theme.text} style={{ justifyContent: 'flex-start', marginBottom: 20 }} />

                {/* Featured Carousel - Compact Overlay Style */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 20 }}
                    onScrollBeginDrag={handleTouch}
                    onScroll={({ nativeEvent }) => {
                        scrollX.current = nativeEvent.contentOffset.x;
                    }}
                    onContentSizeChange={(w) => {
                        maxScroll.current = Math.max(0, w - layoutWidth);
                    }}
                    onLayout={(e) => {
                        setLayoutWidth(e.nativeEvent.layout.width);
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
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPressIn={handleTouch}
                            onPress={() => {
                                haptics.trigger('light');
                                navigation.navigate("CreateReview", {
                                    song: { ...album, cover: Image.resolveAssetSource(album.cover).uri }
                                });
                            }}
                        >
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
                        onPress={() => {
                            haptics.trigger('selection');
                            setActiveTab("Friends");
                        }}
                    >
                        <Text style={[styles.tabText, { color: activeTab === "Friends" ? theme.text : theme.textSecondary }]}>Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "Trending" && styles.activeTab]}
                        onPress={() => {
                            haptics.trigger('selection');
                            setActiveTab("Trending");
                        }}
                    >
                        <Text style={[styles.tabText, { color: activeTab === "Trending" ? theme.text : theme.textSecondary }]}>Trending</Text>
                    </TouchableOpacity>
                </View>

                {/* Trending Albums Section (Horizontal) */}
                {activeTab === "Trending" && trendingAlbums.length > 0 && (
                    <View style={{ marginBottom: 25 }}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Albums</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                            {trendingAlbums.map((album) => (
                                <TouchableOpacity
                                    key={album.id}
                                    style={styles.trendingAlbumCard}
                                    onPress={() => {
                                        haptics.trigger('light');
                                        Alert.alert("Album", album.title);
                                    }}
                                >
                                    <Image source={{ uri: album.cover_url }} style={styles.trendingAlbumCover} />
                                    <Text style={[styles.trendingAlbumTitle, { color: theme.text }]} numberOfLines={1}>{album.title}</Text>
                                    <Text style={[styles.trendingAlbumArtist, { color: theme.textSecondary }]} numberOfLines={1}>{album.artist_name || album.artist?.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 15 }]}>Recent Activity</Text>
                    </View>
                )}

                {/* Activity Feed */}
                {loading ? (
                    <View style={{ gap: 15 }}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={[styles.feedCard, { backgroundColor: "#1A1A1A" }]}>
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                        <Skeleton width={24} height={24} borderRadius={12} />
                                        <Skeleton width={100} height={14} style={{ marginLeft: 8 }} />
                                    </View>
                                    <Skeleton width={150} height={20} style={{ marginBottom: 4 }} />
                                    <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
                                    <Skeleton width="100%" height={14} />
                                </View>
                                <Skeleton width={80} height={80} borderRadius={8} />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={{ gap: 15 }}>
                        {feed.map((item, index) => {
                            // Normalize real activity data vs mock feed
                            const actor = item.actor || item.user;
                            const target = item.target || {};
                            const isReview = item.action_type === "review" || (!item.action_type && item.song);

                            // Extract display data
                            const username = actor?.username || "Someone";
                            const avatar = actor?.profile_picture_url || actor?.avatar || "https://ui-avatars.com/api/?background=random";
                            const songInfo = isReview ? (item.target ? {
                                id: target.song_id,
                                title: target.song_title,
                                artist: target.song_artist,
                                cover: target.song_cover
                            } : item.song) : null;
                            const rating = target.rating || item.rating || 0;
                            const reviewText = target.review_text || item.review_text;

                            return (
                                <TouchableOpacity
                                    key={item.id || index}
                                    style={[styles.feedCard, { backgroundColor: "#1A1A1A" }]}
                                    onPress={() => {
                                        haptics.trigger('light');
                                        navigation.navigate("ReviewDetail", {
                                            review: item
                                        });
                                    }}
                                >
                                    {/* Left Content */}
                                    <View style={{ flex: 1, marginRight: 15 }}>
                                        {/* User Header */}
                                        <View style={styles.feedHeader}>
                                            <Image source={{ uri: avatar }} style={styles.avatar} />
                                            <Text style={[styles.feedUser, { color: theme.textSecondary }]}>
                                                <Text style={{ color: theme.text, fontWeight: "600" }}>{String(username)}</Text>
                                                {` ${String(item.action_type || "rated")}`}
                                            </Text>
                                        </View>

                                        {/* Song Info */}
                                        <Text style={[styles.feedTitle, { color: theme.text }]}>{songInfo?.title || ""}</Text>
                                        <Text style={[styles.feedArtist, { color: theme.textSecondary }]}>{songInfo?.artist || ""}</Text>

                                        {/* Rating */}
                                        <View style={{ marginVertical: 8 }}>
                                            {renderStars(rating)}
                                        </View>

                                        {reviewText ? (
                                            <Text style={[styles.reviewSnippet, { color: theme.textSecondary }]} numberOfLines={2}>
                                                {`"${reviewText}"`}
                                            </Text>
                                        ) : null}

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
                                    <Image source={typeof songInfo?.cover === 'number' ? songInfo.cover : { uri: songInfo?.cover || "https://via.placeholder.com/150" }} style={styles.feedCover} />
                                </TouchableOpacity>
                            );
                        })}
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    trendingAlbumCard: {
        width: 130
    },
    trendingAlbumCover: {
        width: 130,
        height: 130,
        borderRadius: 12,
        marginBottom: 6
    },
    trendingAlbumTitle: {
        fontSize: 14,
        fontWeight: "bold"
    },
    trendingAlbumArtist: {
        fontSize: 12,
        opacity: 0.7
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
    reviewSnippet: {
        fontSize: 13,
        fontStyle: "italic",
        marginTop: 4,
        marginBottom: 8,
        lineHeight: 18
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
