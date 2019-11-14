import PropTypes from 'prop-types';
import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import QuickReplies from './QuickReplies';
import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import MessageLocation from './MessageLocation';
import MessageDocument from './MessageDocument';
import MessageContact from './MessageContact';
import Time from './Time';
import { User, IMessage, LeftRightStyle, Reply, Omit } from './types';
export declare type RenderMessageImageProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageImage['props'];
export declare type RenderMessageDocumentProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageDocument['props'];
export declare type RenderMessageContactProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageContact['props'];
export declare type RenderMessageVideoProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageVideo['props'];
export declare type RenderMessageLocationProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageLocation['props'];
export declare type RenderMessageTextProps<TMessage extends IMessage> = Omit<BubbleProps<TMessage>, 'containerStyle' | 'wrapperStyle'> & MessageText['props'];
export interface BubbleProps<TMessage extends IMessage> {
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
    tickStyle?: StyleProp<TextStyle>;
    containerToNextStyle?: LeftRightStyle<ViewStyle>;
    containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
    usernameStyle?: LeftRightStyle<ViewStyle>;
    quickReplyStyle?: StyleProp<ViewStyle>;
    onLongPress?(context?: any, message?: any): void;
    onQuickReply?(replies: Reply[]): void;
    renderMessageImage?(props: RenderMessageImageProps<TMessage>): React.ReactNode;
    renderMessageDocument?(props: RenderMessageDocumentProps<TMessage>): React.ReactNode;
    renderMessageContact?(props: RenderMessageContactProps<TMessage>): React.ReactNode;
    renderMessageVideo?(props: RenderMessageVideoProps<TMessage>): React.ReactNode;
    renderMessageLocation?(props: RenderMessageLocationProps<TMessage>): React.ReactNode;
    renderMessageText?(props: RenderMessageTextProps<TMessage>): React.ReactNode;
    renderCustomView?(bubbleProps: BubbleProps<TMessage>): React.ReactNode;
    renderTime?(timeProps: Time['props']): React.ReactNode;
    renderTicks?(currentMessage: TMessage): React.ReactNode;
    renderUsername?(): React.ReactNode;
    renderQuickReplySend?(): React.ReactNode;
    renderQuickReplies?(quickReplies: QuickReplies['props']): React.ReactNode;
    isSameDay?(currentMessage: TMessage, nextMessage: TMessage): boolean;
    isSameUser?(currentMessage: TMessage, nextMessage: TMessage): boolean;
}
export default class Bubble<TMessage extends IMessage = IMessage> extends React.Component<BubbleProps<TMessage>> {
    static contextTypes: {
        actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        touchableProps: {};
        onLongPress: null;
        renderMessageImage: null;
        renderMessageDocument: null;
        renderMessageContact: null;
        renderMessageVideo: null;
        renderMessageLocation: null;
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
        renderMessageDocument: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageContact: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageVideo: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageLocation: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessageText: PropTypes.Requireable<(...args: any[]) => any>;
        renderCustomView: PropTypes.Requireable<(...args: any[]) => any>;
        renderUsernameOnMessage: PropTypes.Requireable<boolean>;
        renderUsername: PropTypes.Requireable<(...args: any[]) => any>;
        renderTime: PropTypes.Requireable<(...args: any[]) => any>;
        renderTicks: PropTypes.Requireable<(...args: any[]) => any>;
        renderQuickReplies: PropTypes.Requireable<(...args: any[]) => any>;
        onQuickReply: PropTypes.Requireable<(...args: any[]) => any>;
        position: PropTypes.Requireable<string>;
        optionTitles: PropTypes.Requireable<(string | null)[]>;
        currentMessage: PropTypes.Requireable<object>;
        nextMessage: PropTypes.Requireable<object>;
        previousMessage: PropTypes.Requireable<object>;
        containerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
            right: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        }>>;
        wrapperStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
            right: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        }>>;
        bottomContainerStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
            right: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        }>>;
        tickStyle: PropTypes.Requireable<any>;
        usernameStyle: PropTypes.Requireable<any>;
        containerToNextStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
            right: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        }>>;
        containerToPreviousStyle: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
            right: PropTypes.Validator<StyleProp<ViewStyle>> | undefined;
        }>>;
    };
    onLongPress: () => void;
    handleBubbleToNext(): (false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | null | undefined> | {
        borderBottomLeftRadius: number;
    } | {
        borderBottomRightRadius: number;
    } | null | undefined)[] | null;
    handleBubbleToPrevious(): (false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<false | ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | null | undefined> | {
        borderTopLeftRadius: number;
    } | {
        borderTopRightRadius: number;
    } | null | undefined)[] | null;
    renderQuickReplies(): {} | null | undefined;
    renderMessageText(): {} | null | undefined;
    renderMessageImage(): {} | null | undefined;
    renderMessageVideo(): {} | null | undefined;
    renderMessageLocation(): {} | null | undefined;
    renderMessageDocument(): {} | null | undefined;
    renderMessageContact(): {} | null | undefined;
    renderTicks(): {} | null | undefined;
    renderTime(): {} | null | undefined;
    renderUsername(): JSX.Element | null;
    renderCustomView(): {} | null | undefined;
    render(): JSX.Element;
}
