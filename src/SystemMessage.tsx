import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import PropTypes from 'prop-types'
import Color from './Color'
import { IMessage } from './Models'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  androidWorkaround: {
    transform: [{rotate: '180deg'}]
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '300',
  },
})

const androidWorkaroundContainerStyle = StyleSheet.compose<any>(styles.container, styles.androidWorkaround);

export interface SystemMessageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  androidWorkaround?: boolean
}

export default class SystemMessage<
  TMessage extends IMessage = IMessage
> extends Component<SystemMessageProps<TMessage>> {
  static defaultProps = {
    currentMessage: {
      system: false,
    },
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    androidWorkaround: false
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    androidWorkaround: PropTypes.bool
  }

  render() {
    const {
      currentMessage,
      containerStyle,
      wrapperStyle,
      textStyle,
      androidWorkaround
    } = this.props
    if (currentMessage) {
      return (
        <View style={[androidWorkaround ? androidWorkaroundContainerStyle : styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
          </View>
        </View>
      )
    }
    return null
  }
}
