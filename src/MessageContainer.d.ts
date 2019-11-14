import PropTypes from 'prop-types';
import React, { RefObject } from 'react';
import { FlatList, ListViewProps, ListRenderItemInfo } from 'react-native';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import { User, IMessage } from './types';
export interface MessageContainerProps<TMessage extends IMessage> {
    messages?: TMessage[];
    user?: User;
    listViewProps: Partial<ListViewProps>;
    inverted?: boolean;
    loadEarlier?: boolean;
    alignTop?: boolean;
    scrollToBottom?: boolean;
    invertibleScrollViewProps?: any;
    extraData?: any;
    scrollToBottomOffset?: number;
    renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode;
    renderMessage?(props: Message['props']): React.ReactNode;
    renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode;
    scrollToBottomComponent?(): React.ReactNode;
    onLoadEarlier?(): void;
}
export default class MessageContainer<TMessage extends IMessage = IMessage> extends React.PureComponent<MessageContainerProps<TMessage>, {
    showScrollBottom: boolean;
}> {
    static defaultProps: {
        messages: never[];
        user: {};
        renderFooter: null;
        renderMessage: null;
        onLoadEarlier: () => void;
        inverted: boolean;
        loadEarlier: boolean;
        listViewProps: {};
        invertibleScrollViewProps: {};
        extraData: null;
        scrollToBottom: boolean;
        scrollToBottomOffset: number;
        alignTop: boolean;
    };
    static propTypes: {
        messages: PropTypes.Requireable<(object | null)[]>;
        user: PropTypes.Requireable<object>;
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
    flatListRef?: RefObject<FlatList<TMessage>>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: MessageContainerProps<TMessage>): void;
    attachKeyboardListeners: () => void;
    detachKeyboardListeners: () => void;
    renderFooter: () => {} | null | undefined;
    renderLoadEarlier: () => {} | null | undefined;
    scrollTo(options: {
        animated?: boolean;
        offset: number;
    }): void;
    scrollToBottom: () => void;
    handleOnScroll: (event: any) => void;
    renderRow: ({ item, index }: ListRenderItemInfo<TMessage>) => {} | null | undefined;
    renderHeaderWrapper: () => JSX.Element;
    renderScrollBottomComponent(): {} | null | undefined;
    renderScrollToBottomWrapper(): JSX.Element;
    keyExtractor: (item: TMessage) => string;
    render(): JSX.Element;
}
