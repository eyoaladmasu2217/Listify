import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function ReviewDetail({ route, navigation }) {
    const { theme } = useTheme();
    const { review } = route.params || {};
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(review?.likes || 0);
    const [commentCount, setCommentCount] = useState(review?.comments || 0);
    const [commentText, setCommentText] = useState("");
    const [showCommentInput, setShowCommentInput] = useState(false);

    const handleLike = async () => {
        try {
            if (liked) {
                // Unlike - would need the like ID from backend
                console.log("Unlike not yet implemented");
            } else {
                // Like the review
                await client.post(`/reviews/${review.id}/like`);
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (error) {
            console.log("Like error:", error.response?.data || error.message);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        
        try {
            await client.post("/comments", {
                commentable_type: "Review",
                commentable_id: review.id,
                text: commentText
            });
            setCommentText("");
            setShowCommentInput(false);
            setCommentCount(prev => prev + 1);
        } catch (error) {
            console.log("Comment error:", error.response?.data || error.message);
        }
    };


    // Normalize review data
    const actor = review.actor || review.user;
    const target = review.target || {};
    const isReview = review.action_type === "review" || (!review.action_type && review.song);

    // Extract display data
    const username = actor?.username || "Someone";
    const avatar = (actor?.profile_picture_url && actor.profile_picture_url.trim() !== "")
        ? actor.profile_picture_url
        : `https://picsum.photos/seed/${actor?.username || "user"}/100`;
    const songInfo = isReview ? (review.target ? {
        id: target.song_id,
        title: target.song_title,
        artist: target.song_artist,
        cover: target.song_cover
    } : review.song) : null;
    const rating = target.rating || review.rating || 0;
    const reviewText = target.review_text || review.review_text;

    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    let iconName = "star-outline";
                    if (rating >= star) iconName = "star";
                    else if (rating >= star - 0.5) iconName = "star-half";
                    return <Ionicons key={star} name={iconName} size={20} color="#4ade80" />;
                })}
            </View>
        );
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
                {/* User Header */}
                <TouchableOpacity 
                    style={styles.userHeader}
                    onPress={() => navigation.navigate("UserProfile", { userId: actor?.id, user: actor })}
                >
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View>
                        <Text style={[styles.username, { color: theme.text }]}>{String(username)}</Text>
                        <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                            {String(review.action_type || "rated")}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Clickable Album Cover */}
                <TouchableOpacity
                    style={styles.coverContainer}
                    onPress={() => navigation.navigate("CreateReview", {
                        song: {
                            id: songInfo?.id,
                            title: songInfo?.title,
                            artist: songInfo?.artist,
                            cover: typeof songInfo?.cover === 'number' ? Image.resolveAssetSource(songInfo.cover).uri : (songInfo?.cover || "https://via.placeholder.com/150")
                        }
                    })}
                >
                    <Image
                        source={typeof songInfo?.cover === 'number' ? songInfo.cover : { uri: songInfo?.cover || "https://via.placeholder.com/150" }}
                        style={styles.cover}
                    />
                    <View style={styles.coverOverlay}>
                        <Ionicons name="star" size={24} color="white" />
                        <Text style={styles.coverOverlayText}>Tap to rate</Text>
                    </View>
                </TouchableOpacity>

                {/* Song Info */}
                <View style={styles.songInfo}>
                    <Text style={[styles.title, { color: theme.text }]}>{songInfo?.title || "Unknown Song"}</Text>
                    <Text style={[styles.artist, { color: theme.textSecondary }]}>{songInfo?.artist || "Unknown Artist"}</Text>
                </View>

                {/* Rating & Review */}
                <View style={[styles.reviewContent, { backgroundColor: theme.surface }]}>
                    <View style={styles.ratingRow}>
                        {renderStars(rating)}
                        <Text style={[styles.ratingValue, { color: theme.text }]}>{rating}</Text>
                    </View>
                    {!!reviewText && (
                        <Text style={[styles.reviewText, { color: theme.text }]}>
                            {`"${reviewText}"`}
                        </Text>
                    )}
                </View>

                {/* Interaction Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.interactionItem} onPress={handleLike}>
                        <Ionicons 
                            name={liked ? "heart" : "heart-outline"} 
                            size={24} 
                            color={liked ? "#ef4444" : theme.textSecondary} 
                        />
                        <Text style={[styles.interactionText, { color: theme.textSecondary }]}>{likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.interactionItem} 
                        onPress={() => setShowCommentInput(!showCommentInput)}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color={theme.textSecondary} />
                        <Text style={[styles.interactionText, { color: theme.textSecondary }]}>{commentCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.interactionItem}>
                        <Ionicons name="share-social-outline" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Comment Input */}
                {showCommentInput && (
                    <View style={[styles.commentInputContainer, { backgroundColor: theme.surface }]}>
                        <TextInput
                            style={[styles.commentInput, { color: theme.text }]}
                            placeholder="Add a comment..."
                            placeholderTextColor={theme.textSecondary}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.commentButton, { backgroundColor: theme.primary }]}
                            onPress={handleComment}
                        >
                            <Text style={styles.commentButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    modalHandleContainer: { height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    modalHandle: { width: 40, height: 4, borderRadius: 2 },
    closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
    scrollContent: { padding: 20 },
    userHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 25, marginTop: 10 },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    username: { fontSize: 18, fontWeight: "bold" },
    actionText: { fontSize: 14 },
    coverContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cover: { width: "100%", height: "100%" },
    coverOverlay: {
        position: "absolute",
        bottom: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    coverOverlayText: { color: "white", fontWeight: "600", fontSize: 12 },
    songInfo: { alignItems: "center", marginBottom: 25 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
    artist: { fontSize: 18, textAlign: "center" },
    reviewContent: { width: "100%", padding: 20, borderRadius: 16, marginBottom: 25 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
    ratingValue: { fontSize: 18, fontWeight: "bold" },
    reviewText: { fontSize: 16, lineHeight: 24, fontStyle: "italic" },
    footer: { flexDirection: "row", gap: 25, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 20 },
    interactionItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    interactionText: { fontSize: 14 },
    commentInputContainer: { 
        flexDirection: "row", 
        padding: 15, 
        gap: 10, 
        marginTop: 10,
        borderRadius: 12,
        alignItems: "center"
    },
    commentInput: { 
        flex: 1, 
        fontSize: 14,
        minHeight: 40,
        maxHeight: 100
    },
    commentButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20
    },
    commentButtonText: {
        color: "white",
        fontWeight: "600"
    }
});
