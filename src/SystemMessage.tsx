import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import PropTypes from 'prop-types'
import Color from './Color'
import { IMessage } from './types'
import MessageText from './MessageText'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '300',
  },
})

export interface SystemMessageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  linkStyle?: StyleProp<TextStyle>
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
    linkStyle: {},
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    linkStyle: PropTypes.any,
  }

  render() {
    const { containerStyle, wrapperStyle, textStyle, linkStyle, ...messageTextProps } = this.props;
    if (this.props.currentMessage) {
      return (
        <View style={[styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <MessageText customTextStyle={[styles.text, textStyle]} customLinkStyle={linkStyle} {...messageTextProps}/>
          </View>
        </View>
      )
    }
    return null
  }
}
