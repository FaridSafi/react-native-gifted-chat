import PropTypes from 'prop-types'
import React from 'react'
import {
  View,
  ViewPropTypes,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native'
import { IMessage } from './types'

const Video = Platform.select({
  web: () => <View />,
  default: () => require('react-native-video'),
})

interface MessageVideoProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  videoStyle?: StyleProp<ViewStyle>
  videoProps?: any
  // TODO: should be LightBox properties
  lightboxProps?: object
}

export default class MessageVideo<
  TMessage extends IMessage = IMessage
> extends React.Component<MessageVideoProps<TMessage>> {
  static defaultProps = {
    currentMessage: {
      video: null,
    },
    containerStyle: {},
    videoStyle: {
      width: 150,
      height: 100,
      borderRadius: 13,
      margin: 3,
    },
    videoProps: {},
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    videoStyle: ViewPropTypes.style,
    videoProps: PropTypes.object,
  }

  player: any = undefined

  render() {
    const {
      containerStyle,
      videoProps,
      videoStyle,
      currentMessage,
    } = this.props
    return (
      <View style={containerStyle}>
        <Video
          {...videoProps}
          ref={(r: any) => {
            this.player = r
          }}
          source={{ uri: currentMessage!.video! }}
          style={videoStyle}
          resizeMode='cover'
        />
      </View>
    )
  }
}
