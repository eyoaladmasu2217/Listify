import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Pressable } from "react-native";
import { useTheme } from "../context/ThemeContext";
import client from "../api/client";

export default function CollectionsTab() {
    const { theme } = useTheme();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([
        { id: 1, title: "My Favorites", description: "Best songs ever", public: true },
        { id: 2, title: "Workout Mix", description: "High energy tracks", public: false },
    ]);

    const resetCreateForm = () => {
        setTitle("");
        setDescription("");
        setIsPublic(true);
    };

    const handleCreateList = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter a list title");
            return;
        }

        setLoading(true);
        try {
            const response = await client.post("/collections", {
                collection: {
                    title: title.trim(),
                    description: description.trim(),
                    public: isPublic
                }
            });

            if (response.status === 201) {
                setCollections([...collections, response.data]);
                resetCreateForm();
                setCreateModalVisible(false);
                Alert.alert("Success", "List created successfully!");
            }
        } catch (error) {
            console.log("Create collection error:", error.response?.data || error.message);
            // Use mock data for demo
            const mockCollection = {
                id: Date.now(),
                title: title.trim(),
                description: description.trim(),
                public: isPublic
            };
            setCollections([...collections, mockCollection]);
            resetCreateForm();
            setCreateModalVisible(false);
            Alert.alert("Success", "List created successfully! (Demo mode)");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (collection) => {
        setEditingCollection(collection);
        setTitle(collection.title);
        setDescription(collection.description || "");
        setIsPublic(collection.public);
        setEditModalVisible(true);
    };

    const handleUpdateList = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter a list title");
            return;
        }

        setLoading(true);
        try {
            const response = await client.put(`/collections/${editingCollection.id}`, {
                collection: {
                    title: title.trim(),
                    description: description.trim(),
                    public: isPublic
                }
            });

            if (response.status === 200) {
                const updatedCollections = collections.map(c => 
                    c.id === editingCollection.id 
                        ? { ...c, title: title.trim(), description: description.trim(), public: isPublic }
                        : c
                );
                setCollections(updatedCollections);
                setEditModalVisible(false);
                Alert.alert("Success", "List updated successfully!");
            }
        } catch (error) {
            console.log("Update collection error:", error.response?.data || error.message);
            // Use mock data for demo
            const updatedCollections = collections.map(c => 
                c.id === editingCollection.id 
                    ? { ...c, title: title.trim(), description: description.trim(), public: isPublic }
                    : c
            );
            setCollections(updatedCollections);
            setEditModalVisible(false);
            Alert.alert("Success", "List updated successfully! (Demo mode)");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteList = (collection) => {
        Alert.alert(
            "Delete List",
            `Are you sure you want to delete "${collection.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.delete(`/collections/${collection.id}`);
                            setCollections(collections.filter(c => c.id !== collection.id));
                            Alert.alert("Success", "List deleted successfully!");
                        } catch (error) {
                            console.log("Delete collection error:", error.response?.data || error.message);
                            // Use mock data for demo
                            setCollections(collections.filter(c => c.id !== collection.id));
                            Alert.alert("Success", "List deleted successfully! (Demo mode)");
                        }
                    }
                }
            ]
        );
    };

    const openMenu = (collection) => {
        Alert.alert(
            collection.title,
            "Choose an action",
            [
                { text: "Edit", onPress: () => openEditModal(collection) },
                { text: "Delete", onPress: () => handleDeleteList(collection), style: "destructive" },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>My Lists</Text>
                <TouchableOpacity onPress={() => { resetCreateForm(); setCreateModalVisible(true); }}>
                    <Ionicons name="add-circle-outline" size={32} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {collections.length === 0 ? (
                <View style={[styles.emptyState, { borderColor: theme.surface }]}>
                    <Ionicons name="musical-notes-outline" size={64} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        You haven't created any lists yet.
                    </Text>
                    <TouchableOpacity 
                        style={[styles.createButton, { backgroundColor: theme.surface }]}
                        onPress={() => { resetCreateForm(); setCreateModalVisible(true); }}
                    >
                        <Text style={[styles.createButtonText, { color: theme.primary }]}>Create a List</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    {collections.map((collection) => (
                        <Pressable 
                            key={collection.id} 
                            style={({ pressed }) => [
                                styles.listItem, 
                                { backgroundColor: theme.surface, opacity: pressed ? 0.9 : 1 }
                            ]}
                            onPress={() => openMenu(collection)}
                            onLongPress={() => openMenu(collection)}
                        >
                            <View style={styles.listInfo}>
                                <View style={styles.listHeader}>
                                    <Text style={[styles.listTitle, { color: theme.text }]}>{collection.title}</Text>
                                    {collection.public ? (
                                        <Ionicons name="globe-outline" size={14} color={theme.textSecondary} />
                                    ) : (
                                        <Ionicons name="lock-closed-outline" size={14} color={theme.textSecondary} />
                                    )}
                                </View>
                                <Text style={[styles.listDescription, { color: theme.textSecondary }]}>
                                    {collection.description || "No description"}
                                </Text>
                            </View>
                            <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Create List Modal */}
            <Modal
                visible={createModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Create New List</Text>
                            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                            placeholder="Enter list title"
                            placeholderTextColor={theme.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={[styles.label, { color: theme.textSecondary }]}>Description (optional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                            placeholder="Enter description"
                            placeholderTextColor={theme.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <TouchableOpacity 
                            style={[styles.publicToggle, { backgroundColor: theme.surface }]}
                            onPress={() => setIsPublic(!isPublic)}
                        >
                            <Ionicons 
                                name={isPublic ? "checkbox" : "square-outline"} 
                                size={24} 
                                color={theme.primary} 
                            />
                            <Text style={[styles.publicText, { color: theme.text }]}>Public list</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={handleCreateList}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.actionButtonText}>Create List</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Edit List Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit List</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                            placeholder="Enter list title"
                            placeholderTextColor={theme.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={[styles.label, { color: theme.textSecondary }]}>Description (optional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                            placeholder="Enter description"
                            placeholderTextColor={theme.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <TouchableOpacity 
                            style={[styles.publicToggle, { backgroundColor: theme.surface }]}
                            onPress={() => setIsPublic(!isPublic)}
                        >
                            <Ionicons 
                                name={isPublic ? "checkbox" : "square-outline"} 
                                size={24} 
                                color={theme.primary} 
                            />
                            <Text style={[styles.publicText, { color: theme.text }]}>Public list</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={handleUpdateList}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.actionButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    title: { fontSize: 32, fontWeight: "bold" },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: "dashed", borderRadius: 20, marginBottom: 50 },
    emptyText: { marginTop: 20, fontSize: 16 },
    createButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, alignItems: "center" },
    createButtonText: { fontWeight: "bold", fontSize: 16, color: "white" },
    listContainer: { flex: 1 },
    listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 12, marginBottom: 10 },
    listInfo: { flex: 1 },
    listHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
    listTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
    listDescription: { fontSize: 14 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    modalTitle: { fontSize: 24, fontWeight: "bold" },
    label: { fontSize: 14, marginBottom: 8 },
    input: { padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16 },
    publicToggle: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 24 },
    publicText: { marginLeft: 12, fontSize: 16 },
    actionButton: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
    actionButtonText: { fontWeight: "bold", fontSize: 16, color: "white" },
});
