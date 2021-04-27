declare module 'postcss-safe-parser' {
  import { parse } from 'postcss';
  var parser: typeof parse;
  export = parser;
}
