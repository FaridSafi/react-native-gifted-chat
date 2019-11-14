import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ImageStyle, TextStyle } from 'react-native';
import { User } from './types';
export interface GiftedAvatarProps {
    user?: User;
    avatarStyle?: StyleProp<ImageStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?(props: any): void;
}
export default class GiftedAvatar extends React.Component<GiftedAvatarProps> {
    static defaultProps: {
        user: {
            name: null;
            avatar: null;
        };
        onPress: null;
        avatarStyle: {};
        textStyle: {};
    };
    static propTypes: {
        user: PropTypes.Requireable<object>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
    };
    avatarName?: string;
    avatarColor?: string;
    setAvatarColor(): void;
    renderAvatar(): JSX.Element | null;
    renderInitials(): JSX.Element;
    render(): JSX.Element;
}
