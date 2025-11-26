import React from 'react';
import { TextStyle, StyleProp } from 'react-native';
export type LinkType = 'url' | 'email' | 'phone' | 'mention' | 'hashtag';
export interface ParsedLink {
    type: LinkType;
    text: string;
    url: string;
    index: number;
    length: number;
}
export interface LinkMatcher {
    type: LinkType;
    pattern: RegExp;
    getLinkUrl?: (text: string) => string;
    getLinkText?: (text: string) => string;
    baseUrl?: string;
    style?: StyleProp<TextStyle>;
    renderLink?: (text: string, url: string, index: number, type: LinkType) => React.ReactNode;
    onPress?: (url: string, type: LinkType) => void;
}
interface LinkParserProps {
    text: string;
    matchers?: LinkMatcher[];
    email?: boolean;
    phone?: boolean;
    url?: boolean;
    hashtag?: boolean;
    mention?: boolean;
    hashtagUrl?: string;
    mentionUrl?: string;
    linkStyle?: StyleProp<TextStyle>;
    onPress?: (url: string, type: LinkType) => void;
    stripPrefix?: boolean;
    textStyle?: StyleProp<TextStyle>;
    TextComponent?: React.ComponentType<any>;
}
export declare function LinkParser({ text, matchers: customMatchers, email, phone, url, hashtag, mention, hashtagUrl, mentionUrl, linkStyle, onPress, stripPrefix, textStyle, TextComponent, }: LinkParserProps): React.ReactElement;
export {};
