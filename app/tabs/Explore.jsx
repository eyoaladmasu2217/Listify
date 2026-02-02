import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ExploreTab() {
    const { theme } = useTheme();

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
            <Text style={{ color: theme.textSecondary, textAlign: "center", marginTop: 20 }}>
                Top charts coming soon...
            </Text>
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
});
