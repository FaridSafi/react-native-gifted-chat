declare const codes: {
    UNKNOWN: number;
    VERBOSE: number;
    DEBUG: number;
    INFO: number;
    WARN: number;
    ERROR: number;
    FATAL: number;
    SILENT: number;
};
export declare type PriorityNames = keyof typeof codes;
export declare const Priority: {
    fromName(name: "UNKNOWN" | "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "SILENT"): number;
    toName(code: number): "UNKNOWN" | "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "SILENT";
    fromLetter(letter: string): number;
    toLetter(code: number): string;
    UNKNOWN: number;
    VERBOSE: number;
    DEBUG: number;
    INFO: number;
    WARN: number;
    ERROR: number;
    FATAL: number;
    SILENT: number;
};
export {};
//# sourceMappingURL=constants.d.ts.map