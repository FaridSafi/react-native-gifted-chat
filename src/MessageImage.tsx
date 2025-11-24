import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Image,
  StyleSheet,
  View,
  ImageProps,
  ViewStyle,
  StyleProp,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  useWindowDimensions,
  StatusBar,
} from 'react-native'
import { BaseButton, GestureHandlerRootView, Text } from 'react-native-gesture-handler'
import { OverKeyboardView } from 'react-native-keyboard-controller'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import Zoom from 'react-native-zoom-reanimated'
import { TouchableOpacity } from './components/TouchableOpacity'
import { IMessage } from './Models'
import commonStyles from './styles'

interface ModalContentProps {
  isVisible: boolean
  imageSource: ImageURISource
  modalImageDimensions: { width: number, height: number } | undefined
  imageProps?: Partial<ImageProps>
  onClose: () => void
}

function ModalContent({ isVisible, imageSource, modalImageDimensions, imageProps, onClose }: ModalContentProps) {
  const insets = useSafeAreaInsets()

  // Animation values
  const modalOpacity = useSharedValue(0)
  const modalScale = useSharedValue(0.9)
  const modalBorderRadius = useSharedValue(40)

  const handleModalClose = useCallback(() => {
    modalOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) })
    modalScale.value = withTiming(0.9, { duration: 200, easing: Easing.in(Easing.ease) }, () => {
      runOnJS(onClose)()
    })
    modalBorderRadius.value = withTiming(40, { duration: 200, easing: Easing.in(Easing.ease) })
  }, [onClose, modalOpacity, modalScale, modalBorderRadius])

  // Animate on visibility change
  useEffect(() => {
    if (isVisible) {
      modalOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
      modalScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
      modalBorderRadius.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
    }
  }, [isVisible, modalOpacity, modalScale, modalBorderRadius])

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }), [modalOpacity, modalScale])

  const modalBorderRadiusStyle = useAnimatedStyle(() => ({
    borderRadius: modalBorderRadius.value,
  }), [modalBorderRadius])

  return (
    <>
      <StatusBar animated barStyle='dark-content' />
      <Animated.View style={[styles.modalOverlay, modalAnimatedStyle, modalBorderRadiusStyle]}>
        <GestureHandlerRootView style={commonStyles.fill}>
          <Animated.View style={[commonStyles.fill, styles.modalContent, modalBorderRadiusStyle, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

            {/* close button */}
            <View style={styles.closeButtonContainer}>
              <BaseButton onPress={handleModalClose}>
                <View style={styles.closeButtonContent}>
                  <Text style={styles.closeButtonIcon}>
                    {'X'}
                  </Text>
                </View>
              </BaseButton>
            </View>

            <View style={[commonStyles.fill, commonStyles.centerItems]}>
              <Zoom>
                <Image
                  style={modalImageDimensions}
                  source={imageSource}
                  resizeMode='contain'
                  {...imageProps}
                />
              </Zoom>
            </View>
          </Animated.View>
        </GestureHandlerRootView>
      </Animated.View>
    </>
  )
}

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageSourceProps?: Partial<ImageURISource>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
}

export function MessageImage<TMessage extends IMessage = IMessage> ({
  containerStyle,
  imageProps,
  imageSourceProps,
  imageStyle,
  currentMessage,
}: MessageImageProps<TMessage>) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number }>()
  const windowDimensions = useWindowDimensions()

  const imageSource = useMemo(() => ({
    ...imageSourceProps,
    uri: currentMessage?.image,
  }), [imageSourceProps, currentMessage?.image])

  const isImageSourceChanged = useRef(true)

  const computedImageStyle = useMemo(() => [
    styles.image,
    imageStyle,
  ], [imageStyle])

  const handleImagePress = useCallback(() => {
    if (!imageSource.uri)
      return

    setIsModalVisible(true)

    if (isImageSourceChanged.current || !imageDimensions)
      Image.getSize(imageSource.uri, (width, height) => {
        setImageDimensions({ width, height })
      })
  }, [imageSource.uri, imageDimensions])

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const handleImageLayout = useCallback((e: LayoutChangeEvent) => {
    setImageDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    })
  }, [])

  const modalImageDimensions = useMemo(() => {
    if (!imageDimensions)
      return undefined

    const aspectRatio = imageDimensions.width / imageDimensions.height

    let width = windowDimensions.width
    let height = width / aspectRatio

    if (height > windowDimensions.height) {
      height = windowDimensions.height
      width = height * aspectRatio
    }

    return {
      width,
      height,
    }
  }, [imageDimensions, windowDimensions.height, windowDimensions.width])

  useEffect(() => {
    isImageSourceChanged.current = true
  }, [imageSource.uri])

  if (currentMessage == null)
    return null

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={handleImagePress}>
        <Image
          {...imageProps}
          style={computedImageStyle}
          source={imageSource}
          onLayout={handleImageLayout}
          resizeMode='cover'
        />
      </TouchableOpacity>

      <OverKeyboardView visible={isModalVisible}>
        <SafeAreaProvider>
          <ModalContent
            isVisible={isModalVisible}
            imageSource={imageSource}
            modalImageDimensions={modalImageDimensions}
            imageProps={imageProps}
            onClose={handleModalClose}
          />
        </SafeAreaProvider>
      </OverKeyboardView>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  modalImageContainer: {
    width: '100%',
    height: '100%',
  },

  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButtonContent: {
    padding: 20,
  },
  closeButtonIcon: {
    fontSize: 20,
    lineHeight: 20,
    color: 'white',
  },
})
