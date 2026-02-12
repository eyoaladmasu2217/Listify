import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import client from "../api/client";
import { useTheme } from "../context/ThemeContext";

export default function FollowButton({ userId, style, size = "medium", onFollowChange }) {
    const { theme } = useTheme();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        checkFollowStatus();
    }, [userId]);

    const checkFollowStatus = async () => {
        try {
            setLoading(true);
            const response = await client.get(`/users/${userId}/follow/status`);
            setIsFollowing(response.data.is_following);
        } catch (error) {
            console.error("Error checking follow status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (actionLoading) return;

        const previousState = isFollowing;
        setActionLoading(true);

        // Optimistic update
        setIsFollowing(!isFollowing);

        try {
            if (isFollowing) {
                // Unfollow
                await client.delete(`/users/${userId}/follow`);
            } else {
                // Follow
                await client.post(`/users/${userId}/follow`);
            }

            // Notify parent component if callback provided
            if (onFollowChange) {
                onFollowChange(!isFollowing);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            // Rollback on error
            setIsFollowing(previousState);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <TouchableOpacity
                style={[
                    styles.button,
                    size === "small" ? styles.buttonSmall : styles.buttonMedium,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    style
                ]}
                disabled
            >
                <ActivityIndicator size="small" color={theme.primary} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                size === "small" ? styles.buttonSmall : styles.buttonMedium,
                isFollowing
                    ? { backgroundColor: theme.surface, borderColor: theme.border }
                    : { backgroundColor: theme.primary, borderColor: theme.primary },
                style
            ]}
            onPress={handleFollowToggle}
            disabled={actionLoading}
        >
            {actionLoading ? (
                <ActivityIndicator
                    size="small"
                    color={isFollowing ? theme.primary : "#fff"}
                />
            ) : (
                <>
                    <Ionicons
                        name={isFollowing ? "checkmark" : "person-add"}
                        size={size === "small" ? 14 : 16}
                        color={isFollowing ? theme.text : "#fff"}
                        style={{ marginRight: 6 }}
                    />
                    <Text
                        style={[
                            styles.buttonText,
                            size === "small" ? styles.buttonTextSmall : styles.buttonTextMedium,
                            { color: isFollowing ? theme.text : "#fff" }
                        ]}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    buttonSmall: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    buttonMedium: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontWeight: "600",
    },
    buttonTextSmall: {
        fontSize: 12,
    },
    buttonTextMedium: {
        fontSize: 14,
    },
});
