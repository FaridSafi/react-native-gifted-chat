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
import Lightbox, { LightboxProps } from 'react-native-lightbox-v2'
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
  lightboxProps?: LightboxProps
}

export function MessageImage<TMessage extends IMessage = IMessage>({
  containerStyle,
  lightboxProps = {},
  imageProps = {},
  imageStyle,
  currentMessage,
}: MessageImageProps<TMessage>) {
  if (currentMessage == null) {
    return null
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{
          style: styles.imageActive,
        }}
        {...lightboxProps}
      >
        <Image
          source={{ uri: currentMessage.image }}
          {...imageProps}
          style={[styles.image, imageStyle]}
        />
      </Lightbox>
    </View>
  )
}

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: StylePropType,
  imageStyle: StylePropType,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}
