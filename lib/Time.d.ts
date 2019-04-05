import PropTypes from 'prop-types';
import { ViewStyle, TextStyle } from 'react-native';
import { LeftRightStyle, IMessage } from './types';
interface TimeProps<TMessage extends IMessage = IMessage> {
    position: 'left' | 'right';
    currentMessage?: TMessage;
    containerStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    timeFormat?: string;
}
export default function Time({ position, containerStyle, currentMessage, timeFormat, textStyle, }: TimeProps, context: any): JSX.Element | null;
export default namespace Time {
    var contextTypes: {
        getLocale: PropTypes.Requireable<(...args: any[]) => any>;
    };
    var defaultProps: {
        position: string;
        currentMessage: {
            createdAt: null;
        };
        containerStyle: {};
        textStyle: {};
        timeFormat: string;
        timeTextStyle: {};
    };
    var propTypes: {
        position: PropTypes.Requireable<string>;
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        textStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<any>;
            right: PropTypes.Requireable<any>;
        }>>;
        timeFormat: PropTypes.Requireable<string>;
        timeTextStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<any>;
            right: PropTypes.Requireable<any>;
        }>>;
    };
}
export {};
