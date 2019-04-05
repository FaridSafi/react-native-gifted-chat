import { ViewStyle, TextStyle } from 'react-native';
import PropTypes from 'prop-types';
import { IMessage } from './types';
interface SystemMessageProps<TMessage extends IMessage = IMessage> {
    currentMessage?: TMessage;
    containerStyle?: ViewStyle;
    wrapperStyle?: ViewStyle;
    textStyle?: TextStyle;
}
export default function SystemMessage({ currentMessage, containerStyle, wrapperStyle, textStyle, }: SystemMessageProps): JSX.Element | null;
export default namespace SystemMessage {
    var defaultProps: {
        currentMessage: {
            system: boolean;
        };
        containerStyle: {};
        wrapperStyle: {};
        textStyle: {};
    };
    var propTypes: {
        currentMessage: PropTypes.Requireable<object>;
        containerStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        wrapperStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        textStyle: PropTypes.Requireable<any>;
    };
}
export {};
