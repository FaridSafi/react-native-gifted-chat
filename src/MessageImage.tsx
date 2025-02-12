import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  ImageProps,
  ViewStyle,
  StyleProp,
  ImageStyle,
  ImageURISource,
} from 'react-native'
// TODO: support web
import Lightbox, { LightboxProps } from 'react-native-lightbox-v2'
import { IMessage } from './types'
import stylesCommon from './styles'

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    resizeMode: 'contain',
  },
})

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageSourceProps?: Partial<ImageURISource>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: LightboxProps
}

export function MessageImage<TMessage extends IMessage = IMessage> ({
  containerStyle,
  lightboxProps,
  imageProps,
  imageSourceProps,
  imageStyle,
  currentMessage,
}: MessageImageProps<TMessage>) {
  if (currentMessage == null)
    return null

  return (
    <View style={containerStyle}>
      {/* @ts-expect-error: Lightbox types are not fully compatible */}
      <Lightbox
        activeProps={{
          style: [stylesCommon.fill, styles.imageActive],
        }}
        {...lightboxProps}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{ ...imageSourceProps, uri: currentMessage.image }}
        />
      </Lightbox>
    </View>
  )
}
