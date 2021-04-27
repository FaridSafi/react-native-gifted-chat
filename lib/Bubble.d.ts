import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import QuickReplies from './QuickReplies';
import MessageText from './MessageText';
import MessageImage from './MessageImage';
import Time from './Time';
import { User, IMessage, LeftRightStyle, Reply, Omit, MessageVideoProps, MessageAudioProps } from './Models';
export declare type RenderMessageImageProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageImage['props'];
export declare type RenderMessageVideoProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageVideoProps<TMessage>;
export declare type RenderMessageAudioProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageAudioProps<TMessage>;
export declare type RenderMessageTextProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageText['props'];
export interface BubbleProps<TMessage extends IMessage> {
    user?: User;
    touchableProps?: object;
    renderUsernameOnMessage?: boolean;
    isCustomViewBottom?: boolean;
    inverted?: boolean;
    position: 'left' | 'right';
    currentMessage?: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    optionTitles?: string[];
    containerStyle?: LeftRightStyle<ViewStyle>;
    wrapperStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    bottomContainerStyle?: LeftRightStyle<ViewStyle>;
    tickStyle?: StyleProp<TextStyle>;
    containerToNextStyle?: LeftRightStyle<ViewStyle>;
    containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
    usernameStyle?: TextStyle;
    quickReplyStyle?: StyleProp<ViewStyle>;
    onPress?(context?: any, message?: any): void;
    onLongPress?(context?: any, message?: any): void;
    onQuickReply?(replies: Reply[]): void;
    renderMessageImage?(props: RenderMessageImageProps<TMessage>): React.ReactNode;
    renderMessageVideo?(props: RenderMessageVideoProps<TMessage>): React.ReactNode;
    renderMessageAudio?(props: RenderMessageAudioProps<TMessage>): React.ReactNode;
    renderMessageText?(props: RenderMessageTextProps<TMessage>): React.ReactNode;
    renderCustomView?(bubbleProps: BubbleProps<TMessage>): React.ReactNode;
    renderTime?(timeProps: Time['props']): React.ReactNode;
    renderTicks?(currentMessage: TMessage): React.ReactNode;
    renderUsername?(): React.ReactNode;
    renderQuickReplySend?(): React.ReactNode;
    renderQuickReplies?(quickReplies: QuickReplies['props']): React.ReactNode;
}
export default class Bubble<TMessage extends IMessage = IMessage> extends React.Component<BubbleProps<TMessage>> {
    static contextTypes: {
        actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        touchableProps: {};
        onPress: null;
        onLongPress: null;
        renderMessageImage: null;
        renderMessageVideo: null;
        renderMessageAudio: null;
        renderMessageText: null;
        renderCustomView: null;
        renderUsername: null;
        renderTicks: null;
        renderTime: null;
        renderQuickReplies: null;
        onQuickReply: null;
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
        renderMessageAudio: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageText: PropTypes.Requireable<(...args: any[]) => any>;
        renderCustomView: PropTypes.Requireable<(...args: any[]) => any>;
        isCustomViewBottom: PropTypes.Requireable<boolean>;
        renderUsernameOnMessage: PropTypes.Requireable<boolean>;
        renderUsername: PropTypes.Requireable<(...args: any[]) => any>;
        renderTime: PropTypes.Requireable<(...args: any[]) => any>;
        renderTicks: PropTypes.Requireable<(...args: any[]) => any>;
        renderQuickReplies: PropTypes.Requireable<(...args: any[]) => any>;
        onQuickReply: PropTypes.Requireable<(...args: any[]) => any>;
        position: PropTypes.Requireable<string>;
        optionTitles: PropTypes.Requireable<(string | null | undefined)[]>;
        currentMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        wrapperStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        bottomContainerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        tickStyle: PropTypes.Requireable<number | boolean | object>;
        usernameStyle: PropTypes.Requireable<number | boolean | object>;
        containerToNextStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
        containerToPreviousStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number | boolean | object>;
            right: PropTypes.Requireable<number | boolean | object>;
        }>>;
    };
    onPress: () => void;
    onLongPress: () => void;
    styledBubbleToNext(): (false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | null | undefined> | {
        borderBottomLeftRadius: number;
    } | {
        borderBottomRightRadius: number;
    } | null | undefined)[] | null;
    styledBubbleToPrevious(): (false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | null | undefined> | {
        borderTopLeftRadius: number;
    } | {
        borderTopRightRadius: number;
    } | null | undefined)[] | null;
    renderQuickReplies(): {} | null | undefined;
    renderMessageText(): {} | null | undefined;
    renderMessageImage(): {} | null | undefined;
    renderMessageVideo(): {} | null | undefined;
    renderMessageAudio(): {} | null | undefined;
    renderTicks(): {} | null | undefined;
    renderTime(): {} | null | undefined;
    renderUsername(): JSX.Element | null;
    renderCustomView(): {} | null | undefined;
    renderBubbleContent(): JSX.Element;
    render(): JSX.Element;
}
