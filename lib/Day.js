import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import dayjs from 'dayjs';
import Color from './Color';
import { StylePropType, isSameDay } from './utils';
import { DATE_FORMAT } from './Constant';
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        color: Color.defaultColor,
        fontSize: 12,
        fontWeight: '600',
    },
    androidWorkaround: {
        transform: [{ rotate: '180deg' }]
    }
});
const androidWorkaroundContainer = StyleSheet.compose(styles.container, styles.androidWorkaround);
export default class Day extends PureComponent {
    render() {
        const { dateFormat, currentMessage, previousMessage, containerStyle, wrapperStyle, textStyle, androidWorkaround, } = this.props;
        if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
            return (<View style={[androidWorkaround ? androidWorkaroundContainer : styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]}>
              {dayjs(currentMessage.createdAt)
                .locale(this.context.getLocale())
                .format(dateFormat)}
            </Text>
          </View>
        </View>);
        }
        return null;
    }
}
Day.contextTypes = {
    getLocale: PropTypes.func,
};
Day.defaultProps = {
    currentMessage: {
        createdAt: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    dateFormat: DATE_FORMAT,
    androidWorkaround: false
};
Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    dateFormat: PropTypes.string,
    androidWorkaround: PropTypes.bool
};
//# sourceMappingURL=Day.js.map