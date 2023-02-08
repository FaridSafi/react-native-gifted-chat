/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {()=>void} effect the function to call
 * @param {Array<any>} dependencies the state(s) that fires the update
 */
export declare function useUpdateLayoutEffect(effect: () => void, dependencies?: any[]): void;
