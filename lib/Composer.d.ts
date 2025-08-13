import React from 'react';
import { TextInputProps } from 'react-native';
export interface ComposerProps {
    composerHeight?: number;
    text?: string;
    placeholder?: string;
    placeholderTextColor?: string;
    textInputProps?: Partial<TextInputProps>;
    textInputStyle?: TextInputProps['style'];
    textInputAutoFocus?: boolean;
    keyboardAppearance?: TextInputProps['keyboardAppearance'];
    multiline?: boolean;
    disableComposer?: boolean;
    onTextChanged?(text: string): void;
    onInputSizeChanged?(layout: {
        width: number;
        height: number;
    }): void;
}
export declare function Composer({ composerHeight, disableComposer, keyboardAppearance, multiline, onInputSizeChanged, onTextChanged, placeholder, placeholderTextColor, text, textInputAutoFocus, textInputProps, textInputStyle, }: ComposerProps): React.ReactElement;
