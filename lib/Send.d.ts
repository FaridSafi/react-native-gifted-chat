import PropTypes from 'prop-types';
import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
interface SendProps {
    text?: string;
    label?: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
    alwaysShowSend?: boolean;
    disabled?: boolean;
    onSend?({ text }: {
        text: string;
    }, b: boolean): void;
}
export default function Send({ text, containerStyle, onSend, children, textStyle, label, alwaysShowSend, disabled, }: SendProps): JSX.Element;
export default namespace Send {
    var defaultProps: {
        text: string;
        onSend: () => void;
        label: string;
        containerStyle: {};
        textStyle: {};
        children: null;
        alwaysShowSend: boolean;
        disabled: boolean;
    };
    var propTypes: {
        text: PropTypes.Requireable<string>;
        onSend: PropTypes.Requireable<(...args: any[]) => any>;
        label: PropTypes.Requireable<string>;
        containerStyle: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        textStyle: PropTypes.Requireable<any>;
        children: PropTypes.Requireable<PropTypes.ReactElementLike>;
        alwaysShowSend: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
    };
}
export {};
