import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  webContent: StyleSheet.absoluteFillObject,
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    backgroundColor: '#000',
  },
  body: {
    backgroundColor: '#E0E0E0',
  },
  textBoxSafeArea: {
    marginBottom: StyleSheet.hairlineWidth,
    backgroundColor: '#FFF',
  },
  textBox: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  textViewBox: {
    justifyContent: 'center',
    minHeight: 45,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#757575',
  },
  messageText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#9E9E9E',
  },
  buttonBoxSafeArea: {
    marginTop: StyleSheet.hairlineWidth,
    backgroundColor: '#FFF',
  },
  buttonBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    padding: 8,
    backgroundColor: '#FFF',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButtonBoxSafeArea: {
    marginTop: StyleSheet.hairlineWidth * 12,
  },
})

const TINT_COLOR = '#1E88E5'
const UNDERLAY_COLOR = '#F4F4F4'
const WARN_COLOR = '#F44336'

export { TINT_COLOR, UNDERLAY_COLOR, WARN_COLOR }
export default styles
