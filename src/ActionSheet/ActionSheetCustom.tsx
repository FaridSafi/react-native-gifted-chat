import React, { Fragment, PureComponent, Props } from 'react'
import {
  ActionSheetIOSOptions,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  ModalPropsIOS,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import styles, { TINT_COLOR, UNDERLAY_COLOR, WARN_COLOR } from './styles'

const ANIMATION_DURATION = 250
const SHOW_TIMEOUT = 50
const MAX_PER_HEIGHT = 0.8
const TITTLE_MESSAGE_PER_HEIGHT = 0.3
const SUPPORTED_ORIENTATIONS: ModalPropsIOS['supportedOrientations'] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

function getMaxHeight() {
  const { height } = Dimensions.get('window')

  return height * MAX_PER_HEIGHT
}

interface ActionSheetState extends ActionSheetIOSOptions {
  open: boolean
  maxHeight: number
  callback(buttonIndex: number): void
}

class ActionSheet extends PureComponent<Props<{}>, ActionSheetState> {
  _isMounted = false
  _isTransitioning = false
  _translateY = new Animated.Value(getMaxHeight())

  state = {
    open: false,
    maxHeight: getMaxHeight(),
    title: '',
    message: '',
    tintColor: TINT_COLOR,
    cancelButtonIndex: -1,
    destructiveButtonIndex: -1,
    options: [],
    callback: (buttonIndex: number) => buttonIndex,
  }

  componentDidMount() {
    this._isMounted = true
    Dimensions.addEventListener('change', this.handleChangeDimensions)
  }

  componentWillUnmount() {
    this._isMounted = false
    Dimensions.removeEventListener('change', this.handleChangeDimensions)
  }

  showActionSheetWithOptions = (
    options: ActionSheetIOSOptions,
    callback: (buttonIndex: number) => void,
  ) => {
    if (!this._isMounted || this._isTransitioning) {
      return
    }

    this._isTransitioning = true
    Keyboard.dismiss()
    this.setState({ ...options, callback, open: true }, this.handleShow)
  }

  hide = (index: number) => () => {
    if (!this._isMounted || this._isTransitioning) {
      return
    }

    if (index >= 0) {
      this._isTransitioning = true
      this.hideSheet(this.handleHide(index))
    }
  }

  showSheet = () => {
    Animated.timing(this._translateY, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      this._isTransitioning = false
    })
  }

  hideSheet = (callback: () => void) => {
    const { maxHeight } = this.state

    Animated.timing(this._translateY, {
      toValue: maxHeight,
      duration: ANIMATION_DURATION,
      easing: Easing.ease,
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      if (!this._isMounted) {
        return
      }

      this._isTransitioning = false
      callback()
    })
  }

  handleChangeDimensions = () => {
    this.setState({ maxHeight: getMaxHeight() })
  }

  handleCallback = (index: number) => () => {
    const { callback } = this.state

    if (index >= 0) {
      callback(index)
    }
  }

  handleShow = () => {
    setTimeout(this.showSheet, SHOW_TIMEOUT)
  }

  handleHide = (index: number) => () => {
    this.setState({ open: false }, this.handleCallback(index))
  }

  renderTitleMessage = () => {
    const { maxHeight, title, message } = this.state

    if (!title && !message) {
      return null
    }

    const contentStyle = { maxHeight: maxHeight * TITTLE_MESSAGE_PER_HEIGHT }

    return (
      <SafeAreaView style={styles.textBoxSafeArea}>
        <ScrollView style={contentStyle}>
          <View style={styles.textBox}>
            {!!title && (
              <View style={styles.textViewBox}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
            )}
            {!!message && (
              <View style={styles.textViewBox}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  renderButton = (isCancel = false) => (text: string, index: number) => {
    const { tintColor, cancelButtonIndex, destructiveButtonIndex } = this.state

    if (!isCancel && index === cancelButtonIndex) {
      return null
    }

    const buttonTextStyle = {
      color: destructiveButtonIndex === index ? WARN_COLOR : tintColor,
    }
    const cancelButtonBoxSafeAreaStyle =
      isCancel && styles.cancelButtonBoxSafeArea

    return (
      <SafeAreaView
        key={index}
        style={[styles.buttonBoxSafeArea, cancelButtonBoxSafeAreaStyle]}
      >
        <TouchableHighlight
          style={styles.buttonBox}
          activeOpacity={1}
          underlayColor={UNDERLAY_COLOR}
          onPress={this.hide(index)}
        >
          <Text style={[styles.buttonText, buttonTextStyle]} numberOfLines={1}>
            {text}
          </Text>
        </TouchableHighlight>
      </SafeAreaView>
    )
  }

  renderButtons = () => {
    const { cancelButtonIndex, options } = this.state
    const cancelText = options[cancelButtonIndex]

    return (
      <Fragment>
        <ScrollView>{options.map(this.renderButton())}</ScrollView>
        {!!cancelText && this.renderButton(true)(cancelText, cancelButtonIndex)}
      </Fragment>
    )
  }

  renderContent = () => {
    const { maxHeight, cancelButtonIndex } = this.state
    const titleMessageElement = this.renderTitleMessage()
    const buttonsElement = this.renderButtons()
    const animatedStyle = {
      maxHeight,
      transform: [{ translateY: this._translateY }],
    }
    const webContentStyle = Platform.OS === 'web' && styles.webContent

    return (
      <View style={[styles.content, webContentStyle]}>
        <TouchableWithoutFeedback onPress={this.hide(cancelButtonIndex)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.body, animatedStyle]}>
          {titleMessageElement}
          {buttonsElement}
        </Animated.View>
      </View>
    )
  }

  render() {
    const { open, cancelButtonIndex } = this.state

    if (Platform.OS === 'web') {
      return open ? this.renderContent() : null
    }

    const contentElement = this.renderContent()

    return (
      <Modal
        animationType='fade'
        transparent
        visible={open}
        onRequestClose={this.hide(cancelButtonIndex)}
        supportedOrientations={SUPPORTED_ORIENTATIONS}
      >
        {contentElement}
      </Modal>
    )
  }
}

export default ActionSheet
