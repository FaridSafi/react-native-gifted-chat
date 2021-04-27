import PropTypes from 'prop-types';
import { Component } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { LeftRightStyle, IMessage } from './Models';
export interface TimeProps<TMessage extends IMessage> {
    position: 'left' | 'right';
    currentMessage?: TMessage;
    containerStyle?: LeftRightStyle<ViewStyle>;
    timeTextStyle?: LeftRightStyle<TextStyle>;
    timeFormat?: string;
}
export default class Time<TMessage extends IMessage = IMessage> extends Component<TimeProps<TMessage>> {
    static contextTypes: {
        getLocale: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        position: string;
        currentMessage: {
            createdAt: null;
        };
        containerStyle: {};
        timeFormat: string;
        timeTextStyle: {};
    };
    static propTypes: {
        position: PropTypes.Requireable<string>;
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        timeFormat: PropTypes.Requireable<string>;
        timeTextStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
    };
    render(): JSX.Element | null;
}
