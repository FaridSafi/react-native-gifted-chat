"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = __importDefault(require("colorette"));
const utils_1 = require("./utils");
function modifier(ansiModifier, ...children) {
    return new Modifier(ansiModifier, utils_1.toArray(children));
}
exports.modifier = modifier;
class Modifier {
    constructor(ansiModifier, children) {
        this.modifier = ansiModifier;
        this.children = children;
    }
    build() {
        const children = utils_1.buildChildren(this.children);
        if (this.modifier === 'none') {
            return children;
        }
        else if (this.modifier in colorette_1.default) {
            // tslint:disable-next-line: no-unsafe-any no-any
            return colorette_1.default[this.modifier](children);
        }
        throw new Error(`Modifier ${this.modifier} not found`);
    }
}
exports.Modifier = Modifier;
//# sourceMappingURL=Modifier.js.map