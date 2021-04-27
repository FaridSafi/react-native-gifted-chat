declare module 'json-schema-traverse' {
  type Schema = { [key: string]: any };
  type Options = { allKeys?: boolean };
  type Visitor = (
    schema: Schema,
    jsonPtr: string,
    rootSchema: Schema,
    parentJsonPtr: string,
    parentKeyword: string,
    parentSchema: Schema,
    keyIndex: string
  ) => void;

  function traverse(schema: Schema, cb: Visitor): void;
  function traverse(schema: Schema, opts: Options, cb: Visitor): void;
  export = traverse;
}
