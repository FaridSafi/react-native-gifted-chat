declare module 'hasbin' {
  function hasbin(bin: string, done: (result: boolean) => void): void;

  export = hasbin;
}
