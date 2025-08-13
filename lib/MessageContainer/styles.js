import { StyleSheet } from 'react-native';
import Color from '../Color';
export default StyleSheet.create({
    containerAlignTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    emptyChatContainer: {
        transform: [{ scaleY: -1 }],
    },
    scrollToBottomStyle: {
        opacity: 0.8,
        position: 'absolute',
        right: 10,
        bottom: 30,
        zIndex: 999,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Color.white,
        shadowColor: Color.black,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
    },
});
//# sourceMappingURL=styles.js.map