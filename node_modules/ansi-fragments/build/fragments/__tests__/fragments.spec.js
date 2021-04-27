"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = require("../Color");
const Modifier_1 = require("../Modifier");
const Container_1 = require("../Container");
const Pad_1 = require("../Pad");
const Fixed_1 = require("../Fixed");
const colorette_1 = __importDefault(require("colorette"));
const IfElse_1 = require("../IfElse");
colorette_1.default.options.enabled = true;
test('should build fragments to string', () => {
    const tree = Container_1.container(Color_1.color('red', Color_1.color('bgBlack', Color_1.color('none', 'Hello', Pad_1.pad(1), 'World'))), Pad_1.pad(2, '|'), Modifier_1.modifier('bold', Color_1.color('white', 'Something')), Pad_1.pad(1), Fixed_1.fixed(4, 'end', 'This', 'will', Color_1.color('blue', 'be trimmed')), Pad_1.pad(1), Fixed_1.fixed(10, 'start', Color_1.color('blue', 'nothing is awesome')));
    const text = tree.build();
    const expected = `${colorette_1.default.red(colorette_1.default.bgBlack('Hello World'))}||${colorette_1.default.bold(colorette_1.default.white('Something'))} This ${colorette_1.default.blue('is awesome')}`;
    expect(JSON.stringify(text)).toEqual(JSON.stringify(expected));
});
test('ifElse fragment should render correct fragmnent', () => {
    expect(IfElse_1.ifElse(true, 'Hello', 'Bye').build()).toEqual('Hello');
    expect(IfElse_1.ifElse(1, 'Hello', 'Bye').build()).toEqual('Hello');
    expect(IfElse_1.ifElse(undefined, 'Hello', 'Bye').build()).toEqual('Bye');
    // tslint:disable-next-line: no-null-keyword
    expect(IfElse_1.ifElse(null, 'Hello', 'Bye').build()).toEqual('Bye');
    expect(IfElse_1.ifElse(true, 'Hello').build()).toEqual('Hello');
    expect(IfElse_1.ifElse(false, 'Hello').build()).toEqual('');
    expect(IfElse_1.ifElse(() => true, 'Hello', 'Bye').build()).toEqual('Hello');
});
//# sourceMappingURL=fragments.spec.js.map