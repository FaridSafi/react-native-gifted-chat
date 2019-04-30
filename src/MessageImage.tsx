import PropTypes from 'prop-types'
import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  ImageProps,
  ViewStyle,
  ImageStyle,
} from 'react-native'
// @ts-ignore
import Lightbox from 'react-native-lightbox'
import { IMessage } from './types'

interface MessageImageProps<TMessage extends IMessage = IMessage> {
  currentMessage?: TMessage
  containerStyle?: ViewStyle
  imageStyle?: ImageStyle
  imageProps?: Partial<ImageProps>
  lightboxProps?: object
}

export default function MessageImage({
  containerStyle,
  lightboxProps,
  imageProps,
  imageStyle,
  currentMessage,
}: MessageImageProps) {
  if (!!currentMessage) {
    return (
      <View style={[styles.container, containerStyle]}>
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
          />
        </Lightbox>
      </View>
    )
  }
  return null
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
})

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
