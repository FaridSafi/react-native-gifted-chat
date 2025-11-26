declare const _default: {
    containerAlignTop: {
        flexDirection: "row";
        alignItems: "flex-start";
    };
    contentContainerStyle: {
        flexGrow: number;
        justifyContent: "flex-start";
        paddingBottom: number;
    };
    emptyChatContainer: {
        transform: {
            scaleY: number;
        }[];
    };
    scrollToBottom: {
        position: "absolute";
        right: number;
        bottom: number;
        zIndex: number;
    };
    scrollToBottomContent: {
        height: number;
        width: number;
        borderRadius: number;
        backgroundColor: string;
    } | {
        shadowColor: string;
        shadowOpacity: number;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowRadius: number;
        elevation?: undefined;
        height: number;
        width: number;
        borderRadius: number;
        backgroundColor: string;
    } | {
        elevation: number;
        shadowColor?: undefined;
        shadowOpacity?: undefined;
        shadowOffset?: undefined;
        shadowRadius?: undefined;
        height: number;
        width: number;
        borderRadius: number;
        backgroundColor: string;
    };
};
export default _default;
