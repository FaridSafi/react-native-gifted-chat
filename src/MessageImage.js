import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  Modal,
  TouchableOpacity,
} from 'react-native'
// @ts-ignore
// import Lightbox from 'react-native-lightbox';
import ImageViewer from 'react-native-image-zoom-viewer'
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
})
export default class MessageImage extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
    }
  }
  render() {
    const {
      containerStyle,
      lightboxProps,
      imageProps,
      imageStyle,
      currentMessage,
    } = this.props
    const images = [
      {
        url: currentMessage.image,
      },
    ]
    if (!!currentMessage) {
      return (
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                visible: !this.state.visible,
              })
            }
          >
            <Image
              {...imageProps}
              style={[styles.image, imageStyle]}
              source={{ uri: currentMessage.image }}
            />
          </TouchableOpacity>
          <Modal visible={this.state.visible} transparent={true}>
            <ImageViewer
              imageUrls={images}
              enableSwipeDown
              onSwipeDown={() =>
                this.setState({
                  visible: !this.state.visible,
                })
              }
              menuContext={{
                saveToLocal: 'Save',
                cancel: 'Cancel',
              }}
            />
          </Modal>
        </View>
      )
    }
    return null
  }
}
MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
}
MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: PropTypes.object,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}
//# sourceMappingURL=MessageImage.js.map
