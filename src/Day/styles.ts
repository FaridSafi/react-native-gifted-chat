import { StyleSheet } from 'react-native'
import Color from '../Color'

export default StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
  },
  text: {
    color: Color.white,
    fontSize: 12,
    fontWeight: '600',
  },
})
