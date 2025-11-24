import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  container_left: {
    justifyContent: 'flex-start',
    marginLeft: 8,
  },
  container_right: {
    justifyContent: 'flex-end',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
})
