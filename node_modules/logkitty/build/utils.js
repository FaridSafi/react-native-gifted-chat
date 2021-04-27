"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMinPriority = getMinPriority;

function getMinPriority(Priority, priorities, defaultPriority) {
  const parsedPriorities = Object.keys(priorities).filter(key => priorities[key]).map(key => {
    return Priority.fromName(key);
  });
  return parsedPriorities.length ? Math.min(...parsedPriorities) : defaultPriority;
}
//# sourceMappingURL=utils.js.map