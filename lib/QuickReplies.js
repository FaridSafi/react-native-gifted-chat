import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, } from 'react-native';
import Color from './Color';
import { warning } from './utils';
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: 300,
    },
    quickReply: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        maxWidth: 160,
        paddingVertical: 7,
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 13,
        margin: 3,
    },
    quickReplyText: {
        overflow: 'visible',
    },
    sendLink: {
        borderWidth: 0,
    },
    sendLinkText: {
        color: Color.defaultBlue,
        fontWeight: '600',
        fontSize: 17,
    },
});
const sameReply = (currentReply) => (reply) => currentReply.value === reply.value;
const diffReply = (currentReply) => (reply) => currentReply.value !== reply.value;
export default class QuickReplies extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            replies: [],
        };
        this.handlePress = (reply) => () => {
            const { currentMessage } = this.props;
            const { replies } = this.state;
            if (currentMessage) {
                const { type } = currentMessage.quickReplies;
                switch (type) {
                    case 'radio': {
                        this.handleSend([reply])();
                        return;
                    }
                    case 'checkbox': {
                        if (replies.find(sameReply(reply))) {
                            this.setState({
                                replies: this.state.replies.filter(diffReply(reply)),
                            });
                        }
                        else {
                            this.setState({ replies: [...this.state.replies, reply] });
                        }
                        return;
                    }
                    default: {
                        warning(`onQuickReply unknown type: ${type}`);
                        return;
                    }
                }
            }
        };
        this.handleSend = (replies) => () => {
            const { currentMessage } = this.props;
            if (this.props.onQuickReply) {
                this.props.onQuickReply(replies.map((reply) => ({
                    ...reply,
                    messageId: currentMessage._id,
                })));
            }
        };
        this.shouldComponentDisplay = () => {
            const { currentMessage, nextMessage } = this.props;
            const hasReplies = !!currentMessage && !!currentMessage.quickReplies;
            const hasNext = !!nextMessage && !!nextMessage._id;
            const keepIt = currentMessage.quickReplies.keepIt;
            if (hasReplies && !hasNext) {
                return true;
            }
            if (hasReplies && hasNext && keepIt) {
                return true;
            }
            return false;
        };
        this.renderQuickReplySend = () => {
            const { replies } = this.state;
            const { sendText, renderQuickReplySend: customSend } = this.props;
            return (<TouchableOpacity style={[styles.quickReply, styles.sendLink]} onPress={this.handleSend(replies)}>
        {customSend ? (customSend()) : (<Text style={styles.sendLinkText}>{sendText}</Text>)}
      </TouchableOpacity>);
        };
    }
    render() {
        const { currentMessage, color, quickReplyStyle } = this.props;
        const { replies } = this.state;
        if (!this.shouldComponentDisplay()) {
            return null;
        }
        const { type } = currentMessage.quickReplies;
        return (<View style={styles.container}>
        {currentMessage.quickReplies.values.map((reply, index) => {
            const selected = type === 'checkbox' && replies.find(sameReply(reply));
            return (<TouchableOpacity onPress={this.handlePress(reply)} style={[
                styles.quickReply,
                quickReplyStyle,
                { borderColor: color },
                selected && { backgroundColor: color },
            ]} key={`${reply.value}-${index}`}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={[
                styles.quickReplyText,
                { color: selected ? Color.white : color },
            ]}>
                  {reply.title}
                </Text>
              </TouchableOpacity>);
        })}
        {replies.length > 0 && this.renderQuickReplySend()}
      </View>);
    }
}
QuickReplies.defaultProps = {
    currentMessage: {
        quickReplies: [],
    },
    onQuickReply: () => { },
    color: Color.peterRiver,
    sendText: 'Send',
    keepReplies: false,
    renderQuickReplySend: undefined,
    quickReplyStyle: undefined,
};
QuickReplies.propTypes = {
    currentMessage: PropTypes.object.isRequired,
    onQuickReply: PropTypes.func,
    color: PropTypes.string,
};
//# sourceMappingURL=QuickReplies.js.map