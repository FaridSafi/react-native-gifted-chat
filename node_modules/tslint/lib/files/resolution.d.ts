/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as ts from "typescript";
import { Logger, Options } from "../runner";
export declare function filterFiles(files: string[], patterns: string[], include: boolean): string[];
export declare function findTsconfig(project: string): string | undefined;
export declare function resolveGlobs(files: string[], ignore: string[], outputAbsolutePaths: boolean | undefined, logger: Logger): string[];
export declare function resolveFilesAndProgram({ files, project, exclude, outputAbsolutePaths }: Options, logger: Logger): {
    files: string[];
    program?: ts.Program;
};
