import { StyleSheet } from 'react-native'
import Color from '../Color'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  emptyChatContainer: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
  dayAnimated: {
    position: 'absolute',
    top: 10,
    width: '100%',
  },
  dayAnimatedContent: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 15,
  },
  dayAnimatedText: {
    fontSize: 12,
    color: 'white',
  },
})
