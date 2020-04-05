import PropTypes from 'prop-types';
import React, { RefObject } from 'react';
import { FlatList, ListViewProps, ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle } from 'react-native';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import { User, IMessage, Reply } from './types';
export interface MessageContainerProps<TMessage extends IMessage> {
    messages?: TMessage[];
    user?: User;
    listViewProps: Partial<ListViewProps>;
    inverted?: boolean;
    loadEarlier?: boolean;
    alignTop?: boolean;
    scrollToBottom?: boolean;
    scrollToBottomStyle?: StyleProp<ViewStyle>;
    invertibleScrollViewProps?: any;
    extraData?: any;
    scrollToBottomOffset?: number;
    forwardRef?: RefObject<FlatList<IMessage>>;
    renderChatEmpty?(): React.ReactNode;
    renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode;
    renderMessage?(props: Message['props']): React.ReactNode;
    renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode;
    scrollToBottomComponent?(): React.ReactNode;
    onLoadEarlier?(): void;
    onQuickReply?(replies: Reply[]): void;
}
interface State {
    showScrollBottom: boolean;
}
export default class MessageContainer<TMessage extends IMessage = IMessage> extends React.PureComponent<MessageContainerProps<TMessage>, State> {
    static defaultProps: {
        messages: never[];
        user: {};
        renderChatEmpty: null;
        renderFooter: null;
        renderMessage: null;
        onLoadEarlier: () => void;
        onQuickReply: () => void;
        inverted: boolean;
        loadEarlier: boolean;
        listViewProps: {};
        invertibleScrollViewProps: {};
        extraData: null;
        scrollToBottom: boolean;
        scrollToBottomOffset: number;
        alignTop: boolean;
        scrollToBottomStyle: {};
    };
    static propTypes: {
        messages: PropTypes.Requireable<(object | null)[]>;
        user: PropTypes.Requireable<object>;
        renderChatEmpty: PropTypes.Requireable<(...args: any[]) => any>;
        renderFooter: PropTypes.Requireable<(...args: any[]) => any>;
        renderMessage: PropTypes.Requireable<(...args: any[]) => any>;
        renderLoadEarlier: PropTypes.Requireable<(...args: any[]) => any>;
        onLoadEarlier: PropTypes.Requireable<(...args: any[]) => any>;
        listViewProps: PropTypes.Requireable<object>;
        inverted: PropTypes.Requireable<boolean>;
        loadEarlier: PropTypes.Requireable<boolean>;
        invertibleScrollViewProps: PropTypes.Requireable<object>;
        extraData: PropTypes.Requireable<object>;
        scrollToBottom: PropTypes.Requireable<boolean>;
        scrollToBottomOffset: PropTypes.Requireable<number>;
        scrollToBottomComponent: PropTypes.Requireable<(...args: any[]) => any>;
        alignTop: PropTypes.Requireable<boolean>;
    };
    state: {
        showScrollBottom: boolean;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: MessageContainerProps<TMessage>): void;
    attachKeyboardListeners: () => void;
    detachKeyboardListeners: () => void;
    renderFooter: () => {} | null | undefined;
    renderLoadEarlier: () => {} | null | undefined;
    scrollTo(options: {
        animated?: boolean;
        offset: number;
    }): void;
    scrollToBottom: (animated?: boolean) => void;
    handleOnScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    renderRow: ({ item, index }: ListRenderItemInfo<TMessage>) => {} | null | undefined;
    renderChatEmpty: () => {} | null | undefined;
    renderHeaderWrapper: () => JSX.Element;
    renderScrollBottomComponent(): {} | null | undefined;
    renderScrollToBottomWrapper(): JSX.Element;
    onLayoutList: () => void;
    keyExtractor: (item: TMessage) => string;
    render(): JSX.Element;
}
export {};
