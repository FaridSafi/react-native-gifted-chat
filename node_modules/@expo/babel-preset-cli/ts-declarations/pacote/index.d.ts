declare module 'pacote' {
  import { Readable } from 'stream';
  import { Result as ParsedPackageArg } from 'npm-package-arg';

  type ShrinkwrapJsonObj = any;
  interface Manifest {
    name: string;
    version: string;
    dependencies: { [pkgName: string]: string };
    optionalDependencies: { [pkgName: string]: string };
    devDependencies: { [pkgName: string]: string };
    peerDependencies: { [pkgName: string]: string };
    bundleDependencies: false | string[];
    bin: { [binName: string]: string };
    _resolved: string;
    _integrity: string;
    _shrinkwrap: null | ShrinkwrapJsonObj;
  }
  interface Packument {
    name: string;
    'dist-tags': {
      [tagName: string]: string;
    };
    versions: {
      [version: string]: Manifest;
    };
  }
  type Options = any;
  export type PackageSpec = string | ParsedPackageArg;

  function extract(spec: PackageSpec, destination: string, opts?: Options): Promise<void>;
  function manifest(spec: PackageSpec, opts?: Options): Promise<Manifest>;
  function packument(spec: PackageSpec, opts?: Options): Promise<Packument>;
  function tarball(spec: PackageSpec, opts?: Options): Promise<Buffer>;
  namespace tarball {
    function stream(
      spec: PackageSpec,
      fn: (stream: Readable) => Promise<void>,
      opts?: Options
    ): Promise<void>;
    function file(spec: PackageSpec, opts?: Options): Promise<void>;
  }
  function clearMemoized(): void;
}
