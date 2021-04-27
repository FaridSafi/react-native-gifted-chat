"use strict";
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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
// tslint:disable strict-boolean-expressions (TODO: Fix up options)
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var configuration_1 = require("./configuration");
var error_1 = require("./error");
var reading_1 = require("./files/reading");
var resolution_1 = require("./files/resolution");
var linter_1 = require("./linter");
var utils_1 = require("./utils");
function run(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runWorker(options, logger)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_2 = _a.sent();
                    if (error_2 instanceof error_1.FatalError) {
                        logger.error(error_2.message + "\n");
                        return [2 /*return*/, 1 /* FatalError */];
                    }
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function runWorker(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var test_1, results, _a, output, errorCount;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options.init) {
                        if (fs.existsSync(configuration_1.JSON_CONFIG_FILENAME)) {
                            throw new error_1.FatalError("Cannot generate " + configuration_1.JSON_CONFIG_FILENAME + ": file already exists");
                        }
                        fs.writeFileSync(configuration_1.JSON_CONFIG_FILENAME, JSON.stringify(configuration_1.DEFAULT_CONFIG, undefined, "    "));
                        return [2 /*return*/, 0 /* Ok */];
                    }
                    if (options.printConfig) {
                        return [2 /*return*/, printConfiguration(options, logger)];
                    }
                    if (!options.test) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./test"); })];
                case 1:
                    test_1 = _b.sent();
                    results = test_1.runTests((options.files || []).map(utils_1.trimSingleQuotes), options.rulesDirectory);
                    return [2 /*return*/, test_1.consoleTestResultsHandler(results, logger) ? 0 /* Ok */ : 1 /* FatalError */];
                case 2:
                    if (options.config && !fs.existsSync(options.config)) {
                        throw new error_1.FatalError("Invalid option for configuration: " + options.config);
                    }
                    return [4 /*yield*/, runLinter(options, logger)];
                case 3:
                    _a = _b.sent(), output = _a.output, errorCount = _a.errorCount;
                    if (output && output.trim()) {
                        logger.log(output + "\n");
                    }
                    return [2 /*return*/, options.force || errorCount === 0 ? 0 /* Ok */ : 2 /* LintError */];
            }
        });
    });
}
function printConfiguration(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var files, configurationPath, configuration;
        return tslib_1.__generator(this, function (_a) {
            files = options.files;
            if (files.length !== 1) {
                throw new error_1.FatalError("--print-config must be run with exactly one file");
            }
            configurationPath = options.config === undefined ? configuration_1.findConfigurationPath(null, files[0]) : options.config;
            if (configurationPath === undefined) {
                throw new error_1.FatalError("Could not find configuration path. Try passing a --config to your tslint.json.");
            }
            configuration = configuration_1.findConfiguration(configurationPath, files[0]).results;
            if (configuration === undefined) {
                throw new error_1.FatalError("Could not find configuration for '" + files[1]);
            }
            logger.log(configuration_1.stringifyConfiguration(configuration) + "\n");
            return [2 /*return*/, 0 /* Ok */];
        });
    });
}
function runLinter(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, files, program, diagnostics, message;
        return tslib_1.__generator(this, function (_b) {
            _a = resolution_1.resolveFilesAndProgram(options, logger), files = _a.files, program = _a.program;
            // if type checking, run the type checker
            if (program && options.typeCheck) {
                diagnostics = ts.getPreEmitDiagnostics(program);
                if (diagnostics.length !== 0) {
                    message = diagnostics
                        .map(function (d) { return showDiagnostic(d, program, options.outputAbsolutePaths); })
                        .join("\n");
                    if (options.force) {
                        logger.error(message + "\n");
                    }
                    else {
                        throw new error_1.FatalError(message);
                    }
                }
            }
            return [2 /*return*/, doLinting(options, files, program, logger)];
        });
    });
}
function doLinting(options, files, program, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var configFile, formatter, linter, lastFolder, _i, files_1, file, folder, contents, sourceFile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configFile = options.config !== undefined ? configuration_1.findConfiguration(options.config).results : undefined;
                    formatter = options.format;
                    if (formatter === undefined) {
                        formatter =
                            configFile && configFile.linterOptions && configFile.linterOptions.format
                                ? configFile.linterOptions.format
                                : "stylish";
                    }
                    linter = new linter_1.Linter({
                        fix: !!options.fix,
                        formatter: formatter,
                        formattersDirectory: options.formattersDirectory,
                        quiet: !!options.quiet,
                        rulesDirectory: options.rulesDirectory,
                    }, program);
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    file = files_1[_i];
                    if (options.config === undefined) {
                        folder = path.dirname(file);
                        if (lastFolder !== folder) {
                            configFile = configuration_1.findConfiguration(null, folder).results;
                            lastFolder = folder;
                        }
                    }
                    if (configuration_1.isFileExcluded(file, configFile)) {
                        return [3 /*break*/, 5];
                    }
                    contents = void 0;
                    if (!(program !== undefined)) return [3 /*break*/, 2];
                    sourceFile = program.getSourceFile(file);
                    if (sourceFile !== undefined) {
                        contents = sourceFile.text;
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, reading_1.tryReadFile(file, logger)];
                case 3:
                    contents = _a.sent();
                    _a.label = 4;
                case 4:
                    if (contents !== undefined) {
                        linter.lint(file, contents, configFile);
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, linter.getResult()];
            }
        });
    });
}
function showDiagnostic(_a, program, outputAbsolutePaths) {
    var file = _a.file, start = _a.start, category = _a.category, messageText = _a.messageText;
    var message = ts.DiagnosticCategory[category];
    if (file !== undefined && start !== undefined) {
        var _b = file.getLineAndCharacterOfPosition(start), line = _b.line, character = _b.character;
        var currentDirectory = program.getCurrentDirectory();
        var filePath = outputAbsolutePaths
            ? path.resolve(currentDirectory, file.fileName)
            : path.relative(currentDirectory, file.fileName);
        message += " at " + filePath + ":" + (line + 1) + ":" + (character + 1) + ":";
    }
    return message + " " + ts.flattenDiagnosticMessageText(messageText, "\n");
}
