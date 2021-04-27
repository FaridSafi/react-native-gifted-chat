declare module '@expo/ngrok' {
  import { ChildProcessWithoutNullStreams } from 'child_process';

  interface NgrokOptions {
    authtoken?: string;
    port?: string | number | null;
    host?: string;
    httpauth?: string;
    region?: string;
    configPath?: string;

    proto?: 'http' | 'tcp' | 'tls';
    addr?: string;
    inspect?: boolean;
    auth?: string;
    host_header?: string;
    bind_tls?: true | false | 'both';
    subdomain?: string;
    hostname?: string;
    crt?: string;
    key?: string;
    client_cas?: string;
    remote_addr?: string;
  }

  function connect(
    opts: NgrokOptions,
    cb: (error: Error | null, publicUrl: string, uiUrl: string) => void
  ): void;

  function disconnect(cb: (error: Error | null) => void): void;
  function disconnect(publicUrl: string, cb?: (error: Error | null) => void): void;

  function authtoken(
    token: string,
    configPath: string,
    cb?: (error: Error | null, token: string) => void
  ): string;

  function kill(cb?: (error: Error | null) => void): void;

  function process(): ChildProcessWithoutNullStreams;

  type NgrokEvent = 'disconnect' | 'statuschange' | 'close' | 'error';
  function addListener(eventName: NgrokEvent, listener: (...args: any[]) => void): void;
  function removeAllListeners(eventName?: NgrokEvent): void;
}
