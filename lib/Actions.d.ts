import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
interface ActionsProps {
    options?: {
        [key: string]: any;
    };
    optionTintColor?: string;
    icon?: () => ReactNode;
    wrapperStyle?: ViewStyle;
    iconTextStyle?: TextStyle;
    containerStyle?: ViewStyle;
    onPressActionButton?(): void;
}
export default class Actions extends React.Component<ActionsProps> {
    static defaultProps: ActionsProps;
    static propTypes: {
        onSend: PropTypes.Requireable<(...args: any[]) => any>;
        options: PropTypes.Requireable<object>;
        optionTintColor: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<(...args: any[]) => any>;
        onPressActionButton: PropTypes.Requireable<(...args: any[]) => any>;
        wrapperStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        containerStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
    };
    static contextTypes: {
        actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
    };
    onActionsPress: () => void;
    renderIcon(): {} | null | undefined;
    render(): JSX.Element;
}
export {};
