import PropTypes from 'prop-types'
import React from 'react'
import { View, ViewPropTypes } from 'react-native'
import Video from 'react-native-video'
export default class MessageVideo extends React.Component {
  constructor() {
    super(...arguments)
    this.player = undefined
  }
  render() {
    const {
      containerStyle,
      videoProps,
      videoStyle,
      currentMessage,
    } = this.props
    if (!!currentMessage) {
      return (
        <View style={containerStyle}>
          <Video
            {...videoProps}
            ref={r => {
              this.player = r
            }}
            source={{ uri: currentMessage.video }}
            style={videoStyle}
            resizeMode='cover'
            controls
            paused
            fullscreen
          />
        </View>
      )
    }
  }
}
MessageVideo.defaultProps = {
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
MessageVideo.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  videoStyle: PropTypes.object,
  videoProps: PropTypes.object,
}
//# sourceMappingURL=MessageVideo.js.map
