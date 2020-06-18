import PropTypes from 'prop-types'
import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  ImageProps,
  ViewStyle,
  StyleProp,
  ImageStyle,
} from 'react-native'
// TODO: support web
import Lightbox from 'react-native-lightbox';
import { IMessage } from './Models'
import { StylePropType } from './utils'

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

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: object
}

export function MessageImage<TMessage extends IMessage = IMessage>(props: MessageImageProps<TMessage>) {
  const {
    containerStyle,
    lightboxProps,
    imageProps,
    imageStyle,
    currentMessage,
  } = props

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
  containerStyle: StylePropType,
  imageStyle: StylePropType,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}

export default MessageImage;
