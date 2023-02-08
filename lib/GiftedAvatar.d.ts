import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ImageStyle, TextStyle } from 'react-native';
import { User } from './Models';
export interface GiftedAvatarProps {
    user?: User;
    avatarStyle?: StyleProp<ImageStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?(props: any): void;
    onLongPress?(props: any): void;
}
export default class GiftedAvatar extends React.Component<GiftedAvatarProps> {
    static defaultProps: {
        user: {
            name: null;
            avatar: null;
        };
        onPress: undefined;
        onLongPress: undefined;
        avatarStyle: {};
        textStyle: {};
    };
    static propTypes: {
        user: PropTypes.Requireable<object>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        avatarStyle: PropTypes.Requireable<number | boolean | object>;
        textStyle: PropTypes.Requireable<number | boolean | object>;
    };
    avatarName?: string;
    avatarColor?: string;
    setAvatarColor(): void;
    renderAvatar(): JSX.Element | null;
    renderInitials(): JSX.Element;
    handleOnPress: () => void;
    handleOnLongPress: () => void;
    render(): JSX.Element;
}
