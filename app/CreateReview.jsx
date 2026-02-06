import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import client from "./api/client";
import { useTheme } from "./context/ThemeContext";

export default function CreateReview({ route, navigation }) {
    const { theme } = useTheme();
    const { song } = route.params || {};
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (rating === 0) {
            Alert.alert("Rating Required", "Please select a star rating.");
            return;
        }

        setLoading(true);
        try {
            await client.post("/reviews", {
                review: {
                    song_id: song?.id,
                    rating: rating,
                    review_text: text
                }
            });
            Alert.alert("Success", "Review published!");
            navigation.goBack();
        } catch (error) {
            console.log("Review Error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.error || error.message || "Unknown error";
            Alert.alert("Save Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleStarPress = (starIndex, event) => {
        const { locationX } = event.nativeEvent;
        const starWidth = 44; 
        const isHalf = locationX < starWidth / 2;
        const newRating = isHalf ? starIndex - 0.5 : starIndex;
        setRating(newRating);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Rate Album</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.largeCoverContainer}>
                    <Image source={song?.cover ? { uri: song.cover } : require("../assets/abbey.png")} style={styles.largeCover} />
                </View>

                <View style={styles.metaContainer}>
                    <Text style={[styles.songTitle, { color: theme.text }]}>{song?.title || "Album Title"}</Text>
                    <Text style={[styles.songArtist, { color: theme.textSecondary }]}>
                        {(song?.artist || "Artist Name") + " • " + (song?.year || "2024")}
                    </Text>
                    {rating > 0 && (
                        <Text style={[styles.ratingValue, { color: "#4ade80" }]}>{rating.toFixed(1)}</Text>
                    )}
                </View>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => {
                        let iconName = "star-outline";
                        if (rating >= star) iconName = "star";
                        else if (rating >= star - 0.5) iconName = "star-half";

                        return (
                            <TouchableOpacity
                                key={star}
                                activeOpacity={1}
                                onPress={(e) => handleStarPress(star, e)}
                                style={styles.starPadding}
                            >
                                <Ionicons name={iconName} size={44} color="#4ade80" />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={[styles.inputWrapper, { borderColor: theme.surface }]}>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        multiline
                        placeholder="Add a review..."
                        placeholderTextColor={theme.textSecondary}
                        value={text}
                        onChangeText={setText}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: "#58bc6b" }]}
                    onPress={handlePublish}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Rating</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 20
    },
    backButton: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    scrollContent: { alignItems: "center", paddingHorizontal: 25, paddingBottom: 40 },
    largeCoverContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    largeCover: {
        width: 320,
        height: 320,
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 30
    },
    metaContainer: { alignItems: "center", marginBottom: 30 },
    songTitle: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
    songArtist: { fontSize: 16, textAlign: "center", opacity: 0.8, marginBottom: 10 },
    ratingValue: { fontSize: 24, fontWeight: "bold" },
    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 40,
        gap: 2
    },
    starPadding: { padding: 4 },
    inputWrapper: {
        width: "100%",
        height: 120,
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 40,
        backgroundColor: "#161616"
    },
    input: {
        flex: 1,
        fontSize: 16,
        textAlignVertical: "top"
    },
    saveButton: {
        width: "100%",
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    saveButtonText: { color: "black", fontSize: 18, fontWeight: "700" },
});
