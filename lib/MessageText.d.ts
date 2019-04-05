import PropTypes from 'prop-types';
import React from 'react';
import { TextProps, ViewStyle, TextStyle } from 'react-native';
import { LeftRightStyle, IMessage } from './types';
interface MessageTextProps<TMessage extends IMessage = IMessage> {
    position: 'left' | 'right';
    currentMessage?: TMessage;
    containerStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    linkStyle?: LeftRightStyle<TextStyle>;
    textProps?: TextProps;
    customTextStyle?: TextStyle;
    parsePatterns?(linkStyle: TextStyle): any;
}
export default class MessageText extends React.Component<MessageTextProps> {
    static contextTypes: {
        actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        position: string;
        currentMessage: {
            text: string;
        };
        containerStyle: {};
        textStyle: {};
        linkStyle: {};
        customTextStyle: {};
        textProps: {};
        parsePatterns: () => never[];
    };
    static propTypes: {
        position: PropTypes.Requireable<string>;
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        textStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<object>;
            right: PropTypes.Requireable<object>;
        }>>;
        linkStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<object>;
            right: PropTypes.Requireable<object>;
        }>>;
        parsePatterns: PropTypes.Requireable<(...args: any[]) => any>;
        textProps: PropTypes.Requireable<object>;
        customTextStyle: PropTypes.Requireable<object>;
    };
    shouldComponentUpdate(nextProps: MessageTextProps): boolean;
    onUrlPress: (url: string) => void;
    onPhonePress: (phone: string) => void;
    onEmailPress: (email: string) => void;
    render(): JSX.Element;
}
export {};
