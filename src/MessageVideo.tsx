import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  ViewStyle,
  ImageStyle,
} from 'react-native'
import Video, { VideoProperties } from 'react-native-video'
import { IMessage } from './types'

interface MessageVideoProps<TMessage extends IMessage = IMessage> {
  currentMessage?: TMessage
  containerStyle?: ViewStyle
  videoStyle?: ViewStyle
  videoProps?: Partial<VideoProperties>
  // todo: should be LightBox properties
  lightboxProps?: object
}

export default class MessageVideo extends React.Component<MessageVideoProps> {
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
          ref={r => {
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
