import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { IMessage } from './types';
export interface DayProps<TMessage extends IMessage> {
    currentMessage?: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    dateFormat?: string;
    inverted?: boolean;
}
export default class Day<TMessage extends IMessage = IMessage> extends PureComponent<DayProps<TMessage>> {
    static contextTypes: {
        getLocale: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        currentMessage: {
            createdAt: null;
        };
        previousMessage: {};
        nextMessage: {};
        containerStyle: {};
        wrapperStyle: {};
        textStyle: {};
        dateFormat: string;
    };
    static propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        inverted: PropTypes.Requireable<boolean>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        wrapperStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        textStyle: PropTypes.Requireable<any>;
        dateFormat: PropTypes.Requireable<string>;
    };
    render(): JSX.Element | null;
}
