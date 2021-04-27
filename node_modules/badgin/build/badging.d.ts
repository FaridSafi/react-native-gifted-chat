import { Value } from './index';
declare global {
    interface Window {
        ExperimentalBadge?: {
            set: (value?: number) => void;
            clear: () => void;
        };
    }
    interface Navigator {
        setExperimentalAppBadge?: (value?: number) => void;
        clearExperimentalAppBadge?: () => void;
    }
}
export declare function isAvailable(): boolean;
export declare function set(value: Value): boolean;
export declare function clear(): void;
//# sourceMappingURL=badging.d.ts.map