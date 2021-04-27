declare module '@expo/simple-spinner' {
  export function start(interval?: number): void;
  export function stop(): void;
  export function change_sequence(seq: string[]): void;
}
