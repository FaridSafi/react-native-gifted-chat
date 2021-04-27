declare module 'md5hex' {
  interface MD5HexOptions {
    salt?: string;
    saltPrefix?: string;
    saltSuffix?: string;
    length?: number;
  }

  function md5hex(stringOrBuffer: string | Buffer, opts?: MD5HexOptions | number): string;

  export = md5hex;
}
