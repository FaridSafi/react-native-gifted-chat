import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export interface ActionsProps {
    options?: {
        [key: string]: () => void;
    };
    optionTintColor?: string;
    icon?: () => ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
    iconTextStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    onPressActionButton?(): void;
}
export declare function Actions({ options, optionTintColor, icon, wrapperStyle, iconTextStyle, onPressActionButton, containerStyle, }: ActionsProps): React.JSX.Element;
