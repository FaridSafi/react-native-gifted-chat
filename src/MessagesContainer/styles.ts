import { Platform, StyleSheet } from 'react-native'
import { Color } from '../Color'

export default StyleSheet.create({
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
  emptyChatContainer: {
    transform: [{ scaleY: -1 }],
  },
  scrollToBottom: {
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
  },
  scrollToBottomContent: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    ...Platform.select({
      ios: {
        shadowColor: Color.black,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
      },
      android: {
        elevation: 5,
      },
    }),
  },
})
