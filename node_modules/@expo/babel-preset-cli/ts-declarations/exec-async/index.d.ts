declare module 'exec-async' {
  import { ExecFileOptions } from 'child_process';

  export type ExecAsyncOptions = ExecFileOptions;

  export default function execAsync(
    command: string,
    args?: ReadonlyArray<string> | object | undefined,
    options?: ExecAsyncOptions
  ): Promise<string>;
}
