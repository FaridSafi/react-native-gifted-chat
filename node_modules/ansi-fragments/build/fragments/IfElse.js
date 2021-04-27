"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function ifElse(condition, ifTrueFragment, elseFragment) {
    return new IfElse(condition, ifTrueFragment, elseFragment);
}
exports.ifElse = ifElse;
class IfElse {
    constructor(condition, ifTrueFragment, elseFragment) {
        this.condition = condition;
        this.ifTrueFragment = ifTrueFragment;
        this.elseFragment = elseFragment;
    }
    build() {
        const value = Boolean(typeof this.condition === 'function' ? this.condition() : this.condition);
        return utils_1.buildChildren([
            value ? this.ifTrueFragment : this.elseFragment || '',
        ]);
    }
}
exports.IfElse = IfElse;
//# sourceMappingURL=IfElse.js.map