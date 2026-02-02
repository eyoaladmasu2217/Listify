import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "./context/ThemeContext";

export default function SongDetail({ route, navigation }) {
    const { theme } = useTheme();
    // Mock data for now, would come from route.params or API
    const { song } = route.params || {
        song: {
            title: "Abbey Road",
            artist: "The Beatles",
            cover: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: song.cover }} style={styles.cover} />

                <Text style={[styles.title, { color: theme.text }]}>{song.title}</Text>
                <Text style={[styles.artist, { color: theme.textSecondary }]}>{song.artist}</Text>

                <TouchableOpacity
                    style={[styles.rateButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate("CreateReview", { song })}
                >
                    <Text style={styles.rateButtonText}>Log / Review</Text>
                </TouchableOpacity>

                <View style={[styles.statsRow, { borderColor: theme.surface }]}>
                    <View style={styles.stat}>
                        <Text style={[styles.statValue, { color: theme.text }]}>4.5</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Average</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={[styles.statValue, { color: theme.text }]}>1.2k</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Reviews</Text>
                {/* Mock Review */}
                <View style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.reviewUser, { color: theme.text }]}>jane_doe</Text>
                    <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
                        An absolute classic. Come Together is timeless.
                    </Text>
                    <Text style={[styles.rating, { color: theme.primary }]}>★★★★★</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { alignItems: "center", padding: 20 },
    cover: { width: 200, height: 200, borderRadius: 10, marginBottom: 20, marginTop: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
    artist: { fontSize: 18, marginBottom: 30, textAlign: "center" },
    rateButton: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 30, marginBottom: 30 },
    rateButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    statsRow: { flexDirection: "row", width: "100%", justifyContent: "space-around", borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 15, marginBottom: 30 },
    stat: { alignItems: "center" },
    statValue: { fontSize: 20, fontWeight: "bold" },
    statLabel: { fontSize: 12 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 15 },
    reviewCard: { width: "100%", padding: 15, borderRadius: 12, marginBottom: 10 },
    reviewUser: { fontWeight: "bold", marginBottom: 5 },
    reviewText: { marginBottom: 10 },
    rating: { fontSize: 16 },
});
