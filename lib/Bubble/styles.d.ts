declare const styles: {
    left: {
        container: {
            alignItems: "flex-start";
        };
        wrapper: {
            borderRadius: number;
            backgroundColor: string;
            marginRight: number;
            minHeight: number;
            justifyContent: "flex-end";
        };
        containerToNext: {
            borderBottomLeftRadius: number;
        };
        containerToPrevious: {
            borderTopLeftRadius: number;
        };
        bottom: {
            flexDirection: "row";
            justifyContent: "flex-start";
        };
    };
    right: {
        container: {
            alignItems: "flex-end";
        };
        wrapper: {
            borderRadius: number;
            backgroundColor: string;
            marginLeft: number;
            minHeight: number;
            justifyContent: "flex-end";
        };
        containerToNext: {
            borderBottomRightRadius: number;
        };
        containerToPrevious: {
            borderTopRightRadius: number;
        };
        bottom: {
            flexDirection: "row";
            justifyContent: "flex-end";
        };
    };
    content: {
        tick: {
            fontSize: number;
            backgroundColor: string;
            color: string;
        };
        tickView: {
            flexDirection: "row";
            marginRight: number;
        };
        username: {
            top: number;
            left: number;
            fontSize: number;
            backgroundColor: string;
            color: string;
        };
        usernameView: {
            flexDirection: "row";
            marginHorizontal: number;
        };
    };
};
export default styles;
