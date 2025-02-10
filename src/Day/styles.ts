import { StyleSheet } from 'react-native'
import Color from '../Color'

export default StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 15,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600',
  },
})
