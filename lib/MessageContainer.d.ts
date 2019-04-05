import PropTypes from 'prop-types';
import React, { RefObject } from 'react';
import { FlatList, ListViewProps, ListRenderItemInfo } from 'react-native';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import { User, IMessage } from './types';
interface MessageContainerProps<TMessage extends IMessage = IMessage> {
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
    renderFooter?(props: MessageContainerProps): React.ReactNode;
    renderMessage?(props: Message['props']): React.ReactNode;
    renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode;
    scrollToBottomComponent?(): React.ReactNode;
    onLoadEarlier?(): void;
}
export default class MessageContainer extends React.PureComponent<MessageContainerProps, {
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
    flatListRef?: RefObject<FlatList<IMessage>>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: MessageContainerProps): void;
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
    renderRow: ({ item, index }: ListRenderItemInfo<IMessage>) => {} | null | undefined;
    renderHeaderWrapper: () => JSX.Element;
    renderScrollToBottomWrapper(): JSX.Element;
    keyExtractor: (item: IMessage) => string;
    render(): JSX.Element;
}
export {};
