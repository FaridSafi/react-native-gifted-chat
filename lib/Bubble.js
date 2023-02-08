import PropTypes from 'prop-types';
import React from 'react';
import { Text, Clipboard, StyleSheet, TouchableWithoutFeedback, View, } from 'react-native';
import QuickReplies from './QuickReplies';
import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import MessageAudio from './MessageAudio';
import Time from './Time';
import Color from './Color';
import { StylePropType, isSameUser, isSameDay } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.leftBubbleBackground,
            marginRight: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-end',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.defaultBlue,
            marginLeft: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
    }),
    content: StyleSheet.create({
        tick: {
            fontSize: 10,
            backgroundColor: Color.backgroundTransparent,
            color: Color.white,
        },
        tickView: {
            flexDirection: 'row',
            marginRight: 10,
        },
        username: {
            top: -3,
            left: 0,
            fontSize: 12,
            backgroundColor: 'transparent',
            color: '#aaa',
        },
        usernameView: {
            flexDirection: 'row',
            marginHorizontal: 10,
        },
    }),
};
const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];
export default class Bubble extends React.Component {
    constructor() {
        super(...arguments);
        this.onLongPress = () => {
            const { currentMessage } = this.props;
            if (this.props.onLongPress) {
                this.props.onLongPress(this.context, this.props.currentMessage);
            }
            else if (currentMessage && currentMessage.text) {
                const { optionTitles } = this.props;
                const options = optionTitles && optionTitles.length > 0
                    ? optionTitles.slice(0, 2)
                    : DEFAULT_OPTION_TITLES;
                const cancelButtonIndex = options.length - 1;
                this.context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                }, (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Clipboard.setString(currentMessage.text);
                            break;
                        default:
                            break;
                    }
                });
            }
        };
    }
    styledBubbleToNext() {
        const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
        if (currentMessage &&
            nextMessage &&
            position &&
            isSameUser(currentMessage, nextMessage) &&
            isSameDay(currentMessage, nextMessage)) {
            return [
                styles[position].containerToNext,
                containerToNextStyle && containerToNextStyle[position],
            ];
        }
        return null;
    }
    styledBubbleToPrevious() {
        const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
        if (currentMessage &&
            previousMessage &&
            position &&
            isSameUser(currentMessage, previousMessage) &&
            isSameDay(currentMessage, previousMessage)) {
            return [
                styles[position].containerToPrevious,
                containerToPreviousStyle && containerToPreviousStyle[position],
            ];
        }
        return null;
    }
    renderQuickReplies() {
        const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, } = this.props;
        if (currentMessage && currentMessage.quickReplies) {
            const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
            if (this.props.renderQuickReplies) {
                return this.props.renderQuickReplies(quickReplyProps);
            }
            return (<QuickReplies {...{
                currentMessage,
                onQuickReply,
                nextMessage,
                renderQuickReplySend,
                quickReplyStyle,
            }}/>);
        }
        return null;
    }
    renderMessageText() {
        if (this.props.currentMessage && this.props.currentMessage.text) {
            const { containerStyle, wrapperStyle, optionTitles, ...messageTextProps } = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            return <MessageText {...messageTextProps}/>;
        }
        return null;
    }
    renderMessageImage() {
        if (this.props.currentMessage && this.props.currentMessage.image) {
            const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps);
            }
            return <MessageImage {...messageImageProps}/>;
        }
        return null;
    }
    renderMessageVideo() {
        if (this.props.currentMessage && this.props.currentMessage.video) {
            const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
            if (this.props.renderMessageVideo) {
                return this.props.renderMessageVideo(messageVideoProps);
            }
            return <MessageVideo {...messageVideoProps}/>;
        }
        return null;
    }
    renderMessageAudio() {
        if (this.props.currentMessage && this.props.currentMessage.audio) {
            const { containerStyle, wrapperStyle, ...messageAudioProps } = this.props;
            if (this.props.renderMessageAudio) {
                return this.props.renderMessageAudio(messageAudioProps);
            }
            return <MessageAudio {...messageAudioProps}/>;
        }
        return null;
    }
    renderTicks() {
        const { currentMessage, renderTicks, user } = this.props;
        if (renderTicks && currentMessage) {
            return renderTicks(currentMessage);
        }
        if (currentMessage &&
            user &&
            currentMessage.user &&
            currentMessage.user._id !== user._id) {
            return null;
        }
        if (currentMessage &&
            (currentMessage.sent || currentMessage.received || currentMessage.pending)) {
            return (<View style={styles.content.tickView}>
          {!!currentMessage.sent && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.received && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.pending && (<Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>)}
        </View>);
        }
        return null;
    }
    renderTime() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const { containerStyle, wrapperStyle, textStyle, ...timeProps } = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return <Time {...timeProps}/>;
        }
        return null;
    }
    renderUsername() {
        const { currentMessage, user } = this.props;
        if (this.props.renderUsernameOnMessage && currentMessage) {
            if (user && currentMessage.user._id === user._id) {
                return null;
            }
            return (<View style={styles.content.usernameView}>
          <Text style={[styles.content.username, this.props.usernameStyle]}>
            ~ {currentMessage.user.name}
          </Text>
        </View>);
        }
        return null;
    }
    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }
        return null;
    }
    renderBubbleContent() {
        return this.props.isCustomViewBottom ? (<View>
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
        {this.renderCustomView()}
      </View>) : (<View>
        {this.renderCustomView()}
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
      </View>);
    }
    render() {
        const { position, containerStyle, wrapperStyle, bottomContainerStyle, } = this.props;
        return (<View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}>
        <View style={[
            styles[position].wrapper,
            this.styledBubbleToNext(),
            this.styledBubbleToPrevious(),
            wrapperStyle && wrapperStyle[position],
        ]}>
          <TouchableWithoutFeedback onLongPress={this.onLongPress} accessibilityTraits='text' {...this.props.touchableProps}>
            <View>
              {this.renderBubbleContent()}
              <View style={[
            styles[position].bottom,
            bottomContainerStyle && bottomContainerStyle[position],
        ]}>
                {this.renderUsername()}
                {this.renderTime()}
                {this.renderTicks()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.renderQuickReplies()}
      </View>);
    }
}
Bubble.contextTypes = {
    actionSheet: PropTypes.func,
};
Bubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageAudio: null,
    renderMessageText: null,
    renderCustomView: null,
    renderUsername: null,
    renderTicks: null,
    renderTime: null,
    renderQuickReplies: null,
    onQuickReply: null,
    position: 'left',
    optionTitles: DEFAULT_OPTION_TITLES,
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    bottomContainerStyle: {},
    tickStyle: {},
    usernameStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};
Bubble.propTypes = {
    user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageAudio: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    isCustomViewBottom: PropTypes.bool,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    renderQuickReplies: PropTypes.func,
    onQuickReply: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    wrapperStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    bottomContainerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    tickStyle: StylePropType,
    usernameStyle: StylePropType,
    containerToNextStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
};
//# sourceMappingURL=Bubble.js.map