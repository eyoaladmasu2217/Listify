import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Toast() {
    const { toast, hideToast } = useToast();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (toast) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    friction: 5,
                    useNativeDriver: true,
                })
            ]).start();

            const timer = setTimeout(() => {
                dismiss();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            dismiss();
        }
    }, [toast]);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -20,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (toast) hideToast();
        });
    };

    if (!toast) return null;

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'info': return 'information-circle';
            default: return 'checkmark-circle';
        }
    };

    const getColor = () => {
        switch (toast.type) {
            case 'success': return '#4ade80'; // Green
            case 'error': return '#ef4444';   // Red
            case 'info': return '#3b82f6';    // Blue
            default: return theme.primary;
        }
    };

    return (
        <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
            <Animated.View style={[
                styles.toast,
                {
                    backgroundColor: theme.surface,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    opacity,
                    transform: [{ translateY }]
                }
            ]}>
                <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
                    <Ionicons name={getIcon()} size={24} color={getColor()} />
                </View>
                <Text style={[styles.message, { color: theme.text }]}>{toast.message}</Text>
                <TouchableOpacity onPress={dismiss}>
                    <Ionicons name="close" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        maxWidth: '90%',
        gap: 12
    },
    iconContainer: {
        padding: 4,
        borderRadius: 20,
    },
    message: {
        fontSize: 14,
        fontWeight: '600',
        flexShrink: 1,
    },
});
