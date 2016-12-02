import moment from 'moment';

export function isSameDay(currentMessage = {}, diffMessage = {}) {

  let currentCreatedAt = moment(currentMessage.createdAt);
  let diffCreatedAt = moment(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.startOf('day').isSame(diffCreatedAt.startOf('day'));

}

export function isSameUser(currentMessage = {}, diffMessage = {}) {

  if (diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id) {
    return true;
  }

  return false;

}
