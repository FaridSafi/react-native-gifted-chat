"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = __importDefault(require("colorette"));
const utils_1 = require("./utils");
function color(ansiColor, ...children) {
    return new Color(ansiColor, utils_1.toArray(children));
}
exports.color = color;
class Color {
    constructor(ansiColor, children) {
        this.color = ansiColor;
        this.children = children;
    }
    build() {
        const children = utils_1.buildChildren(this.children);
        if (this.color === 'none') {
            return children;
        }
        else if (this.color in colorette_1.default) {
            // tslint:disable-next-line: no-unsafe-any no-any
            return colorette_1.default[this.color](children);
        }
        throw new Error(`Color ${this.color} not found`);
    }
}
exports.Color = Color;
//# sourceMappingURL=Color.js.map