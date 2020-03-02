import { Component } from 'react';
import { ViewStyle, StyleProp, TextStyle } from 'react-native';
import PropTypes from 'prop-types';
import { IMessage } from './types';
export interface SystemMessageProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export default class SystemMessage<TMessage extends IMessage = IMessage> extends Component<SystemMessageProps<TMessage>> {
    static defaultProps: {
        currentMessage: {
            system: boolean;
        };
        containerStyle: {};
        wrapperStyle: {};
        textStyle: {};
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        wrapperStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        textStyle: PropTypes.Requireable<any>;
    };
    render(): JSX.Element | null;
}
