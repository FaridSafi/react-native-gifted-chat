/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare function runAndroidLoggingProcess(adbPath?: string): ChildProcess;
export declare function getAdbPath(customPath?: string): string;
export declare function spawnLogcatProcess(adbPath: string): ChildProcess;
export declare function getApplicationPid(applicationId: string, adbPath?: string): number;
//# sourceMappingURL=adb.d.ts.map