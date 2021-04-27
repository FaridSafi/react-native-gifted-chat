"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function container(...children) {
    return new Container(children);
}
exports.container = container;
class Container {
    constructor(children) {
        this.children = children;
    }
    build() {
        return utils_1.buildChildren(this.children);
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map