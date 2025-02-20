import { StyleSheet } from 'react-native'
import Color from '../Color'

export default StyleSheet.create({
  container: {
    marginLeft: 8,
    width: 45,
    borderRadius: 15,
    backgroundColor: Color.leftBubbleBackground,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 4,
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
})
