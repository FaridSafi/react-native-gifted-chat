import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Color from './Color'

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
})

export interface SendProps {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
  alwaysShowSend?: boolean
  disabled?: boolean
  onSend?({ text }: { text: string }, b: boolean): void
}

export default class Send extends Component<SendProps> {
  static defaultProps = {
    text: '',
    onSend: () => {},
    label: 'Send',
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: false,
    disabled: false,
  }

  static propTypes = {
    text: PropTypes.string,
    onSend: PropTypes.func,
    label: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    children: PropTypes.element,
    alwaysShowSend: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  render() {
    const {
      text,
      containerStyle,
      onSend,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
    } = this.props
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        <TouchableOpacity
          testID='send'
          accessible
          accessibilityLabel='send'
          style={[styles.container, containerStyle]}
          onPress={() => {
            if (text && onSend) {
              onSend({ text: text.trim() }, true)
            }
          }}
          accessibilityTraits='button'
          disabled={disabled}
        >
          <View>
            {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
          </View>
        </TouchableOpacity>
      )
    }
    return <View />
  }
}
