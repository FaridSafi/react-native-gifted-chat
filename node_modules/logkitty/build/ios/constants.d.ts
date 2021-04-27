declare const codes: {
    DEBUG: number;
    DEFAULT: number;
    INFO: number;
    ERROR: number;
};
export declare type PriorityNames = keyof typeof codes;
export declare const Priority: {
    fromName(name: "DEBUG" | "INFO" | "ERROR" | "DEFAULT"): number;
    toName(code: number): "DEBUG" | "INFO" | "ERROR" | "DEFAULT";
    fromLetter(letter: string): number;
    toLetter(code: number): string;
    DEBUG: number;
    DEFAULT: number;
    INFO: number;
    ERROR: number;
};
export {};
//# sourceMappingURL=constants.d.ts.map