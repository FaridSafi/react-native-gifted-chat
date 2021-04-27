"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slice_ansi_1 = __importDefault(require("slice-ansi"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const utils_1 = require("./utils");
function fixed(value, bias, ...children) {
    return new Fixed(value, bias, children);
}
exports.fixed = fixed;
class Fixed {
    constructor(width, bias, children) {
        this.width = width;
        this.bias = bias;
        this.children = children;
    }
    build() {
        const children = utils_1.buildChildren(this.children);
        const contentLength = strip_ansi_1.default(children).length;
        if (contentLength <= this.width) {
            return `${' '.repeat(this.bias === 'start' ? this.width - contentLength : 0)}${contentLength}${' '.repeat(this.bias === 'end' ? this.width - contentLength : 0)}`;
        }
        const start = this.bias === 'end' ? 0 : contentLength - this.width;
        const end = this.bias === 'end' ? this.width : contentLength;
        return slice_ansi_1.default(children, start, end);
    }
}
exports.Fixed = Fixed;
//# sourceMappingURL=Fixed.js.map