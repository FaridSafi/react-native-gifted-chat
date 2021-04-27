"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pad(count, separator) {
    return new Pad(count, separator);
}
exports.pad = pad;
class Pad {
    constructor(count, separator = ' ') {
        this.count = count;
        this.separator = separator;
    }
    build() {
        return this.separator.repeat(this.count);
    }
}
exports.Pad = Pad;
//# sourceMappingURL=Pad.js.map