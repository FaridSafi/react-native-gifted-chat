import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, ViewPropTypes, } from 'react-native';
import moment from 'moment';
import Color from './Color';
import { isSameDay } from './utils';
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
});
export default class Day extends PureComponent {
    render() {
        const { dateFormat, currentMessage, previousMessage, containerStyle, wrapperStyle, textStyle, } = this.props;
        if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
            return (<View style={[styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]}>
              {moment(currentMessage.createdAt)
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
        // TODO: test if crash when createdAt === null
        createdAt: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    dateFormat: DATE_FORMAT,
};
Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    dateFormat: PropTypes.string,
};
//# sourceMappingURL=Day.js.map