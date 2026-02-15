import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import haptics from '../utils/haptics';

export default function GradientButton({ onPress, children, style, colors, disabled }) {
    const handlePress = () => {
        haptics.trigger('selection');
        if (onPress) onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={[styles.container, style]}
            disabled={disabled}
        >
            <LinearGradient
                colors={colors || ['#1DB954', '#1ed760']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{children}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
