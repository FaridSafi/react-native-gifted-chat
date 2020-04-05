import PropTypes from 'prop-types';
import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, } from 'react-native';
import Color from './Color';
const { carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue, } = Color;
const styles = StyleSheet.create({
    avatarStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarTransparent: {
        backgroundColor: Color.backgroundTransparent,
    },
    textStyle: {
        color: Color.white,
        fontSize: 16,
        backgroundColor: Color.backgroundTransparent,
        fontWeight: '100',
    },
});
export default class GiftedAvatar extends React.Component {
    constructor() {
        super(...arguments);
        this.avatarName = undefined;
        this.avatarColor = undefined;
        this.handleOnPress = () => {
            const { onPress, ...other } = this.props;
            if (this.props.onPress) {
                this.props.onPress(other);
            }
        };
        this.handleOnLongPress = () => { };
    }
    setAvatarColor() {
        const userName = (this.props.user && this.props.user.name) || '';
        const name = userName.toUpperCase().split(' ');
        if (name.length === 1) {
            this.avatarName = `${name[0].charAt(0)}`;
        }
        else if (name.length > 1) {
            this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
        }
        else {
            this.avatarName = '';
        }
        let sumChars = 0;
        for (let i = 0; i < userName.length; i += 1) {
            sumChars += userName.charCodeAt(i);
        }
        // inspired by https://github.com/wbinnssmith/react-user-avatar
        // colors from https://flatuicolors.com/
        const colors = [
            carrot,
            emerald,
            peterRiver,
            wisteria,
            alizarin,
            turquoise,
            midnightBlue,
        ];
        this.avatarColor = colors[sumChars % colors.length];
    }
    renderAvatar() {
        const { user } = this.props;
        if (user) {
            if (typeof user.avatar === 'function') {
                return user.avatar([styles.avatarStyle, this.props.avatarStyle]);
            }
            else if (typeof user.avatar === 'string') {
                return (<Image source={{ uri: user.avatar }} style={[styles.avatarStyle, this.props.avatarStyle]}/>);
            }
            else if (typeof user.avatar === 'number') {
                return (<Image source={user.avatar} style={[styles.avatarStyle, this.props.avatarStyle]}/>);
            }
        }
        return null;
    }
    renderInitials() {
        return (<Text style={[styles.textStyle, this.props.textStyle]}>
        {this.avatarName}
      </Text>);
    }
    render() {
        if (!this.props.user ||
            (!this.props.user.name && !this.props.user.avatar)) {
            // render placeholder
            return (<View style={[
                styles.avatarStyle,
                styles.avatarTransparent,
                this.props.avatarStyle,
            ]} accessibilityTraits='image'/>);
        }
        if (this.props.user.avatar) {
            return (<TouchableOpacity disabled={!this.props.onPress} onPress={this.props.onPress} onLongPress={this.props.onLongPress} accessibilityTraits='image'>
          {this.renderAvatar()}
        </TouchableOpacity>);
        }
        this.setAvatarColor();
        return (<TouchableOpacity disabled={!this.props.onPress} onPress={this.props.onPress} onLongPress={this.props.onLongPress} style={[
            styles.avatarStyle,
            { backgroundColor: this.avatarColor },
            this.props.avatarStyle,
        ]} accessibilityTraits='image'>
        {this.renderInitials()}
      </TouchableOpacity>);
    }
}
GiftedAvatar.defaultProps = {
    user: {
        name: null,
        avatar: null,
    },
    onPress: null,
    avatarStyle: {},
    textStyle: {},
};
GiftedAvatar.propTypes = {
    user: PropTypes.object,
    onPress: PropTypes.func,
};
//# sourceMappingURL=GiftedAvatar.js.map