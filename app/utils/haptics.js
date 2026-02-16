import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HAPTIC_TYPES = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    SELECTION: 'selection',
};

const trigger = (type = HAPTIC_TYPES.SELECTION) => {
    if (Platform.OS === 'web') return;

    switch (type) {
        case HAPTIC_TYPES.LIGHT:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        case HAPTIC_TYPES.MEDIUM:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        case HAPTIC_TYPES.HEAVY:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        case HAPTIC_TYPES.SUCCESS:
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case HAPTIC_TYPES.ERROR:
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        case HAPTIC_TYPES.WARNING:
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
        case HAPTIC_TYPES.SELECTION:
        default:
            Haptics.selectionAsync();
            break;
    }
};

export default {
    trigger,
    types: HAPTIC_TYPES,
};
