import React from 'react';
import { StyleProp, ImageStyle, TextStyle } from 'react-native';
import { User } from './types';
export interface GiftedAvatarProps {
    user?: User;
    avatarStyle?: StyleProp<ImageStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: (props: GiftedAvatarProps) => void;
    onLongPress?: (props: GiftedAvatarProps) => void;
}
export declare function GiftedAvatar(props: GiftedAvatarProps): React.JSX.Element;
