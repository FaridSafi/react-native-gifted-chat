import { RequestInit as FetchOptions, Request, Headers } from 'node-fetch';
export default function fetch(url: string | Request, options?: FetchOptions): Promise<{
    status: number;
    data: any;
    headers: Headers;
}>;
//# sourceMappingURL=fetch.d.ts.map