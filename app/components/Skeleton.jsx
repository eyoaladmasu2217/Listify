import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Skeleton({ width, height, style, borderRadius = 4 }) {
    const { theme } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: theme.textSecondary,
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );
}
