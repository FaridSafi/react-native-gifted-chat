import { Platform } from 'react-native';

const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});

export default {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT: 100,
  DEFAULT_PLACEHOLDER: 'Type a message...',
  DATE_FORMAT: 'll',
  TIME_FORMAT: 'LT',
};
