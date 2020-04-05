import PropTypes from 'prop-types';
import React from 'react';
import { EmitterSubscription, StyleProp, ViewStyle } from 'react-native';
import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
export interface InputToolbarProps {
    options?: {
        [key: string]: any;
    };
    optionTintColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
    primaryStyle?: StyleProp<ViewStyle>;
    accessoryStyle?: StyleProp<ViewStyle>;
    renderAccessory?(props: InputToolbarProps): React.ReactNode;
    renderActions?(props: Actions['props']): React.ReactNode;
    renderSend?(props: Send['props']): React.ReactNode;
    renderComposer?(props: Composer['props']): React.ReactNode;
    onPressActionButton?(): void;
}
export default class InputToolbar extends React.Component<InputToolbarProps, {
    position: string;
}> {
    static defaultProps: {
        renderAccessory: null;
        renderActions: null;
        renderSend: null;
        renderComposer: null;
        containerStyle: {};
        primaryStyle: {};
        accessoryStyle: {};
        onPressActionButton: () => void;
    };
    static propTypes: {
        renderAccessory: PropTypes.Requireable<(...args: any[]) => any>;
        renderActions: PropTypes.Requireable<(...args: any[]) => any>;
        renderSend: PropTypes.Requireable<(...args: any[]) => any>;
        renderComposer: PropTypes.Requireable<(...args: any[]) => any>;
        onPressActionButton: PropTypes.Requireable<(...args: any[]) => any>;
        containerStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        primaryStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        accessoryStyle: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
    };
    state: {
        position: string;
    };
    keyboardWillShowListener?: EmitterSubscription;
    keyboardWillHideListener?: EmitterSubscription;
    componentDidMount(): void;
    componentWillUnmount(): void;
    keyboardWillShow: () => void;
    keyboardWillHide: () => void;
    renderActions(): {} | null | undefined;
    renderSend(): {} | null | undefined;
    renderComposer(): {} | null | undefined;
    renderAccessory(): JSX.Element | null;
    render(): JSX.Element;
}
