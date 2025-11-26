import { StyleSheet } from 'react-native';
import { Color } from '../Color';
const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 15,
        minHeight: 20,
    },
    wrapper_left: {
        backgroundColor: Color.leftBubbleBackground,
        justifyContent: 'flex-end',
    },
    wrapper_right: {
        backgroundColor: Color.defaultBlue,
        justifyContent: 'flex-end',
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    containerToNext_left: {
        borderBottomLeftRadius: 3,
    },
    containerToNext_right: {
        borderBottomRightRadius: 3,
    },
    containerToPrevious_left: {
        borderTopLeftRadius: 3,
    },
    containerToPrevious_right: {
        borderTopRightRadius: 3,
    },
    messageTimeAndStatusContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    messageStatusContainer: {
        flexDirection: 'row',
        marginLeft: 5,
    },
    messageStatus: {
        fontSize: 10,
        color: Color.white,
    },
    usernameContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    username: {
        fontSize: 12,
        color: '#aaa',
    },
});
export default styles;
//# sourceMappingURL=styles.js.map