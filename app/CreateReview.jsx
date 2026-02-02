import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "./context/ThemeContext";

export default function CreateReview({ route, navigation }) {
    const { theme } = useTheme();
    const { song } = route.params || {};
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const handlePublish = () => {
        // API call would go here
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: theme.textSecondary, fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Log Album</Text>
                <TouchableOpacity onPress={handlePublish}>
                    <Text style={{ color: theme.primary, fontWeight: "bold", fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Image source={{ uri: song?.cover }} style={styles.thumb} />
                <View style={styles.meta}>
                    <Text style={[styles.songTitle, { color: theme.text }]}>{song?.title}</Text>
                    <Text style={[styles.songArtist, { color: theme.textSecondary }]}>{song?.artist}</Text>
                </View>
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>Rating</Text>
            <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={32}
                            color={theme.primary}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.label, { color: theme.textSecondary }]}>Review</Text>
            <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                multiline
                placeholder="Write your thoughts..."
                placeholderTextColor={theme.textSecondary}
                value={text}
                onChangeText={setText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    content: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
    thumb: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
    songTitle: { fontSize: 18, fontWeight: "bold" },
    songArtist: { fontSize: 14 },
    label: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginBottom: 10 },
    stars: { flexDirection: "row", marginBottom: 30 },
    input: { height: 150, borderRadius: 12, padding: 15, textAlignVertical: "top", fontSize: 16 },
});
