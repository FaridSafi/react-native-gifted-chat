declare module 'slugid' {
  function encode(uuid: string): string;
  function decode(slug: string): string;
  function v4(): string;
  function nice(): string;
}
