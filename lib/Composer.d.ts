import React from 'react';
import { TextInputProps } from 'react-native';
export interface ComposerProps {
    composerHeight?: number;
    text?: string;
    textInputProps?: Partial<TextInputProps>;
}
export declare function Composer({ text, textInputProps, }: ComposerProps): React.ReactElement;
