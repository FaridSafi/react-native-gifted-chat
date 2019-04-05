var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import PropTypes from 'prop-types';
import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import Day from './Day';
import { isSameUser } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            marginLeft: 8,
            marginRight: 0,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 8,
        },
    }),
};
export default class Message extends React.Component {
    shouldComponentUpdate(nextProps) {
        const next = nextProps.currentMessage;
        const current = this.props.currentMessage;
        const { nextMessage } = this.props;
        const nextPropsMessage = nextProps.nextMessage;
        return (next.sent !== current.sent ||
            next.received !== current.received ||
            next.pending !== current.pending ||
            next.createdAt !== current.createdAt ||
            next.text !== current.text ||
            next.image !== current.image ||
            next.video !== current.video ||
            next.audio !== current.audio ||
            nextMessage !== nextPropsMessage);
    }
    renderDay() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const _a = this.props, { containerStyle } = _a, props = __rest(_a, ["containerStyle"]);
            if (this.props.renderDay) {
                return this.props.renderDay(props);
            }
            return <Day {...props}/>;
        }
        return null;
    }
    renderBubble() {
        const _a = this.props, { containerStyle } = _a, props = __rest(_a, ["containerStyle"]);
        if (this.props.renderBubble) {
            return this.props.renderBubble(props);
        }
        return <Bubble {...props}/>;
    }
    renderSystemMessage() {
        const _a = this.props, { containerStyle } = _a, props = __rest(_a, ["containerStyle"]);
        if (this.props.renderSystemMessage) {
            return this.props.renderSystemMessage(props);
        }
        return <SystemMessage {...props}/>;
    }
    renderAvatar() {
        const { user, currentMessage } = this.props;
        if (user &&
            currentMessage &&
            user._id === currentMessage.user._id &&
            !this.props.showUserAvatar) {
            return null;
        }
        if (currentMessage && currentMessage.user.avatar === null) {
            return null;
        }
        const _a = this.props, { containerStyle } = _a, props = __rest(_a, ["containerStyle"]);
        return <Avatar {...props}/>;
    }
    render() {
        const { currentMessage, nextMessage, position, containerStyle } = this.props;
        if (currentMessage) {
            const sameUser = isSameUser(currentMessage, nextMessage);
            return (<View>
          {this.renderDay()}
          {currentMessage.system ? (this.renderSystemMessage()) : (<View style={[
                styles[position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                containerStyle && containerStyle[position],
            ]}>
              {this.props.position === 'left' ? this.renderAvatar() : null}
              {this.renderBubble()}
              {this.props.position === 'right' ? this.renderAvatar() : null}
            </View>)}
        </View>);
        }
        return null;
    }
}
Message.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    renderSystemMessage: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
    showUserAvatar: true,
    inverted: true,
};
Message.propTypes = {
    renderAvatar: PropTypes.func,
    showUserAvatar: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};
//# sourceMappingURL=Message.js.map