import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import Video from 'react-native-video-controls';


export default function MessageVideo({
  containerStyle,
  videoProps,
  videoStyle,
  currentMessage,
}) {
  return (
    // eslint-disable-next-line no-use-before-define
    <View style={[styles.container, containerStyle]}>

      <Video
        {...videoProps}
        ref={(r) => { this.player = r; }}
        source={{ uri: currentMessage.video }}
        style={videoStyle}
        controls
        //onBuffer={this.onBuffer}
        //onLoadStart={this.onLoadStart}
        //onLoad={this.onLoad}
        paused
        resizeMode={this.props.resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});

MessageVideo.defaultProps = {
  currentMessage: {
    // video: null,
  },
  containerStyle: {},
  videoStyle: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,

  },
  videoProps: {},
  resizeMode: "cover",
};

MessageVideo.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  videoStyle: ViewPropTypes.style,
  videoProps: PropTypes.object,
  resizeMode: PropTypes.string,
};
