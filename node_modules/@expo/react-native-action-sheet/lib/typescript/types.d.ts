import * as React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
export interface ActionSheetProps {
    showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void;
}
export interface ActionSheetIOSOptions {
    options: string[];
    title?: string;
    message?: string;
    tintColor?: string;
    cancelButtonIndex?: number;
    destructiveButtonIndex?: number;
    anchor?: number;
}
export interface ActionSheetOptions extends ActionSheetIOSOptions {
    icons?: React.ReactNode[];
    tintIcons?: boolean;
    textStyle?: TextStyle;
    titleTextStyle?: TextStyle;
    messageTextStyle?: TextStyle;
    showSeparators?: boolean;
    containerStyle?: ViewStyle;
    separatorStyle?: ViewStyle;
}
