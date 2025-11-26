import React from 'react';
import { BaseButton } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
export type TouchableOpacityProps = Omit<React.ComponentProps<typeof BaseButton>, 'onPress'> & {
    activeOpacity?: number;
    onPress?: () => void;
} & React.ComponentProps<typeof Animated.View>;
export declare const TouchableOpacity: React.FC<TouchableOpacityProps>;
