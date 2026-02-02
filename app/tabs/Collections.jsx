import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function CollectionsTab() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>My Lists</Text>
                <TouchableOpacity>
                    <Ionicons name="add-circle-outline" size={32} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.emptyState, { borderColor: theme.surface }]}>
                <Ionicons name="musical-notes-outline" size={64} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    You haven't created any lists yet.
                </Text>
                <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.createButtonText, { color: theme.primary }]}>Create a List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    title: { fontSize: 32, fontWeight: "bold" },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: "dashed", borderRadius: 20, marginBottom: 50 },
    emptyText: { marginTop: 20, fontSize: 16 },
    createButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30 },
    createButtonText: { fontWeight: "bold", fontSize: 16 },
});
