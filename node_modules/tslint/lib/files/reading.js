"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var error_1 = require("../error");
/** Read a file, but return undefined if it is an MPEG '.ts' file. */
function tryReadFile(filename, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var buffer, fd;
        return tslib_1.__generator(this, function (_a) {
            if (!fs.existsSync(filename)) {
                throw new error_1.FatalError("Unable to open file: " + filename);
            }
            buffer = Buffer.allocUnsafe(256);
            fd = fs.openSync(filename, "r");
            try {
                fs.readSync(fd, buffer, 0, 256, 0);
                if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
                    // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
                    // separator, repeating every 188 bytes. It is unlikely to find that pattern in
                    // TypeScript source, so tslint ignores files with the specific pattern.
                    logger.error(filename + ": ignoring MPEG transport stream\n");
                    return [2 /*return*/, undefined];
                }
            }
            finally {
                fs.closeSync(fd);
            }
            return [2 /*return*/, fs.readFileSync(filename, "utf8")];
        });
    });
}
exports.tryReadFile = tryReadFile;
