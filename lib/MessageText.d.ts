import React from 'react';
import { TextProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { LeftRightStyle, IMessage } from './types';
export interface MessageTextProps<TMessage extends IMessage> {
    position?: 'left' | 'right';
    optionTitles?: string[];
    currentMessage: TMessage;
    containerStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    linkStyle?: LeftRightStyle<TextStyle>;
    textProps?: TextProps;
    customTextStyle?: StyleProp<TextStyle>;
    parsePatterns?: (linkStyle: TextStyle) => [];
}
export declare function MessageText<TMessage extends IMessage = IMessage>({ currentMessage, optionTitles, position, containerStyle, textStyle, linkStyle: linkStyleProp, customTextStyle, parsePatterns, textProps, }: MessageTextProps<TMessage>): React.JSX.Element;
