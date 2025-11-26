declare const styles: {
    wrapper: {
        borderRadius: number;
        minHeight: number;
    };
    wrapper_left: {
        backgroundColor: string;
        justifyContent: "flex-end";
    };
    wrapper_right: {
        backgroundColor: string;
        justifyContent: "flex-end";
    };
    bottom: {
        flexDirection: "row";
        justifyContent: "space-between";
        alignItems: "flex-end";
        paddingHorizontal: number;
        paddingBottom: number;
    };
    containerToNext_left: {
        borderBottomLeftRadius: number;
    };
    containerToNext_right: {
        borderBottomRightRadius: number;
    };
    containerToPrevious_left: {
        borderTopLeftRadius: number;
    };
    containerToPrevious_right: {
        borderTopRightRadius: number;
    };
    messageTimeAndStatusContainer: {
        flexGrow: number;
        flexDirection: "row";
        alignItems: "center";
        justifyContent: "flex-end";
    };
    messageStatusContainer: {
        flexDirection: "row";
        marginLeft: number;
    };
    messageStatus: {
        fontSize: number;
        color: string;
    };
    usernameContainer: {
        flexDirection: "row";
        marginRight: number;
    };
    username: {
        fontSize: number;
        color: string;
    };
};
export default styles;
