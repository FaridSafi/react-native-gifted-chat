"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildChildren(children) {
    return children
        .map((child) => typeof child === 'string' ? child : child.build())
        .join('');
}
exports.buildChildren = buildChildren;
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
exports.toArray = toArray;
//# sourceMappingURL=utils.js.map