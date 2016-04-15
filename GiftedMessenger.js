import React, {
  Text,
  View,
  ListView,
  TextInput,
  Dimensions,
  Animated,
  Platform,
  PixelRatio,
  Component,
} from 'react-native';

import Message from './Message';
import GiftedSpinner from 'react-native-gifted-spinner';
import moment from 'moment';
import _ from 'lodash';
import Button from 'react-native-button';

class GiftedMessenger extends Component {

  constructor(props) {
    super(props);

    this._firstDisplay = true;
    this._listHeight = 0;
    this._footerY = 0;
    this._scrollToBottomOnNextRender = false;
    this._scrollToPreviousPosition = false;
    this._visibleRows = { s1: { } };

    let textInputHeight = 44;
    if (!this.props.hideTextInput) {
      if (this.props.styles.hasOwnProperty('textInputContainer')) {
        textInputHeight = this.props.styles.textInputContainer.height || textInputHeight;
      }
    }

    this.listViewMaxHeight = this.props.maxHeight - textInputHeight;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        if (r1.status !== r2.status) {
          return true;
        }
        return false;
      },
    });

    this.state = {
      dataSource: ds.cloneWithRows([]),
      text: '',
      disabled: true,
      height: new Animated.Value(this.listViewMaxHeight),
      allLoaded: false,
      appearAnim: new Animated.Value(0),
    };
  }

  getPreviousMessage(message) {
    for (let i = 0; i < this.props.messages.length; i++) {
      if (message.uniqueId === this.props.messages[i].uniqueId) {
        if (this.props.messages[i - 1]) {
          return this.props.messages[i - 1];
        }
      }
    }
    return null;
  }

  getNextMessage(message) {
    for (let i = 0; i < this.props.messages.length; i++) {
      if (message.uniqueId === this.props.messages[i].uniqueId) {
        if (this.props.messages[i + 1]) {
          return this.props.messages[i + 1];
        }
      }
    }
    return null;
  }

  renderDate(rowData = {}) {
    let diffMessage = null;
    diffMessage = this.getPreviousMessage(rowData);

    if (rowData.date instanceof Date) {
      if (diffMessage === null) {
        return (
          <Text style={[this.styles.date]}>
            {moment(rowData.date).calendar()}
          </Text>
        );
      } else if (diffMessage.date instanceof Date) {
        let diff = moment(rowData.date).diff(moment(diffMessage.date), 'minutes');
        if (diff > 5) {
          return (
            <Text style={[this.styles.date]}>
              {moment(rowData.date).calendar()}
            </Text>
          );
        }
      }
    }
    return null;
  }

  renderRow(rowData = {}, sectionID = null) {
    let diffMessage = null;
    diffMessage = this.getPreviousMessage(rowData);

    return (
      <View>
        {this.renderDate(rowData)}
        <Message
          rowData={rowData}
          onErrorButtonPress={this.props.onErrorButtonPress}
          displayNames={this.props.displayNames}
          displayNamesInsideBubble={this.props.displayNamesInsideBubble}
          diffMessage={diffMessage}
          position={rowData.position}
          forceRenderImage={this.props.forceRenderImage}
          onImagePress={this.props.onImagePress}
          onMessageLongPress={this.props.onMessageLongPress}
          renderCustomText={this.props.renderCustomText}

          parseText={this.props.parseText}
          handlePhonePress={this.props.handlePhonePress}
          handleUrlPress={this.props.handleUrlPress}
          handleEmailPress={this.props.handleEmailPress}

          styles={this.styles}
        />
      </View>
    )
  }

  onChangeText(text) {
    this.setState({
      text: text
    });
    if (text.trim().length > 0) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }

    this.props.onChangeText(text);
  }

  // Keep only the status of the last 'right' message
  filterStatus(messages) {
    let lastStatusIndex = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].position === 'right') {
        lastStatusIndex = i;
      }
    }

    for (let i = 0; i < lastStatusIndex; i++) {
      if (messages[i].position === 'right') {
        if (messages[i].status !== 'ErrorButton') {
          delete messages[i].status;
        }
      }
    }
  }

  setMessages(messages, isAppended = null) {

    this.filterStatus(messages);

    let rows = {};
    let identities = [];
    for (let i = 0; i < messages.length; i++) {
      if (typeof messages[i].uniqueId === 'undefined') {
        console.warn('messages['+i+'].uniqueId is missing');
      }
      rows[messages[i].uniqueId] = Object.assign({}, messages[i]);
      identities.push(messages[i].uniqueId);
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows, identities),
    });

    if (isAppended === true) {
      this._scrollToBottomOnNextRender = true;
    } else if (isAppended === false) {
      this._scrollToPreviousPosition = true;
    }

  }

  componentDidMount() {
    this.scrollResponder = this.refs.listView.getScrollResponder();

    if (this.props.messages.length > 0) {
      this.setMessages(this.props.messages);
    } else if (this.props.initialMessages) {
      console.warn('`initialMessages` is deprecated, please use `messages`');
    } else {
      // Set allLoaded, unless props.loadMessagesLater is set
      if (!this.props.loadMessagesLater) {
        this.setState({
          allLoaded: true
        });
      }
    }
  }

  getLastMessageUniqueId() {
    if (this.props.messages.length > 0) {
      return this.props.messages[this.props.messages.length - 1].uniqueId;
    }
    return null;
  }

  isLastMessageVisible() {
    if (this._visibleRows.s1[this.getLastMessageUniqueId() + ''] === true) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.typingMessage !== this.props.typingMessage) {
      if (this.isLastMessageVisible()) {
        this._scrollToBottomOnNextRender = true;
      }
    }

    if (_.isEqual(nextProps.messages, this.props.messages) === false) {
      let isAppended = null;
      if (nextProps.messages.length === this.props.messages.length) {
        // we assume that only a status has been changed
        isAppended = null;
      } else if (_.isEqual(nextProps.messages[nextProps.messages.length - 1], this.props.messages[this.props.messages.length - 1]) === false) {
        // we assume the messages were appended
        isAppended = true;
      } else {
        // we assume the messages were prepended
        isAppended = false;
      }
      this.setMessages(nextProps.messages, isAppended);
    }

    let textInputHeight = 44;
    if (nextProps.styles.hasOwnProperty('textInputContainer')) {
      textInputHeight = nextProps.styles.textInputContainer.height || textInputHeight;
    }

    if (nextProps.maxHeight !== this.props.maxHeight) {
      this.listViewMaxHeight = nextProps.maxHeight;
      Animated.timing(this.state.height, {
        toValue: this.listViewMaxHeight,
        duration: 150,
      }).start();
    }

    if (nextProps.hideTextInput && !this.props.hideTextInput) {
      this.listViewMaxHeight += textInputHeight;

      this.setState({
        height: new Animated.Value(this.listViewMaxHeight),
      });
    } else if (!nextProps.hideTextInput && this.props.hideTextInput) {
      this.listViewMaxHeight -= textInputHeight;

      this.setState({
        height: new Animated.Value(this.listViewMaxHeight),
      });
    }
  }

  onKeyboardWillHide(e) {
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight,
      duration: 150,
    }).start();
  }

  onKeyboardDidHide(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e);
    }

    // TODO test in android
    if (this.props.keyboardShouldPersistTaps === false) {
      if (this.isLastMessageVisible()) {
        this.scrollToBottom();
      }
    }
  }

  onKeyboardWillShow(e) {
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight - e.endCoordinates.height,
      duration: 200,
    }).start();
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e);
    }

    setTimeout(() => {
      this.scrollToBottom();
    }, (Platform.OS === 'android' ? 200 : 100));
  }

  scrollToBottom(animated = null) {
    if (this._listHeight && this._footerY && this._footerY > this._listHeight) {
      var scrollDistance = this._listHeight - this._footerY;
      if (this.props.typingMessage) {
        scrollDistance -= 44;
      }

      this.scrollResponder.scrollTo({
        y: -scrollDistance,
        x: 0,
        animated: typeof animated === 'boolean' ? animated : this.props.scrollAnimated,
      });
    }
  }

  onSend() {
    var message = {
      text: this.state.text.trim(),
      name: this.props.senderName,
      image: this.props.senderImage,
      position: 'right',
      date: new Date(),
    };
    if (this.props.onCustomSend) {
      this.props.onCustomSend(message);
    } else {
      this.onChangeText('');
      this.props.handleSend(message);
    }
  }

  preLoadEarlierMessages() {
    if (this.props.onLoadEarlierMessages) {
      console.warn('`onLoadEarlierMessages` is deprecated, please use `onLoadEarlierMessagesPress` - Example in README');
    } else {
      this.props.onLoadEarlierMessagesPress();
    }
  }

  renderLoadEarlierMessages() {
    if (this.props.loadEarlierMessagesButton === true) {
      if (this.state.allLoaded === false) {
        if (this.props.isLoadingEarlierMessages === true) {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <GiftedSpinner />
            </View>
          );
        } else {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Button
                style={this.styles.loadEarlierMessagesButton}
                onPress={() => {this.preLoadEarlierMessages()}}
              >
                {this.props.loadEarlierMessagesButtonText}
              </Button>
            </View>
          );
        }
      }
    }
    return null;
  }

  onLayout(event) {
    const layout = event.nativeEvent.layout;
    this._listHeight = layout.height;

    if (this._firstDisplay === true) {
      requestAnimationFrame(() => {
        this._firstDisplay = false;
        this.scrollToBottom(false);
      });
    }
  }

  onFooterLayout(event) {
    const layout = event.nativeEvent.layout;
    const oldFooterY = this._footerY;
    this._footerY = layout.y;

    if (this._scrollToBottomOnNextRender === true) {
      this._scrollToBottomOnNextRender = false;
      this.scrollToBottom();
    }

    if (this._scrollToPreviousPosition === true) {
      this._scrollToPreviousPosition = false;
      this.scrollResponder.scrollTo({
        y: this._footerY - oldFooterY,
        x: 0,
        animated: false,
      });
    }
  }

  renderTypingMessage() {
    if (this.props.typingMessage) {
      return (
        <View style={{
          height: 44,
          justifyContent: 'center',
        }}>
          <Text style={{
            marginLeft: 10,
            marginRight: 10,
            color: '#aaaaaa',
          }}>
            {this.props.typingMessage}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderFooter() {
    return (
      <View
        onLayout={this.onFooterLayout.bind(this)}
      >
        {this.renderTypingMessage()}
      </View>
    );
  }

  onChangeVisibleRows(visibleRows, changedRows) {
    this._visibleRows = visibleRows;
  }

  renderAnimatedView() {
    return (
      <Animated.View
        style={{
          height: this.state.height,
          justifyContent: 'flex-end',
        }}

      >
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderHeader={this.renderLoadEarlierMessages.bind(this)}
          enableEmptySections={true}
          onLayout={this.onLayout.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          onChangeVisibleRows={this.onChangeVisibleRows.bind(this)}

          style={this.styles.listView}

          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)} // not supported in Android - to fix this issue in Android, onKeyboardWillShow is called inside onKeyboardDidShow
          onKeyboardDidShow={this.onKeyboardDidShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)} // not supported in Android - to fix this issue in Android, onKeyboardWillHide is called inside onKeyboardDidHide
          onKeyboardDidHide={this.onKeyboardDidHide.bind(this)}

          keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
          keyboardDismissMode={this.props.keyboardDismissMode}

          initialListSize={10}
          pageSize={this.props.messages.length}


          {...this.props}
        />

      </Animated.View>
    );
  }

  render() {
    return (
      <View
        style={this.styles.container}
        ref='container'
      >
        {this.renderAnimatedView()}
        {this.renderTextInput()}
      </View>
    )
  }

  renderTextInput() {
    if (this.props.hideTextInput === false) {
      return (
        <View style={this.styles.textInputContainer}>
          {this.props.leftControlBar}
          <TextInput
            style={this.styles.textInput}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            ref='textInput'
            onChangeText={this.onChangeText.bind(this)}
            value={this.state.text}
            autoFocus={this.props.autoFocus}
            returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
            onSubmitEditing={this.props.submitOnReturn ? this.onSend.bind(this) : null}
            enablesReturnKeyAutomatically={true}

            blurOnSubmit={this.props.blurOnSubmit}
          />
          <Button
            style={this.styles.sendButton}
            styleDisabled={this.styles.sendButtonDisabled}
            onPress={this.onSend.bind(this)}
            disabled={this.state.disabled}
          >
            {this.props.sendButtonText}
          </Button>
        </View>
      );
    }
    return null;
  }

  componentWillMount() {
    this.styles = {
      container: {
        flex: 1,
        backgroundColor: '#FFF',
      },
      listView: {
        flex: 1,
      },
      textInputContainer: {
        height: 44,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#b2b2b2',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
      },
      textInput: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
        margin: 0,
        fontSize: 15,
      },
      sendButton: {
        marginTop: 11,
        marginLeft: 10,
      },
      date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      link: {
        color: '#007aff',
        textDecorationLine: 'underline',
      },
      linkLeft: {
        color: '#000',
      },
      linkRight: {
        color: '#fff',
      },
      loadEarlierMessages: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadEarlierMessagesButton: {
        fontSize: 14,
      },
    };

    Object.assign(this.styles, this.props.styles);
  }
}


GiftedMessenger.defaultProps = {
  displayNames: true,
  displayNamesInsideBubble: false,
  placeholder: 'Type a message...',
  styles: {},
  autoFocus: true,
  onErrorButtonPress: (message) => {},
  loadEarlierMessagesButton: false,
  loadEarlierMessagesButtonText: 'Load earlier messages',
  onLoadEarlierMessages: null, // deprecated
  onLoadEarlierMessagesPress: () => {},
  parseText: false,
  handleUrlPress: (url) => {},
  handlePhonePress: (phone) => {},
  handleEmailPress: (email) => {},
  initialMessages: [],
  messages: [],
  handleSend: (message) => {},
  maxHeight: Dimensions.get('window').height,
  senderName: 'Sender',
  senderImage: null,
  sendButtonText: 'Send',
  leftControlBar: null,
  onImagePress: null,
  onMessageLongPress: null,
  hideTextInput: false,
  keyboardDismissMode: 'interactive',
  keyboardShouldPersistTaps: true,
  submitOnReturn: false,
  blurOnSubmit: false,
  forceRenderImage: false,
  onChangeText: (text) => {},
  scrollAnimated: true,
  placeholderTextColor: '#ccc',
  isLoadingEarlierMessages: false,
  typingMessage: '',
};

GiftedMessenger.propTypes = {
  displayNames: React.PropTypes.bool,
  displayNamesInsideBubble: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  styles: React.PropTypes.object,
  autoFocus: React.PropTypes.bool,
  onErrorButtonPress: React.PropTypes.func,
  loadMessagesLater: React.PropTypes.bool,
  loadEarlierMessagesButton: React.PropTypes.bool,
  loadEarlierMessagesButtonText: React.PropTypes.string,
  onLoadEarlierMessages: React.PropTypes.func, // deprecated
  onLoadEarlierMessagesPress: React.PropTypes.func,
  parseText: React.PropTypes.bool,
  handleUrlPress: React.PropTypes.func,
  handlePhonePress: React.PropTypes.func,
  handleEmailPress: React.PropTypes.func,
  initialMessages: React.PropTypes.array,
  messages: React.PropTypes.array,
  handleSend: React.PropTypes.func,
  onCustomSend: React.PropTypes.func,
  renderCustomText: React.PropTypes.func,
  maxHeight: React.PropTypes.number,
  senderName: React.PropTypes.string,
  senderImage: React.PropTypes.object,
  sendButtonText: React.PropTypes.string,
  leftControlBar: React.PropTypes.element,
  onImagePress: React.PropTypes.func,
  onMessageLongPress: React.PropTypes.func,
  hideTextInput: React.PropTypes.bool,
  keyboardDismissMode: React.PropTypes.string,
  keyboardShouldPersistTaps: React.PropTypes.bool,
  submitOnReturn: React.PropTypes.bool,
  blurOnSubmit: React.PropTypes.bool,
  forceRenderImage: React.PropTypes.bool,
  onChangeText: React.PropTypes.func,
  scrollAnimated: React.PropTypes.bool,
  placeholderTextColor: React.PropTypes.string,
  isLoadingEarlierMessages: React.PropTypes.bool,
  typingMessage: React.PropTypes.string,
};


module.exports = GiftedMessenger;
