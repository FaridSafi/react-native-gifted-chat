/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, View, ViewPropTypes, ActivityIndicator } from 'react-native';
import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      preloader: false,
    };

    this.preloaderShow = this.preloaderShow.bind(this);
    this.preloaderHide = this.preloaderHide.bind(this);
  }

  preloaderShow() {
    this.setState({
      preloader: true,
    });
  }

  preloaderHide() {
    this.setState({
      preloader: false,
    });
  }

  render() {
    const {
      containerStyle,
      lightboxProps,
      imageProps,
      imageStyle,
      currentMessage,
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.preloader}>
          <ActivityIndicator
            animating={this.state.preloader}
            hidesWhenStopped
          />
        </View>
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}
          {...lightboxProps}
        >
          <Image
            {...imageProps}
            style={[styles.image, imageStyle]}
            source={{ uri: currentMessage.image }}
            onLoadStart={this.preloaderShow}
            onLoadEnd={this.preloaderHide}
          />
        </Lightbox>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
  preloader: {
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
};
