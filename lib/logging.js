const styleString = (color) => `color: ${color}; font-weight: bold`;
const headerLog = '%c[react-native-gifted-chat]';
export const warning = (...args) => console.log(headerLog, styleString('orange'), ...args);
export const error = (...args) => console.log(headerLog, styleString('red'), ...args);
//# sourceMappingURL=logging.js.map