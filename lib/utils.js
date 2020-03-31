import moment from 'moment';
export function isSameDay(currentMessage, diffMessage) {
    if (!diffMessage || !diffMessage.createdAt) {
        return false;
    }
    const currentCreatedAt = moment(currentMessage.createdAt);
    const diffCreatedAt = moment(diffMessage.createdAt);
    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
        return false;
    }
    return currentCreatedAt.isSame(diffCreatedAt, 'day');
}
export function isSameUser(currentMessage, diffMessage) {
    return !!(diffMessage &&
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id);
}
const styleString = (color) => `color: ${color}; font-weight: bold`;
const headerLog = '%c[react-native-gifted-chat]';
export const warning = (...args) => console.log(headerLog, styleString('orange'), ...args);
export const error = (...args) => console.log(headerLog, styleString('red'), ...args);
//# sourceMappingURL=utils.js.map