import PropTypes from 'prop-types';
import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import Time from './Time';
import { User, IMessage, LeftRightStyle } from './types';
interface BubbleProps<TMessage extends IMessage = IMessage> {
    user?: User;
    touchableProps?: object;
    renderUsernameOnMessage?: boolean;
    position: 'left' | 'right';
    currentMessage?: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    optionTitles?: string;
    containerStyle?: LeftRightStyle<ViewStyle>;
    wrapperStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    bottomContainerStyle?: LeftRightStyle<ViewStyle>;
    tickStyle?: TextStyle;
    containerToNextStyle?: LeftRightStyle<ViewStyle>;
    containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
    usernameStyle?: LeftRightStyle<ViewStyle>;
    onLongPress?(context?: any, message?: any): void;
    renderMessageImage?(messageImageProps: MessageImage['props']): React.ReactNode;
    renderMessageVideo?(messageVideoProps: MessageVideo['props']): React.ReactNode;
    renderMessageText?(messageTextProps: MessageText['props']): React.ReactNode;
    renderCustomView?(bubbleProps: BubbleProps): React.ReactNode;
    renderTime?(timeProps: Time['props']): React.ReactNode;
    renderTicks?(currentMessage: TMessage): React.ReactNode;
    renderUsername?(): React.ReactNode;
    isSameDay?(currentMessage: TMessage, nextMessage: TMessage): boolean;
    isSameUser?(currentMessage: TMessage, nextMessage: TMessage): boolean;
}
export default class Bubble extends React.Component<BubbleProps> {
    static contextTypes: {
        actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        touchableProps: {};
        onLongPress: null;
        renderMessageImage: null;
        renderMessageVideo: null;
        renderMessageText: null;
        renderCustomView: null;
        renderUsername: null;
        renderTicks: null;
        renderTime: null;
        position: string;
        optionTitles: string[];
        currentMessage: {
            text: null;
            createdAt: null;
            image: null;
        };
        nextMessage: {};
        previousMessage: {};
        containerStyle: {};
        wrapperStyle: {};
        bottomContainerStyle: {};
        tickStyle: {};
        usernameStyle: {};
        containerToNextStyle: {};
        containerToPreviousStyle: {};
    };
    static propTypes: {
        user: PropTypes.Validator<object>;
        touchableProps: PropTypes.Requireable<object>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageImage: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageVideo: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageText: PropTypes.Requireable<(...args: any[]) => any>;
        renderCustomView: PropTypes.Requireable<(...args: any[]) => any>;
        renderUsernameOnMessage: PropTypes.Requireable<boolean>;
        renderUsername: PropTypes.Requireable<(...args: any[]) => any>;
        renderTime: PropTypes.Requireable<(...args: any[]) => any>;
        renderTicks: PropTypes.Requireable<(...args: any[]) => any>;
        position: PropTypes.Requireable<string>;
        optionTitles: PropTypes.Requireable<(string | null)[]>;
        currentMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        wrapperStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        bottomContainerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        tickStyle: PropTypes.Requireable<any>;
        usernameStyle: PropTypes.Requireable<any>;
        containerToNextStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
        containerToPreviousStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
            right: ((object: import("react-native").ViewProps, key: string, componentName: string, ...rest: any[]) => Error | null) | undefined;
        }>>;
    };
    onLongPress: () => void;
    handleBubbleToNext(): (ViewStyle | {
        borderBottomLeftRadius: number;
    } | {
        borderBottomRightRadius: number;
    } | undefined)[] | null;
    handleBubbleToPrevious(): (ViewStyle | {
        borderTopLeftRadius: number;
    } | {
        borderTopRightRadius: number;
    } | undefined)[] | null;
    renderMessageText(): {} | null | undefined;
    renderMessageImage(): {} | null | undefined;
    renderMessageVideo(): {} | null | undefined;
    renderTicks(): {} | null | undefined;
    renderTime(): {} | null | undefined;
    renderUsername(): JSX.Element | null;
    renderCustomView(): {} | null | undefined;
    render(): JSX.Element;
}
export {};
