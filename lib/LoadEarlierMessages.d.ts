import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export interface LoadEarlierMessagesProps {
    isAvailable: boolean;
    isLoading: boolean;
    onPress: () => void;
    isInfiniteScrollEnabled?: boolean;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    activityIndicatorStyle?: StyleProp<ViewStyle>;
    activityIndicatorColor?: string;
    activityIndicatorSize?: number | 'small' | 'large';
}
export declare const LoadEarlierMessages: React.FC<LoadEarlierMessagesProps>;
