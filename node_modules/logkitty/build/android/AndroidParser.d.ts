import { IParser, Entry } from '../types';
export default class AndroidParser implements IParser {
    static timeRegex: RegExp;
    static headerRegex: RegExp;
    splitMessages(raw: string): string[];
    parseMessages(messages: string[]): Entry[];
}
//# sourceMappingURL=AndroidParser.d.ts.map