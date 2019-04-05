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
import { StyleSheet, View, ViewPropTypes, } from 'react-native';
import GiftedAvatar from './GiftedAvatar';
import { isSameUser, isSameDay } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            marginRight: 8,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 18,
        },
    }),
    right: StyleSheet.create({
        container: {
            marginLeft: 8,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 18,
        },
    }),
};
export default class Avatar extends React.Component {
    renderAvatar() {
        if (this.props.renderAvatar) {
            const _a = this.props, { renderAvatar } = _a, avatarProps = __rest(_a, ["renderAvatar"]);
            return this.props.renderAvatar(avatarProps);
        }
        if (this.props.currentMessage) {
            return (<GiftedAvatar avatarStyle={[
                styles[this.props.position].image,
                this.props.imageStyle &&
                    this.props.imageStyle[this.props.position],
            ]} user={this.props.currentMessage.user} onPress={() => this.props.onPressAvatar &&
                this.props.onPressAvatar(this.props.currentMessage.user)}/>);
        }
        return null;
    }
    render() {
        const { renderAvatarOnTop, showAvatarForEveryMessage, containerStyle, position, currentMessage, renderAvatar, previousMessage, nextMessage, imageStyle, } = this.props;
        const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
        const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';
        if (renderAvatar === null) {
            return null;
        }
        if (!showAvatarForEveryMessage &&
            currentMessage &&
            messageToCompare &&
            isSameUser(currentMessage, messageToCompare) &&
            isSameDay(currentMessage, messageToCompare)) {
            return (<View style={[
                styles[position].container,
                containerStyle && containerStyle[position],
            ]}>
          <GiftedAvatar avatarStyle={[
                styles[position].image,
                imageStyle && imageStyle[position],
            ]}/>
        </View>);
        }
        return (<View style={[
            styles[position].container,
            styles[position][computedStyle],
            containerStyle && containerStyle[position],
        ]}>
        {this.renderAvatar()}
      </View>);
    }
}
Avatar.defaultProps = {
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    position: 'left',
    currentMessage: {
        user: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    imageStyle: {},
    onPressAvatar: () => { },
};
Avatar.propTypes = {
    renderAvatarOnTop: PropTypes.bool,
    showAvatarForEveryMessage: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    onPressAvatar: PropTypes.func,
    renderAvatar: PropTypes.func,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    imageStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};
//# sourceMappingURL=Avatar.js.map