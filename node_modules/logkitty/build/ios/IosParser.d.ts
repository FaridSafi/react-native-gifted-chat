import { IParser, Entry } from '../types';
export default class IosParser implements IParser {
    static timeRegex: RegExp;
    static headerRegex: RegExp;
    splitMessages(raw: string): string[];
    parseMessages(messages: string[]): Entry[];
}
//# sourceMappingURL=IosParser.d.ts.map