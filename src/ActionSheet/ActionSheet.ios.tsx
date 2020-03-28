import { Component, Props } from 'react'
import { ActionSheetIOS, ActionSheetIOSOptions, Keyboard } from 'react-native'

const SHOW_TIMEOUT = 50

class ActionSheet extends Component<Props<{}>> {
  shouldComponentUpdate() {
    return false
  }

  showActionSheetWithOptions = (
    options: ActionSheetIOSOptions,
    callback: (buttonIndex: number) => void,
  ) => {
    Keyboard.dismiss()
    setTimeout(
      ActionSheetIOS.showActionSheetWithOptions,
      SHOW_TIMEOUT,
      options,
      callback,
    )
  }

  render() {
    return null
  }
}

export default ActionSheet
