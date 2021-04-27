declare module 'qrcode-terminal' {
  export function generate(url: string, cb: (code: string) => void): void;
}
