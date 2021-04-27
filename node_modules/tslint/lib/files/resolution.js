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
var fs = require("fs");
var glob = require("glob");
var minimatch_1 = require("minimatch");
var path = require("path");
var error_1 = require("../error");
var linter_1 = require("../linter");
var utils_1 = require("../utils");
function filterFiles(files, patterns, include) {
    if (patterns.length === 0) {
        return include ? [] : files;
    }
    var matcher = patterns.map(function (pattern) { return new minimatch_1.Minimatch(pattern, { dot: !include }); }); // `glob` always enables `dot` for ignore patterns
    return files.filter(function (file) { return include === matcher.some(function (pattern) { return pattern.match(file); }); });
}
exports.filterFiles = filterFiles;
function findTsconfig(project) {
    try {
        var stats = fs.statSync(project); // throws if file does not exist
        if (!stats.isDirectory()) {
            return project;
        }
        var projectFile = path.join(project, "tsconfig.json");
        fs.accessSync(projectFile); // throws if file does not exist
        return projectFile;
    }
    catch (e) {
        return undefined;
    }
}
exports.findTsconfig = findTsconfig;
function resolveGlobs(files, ignore, outputAbsolutePaths, logger) {
    var results = utils_1.flatMap(files, function (file) {
        return glob.sync(utils_1.trimSingleQuotes(file), { ignore: ignore, nodir: true });
    });
    // warn if `files` contains non-existent files, that are not patters and not excluded by any of the exclude patterns
    for (var _i = 0, _a = filterFiles(files, ignore, false); _i < _a.length; _i++) {
        var file = _a[_i];
        if (!glob.hasMagic(file) && !results.some(minimatch_1.filter(file))) {
            logger.error("'" + file + "' does not exist. This will be an error in TSLint 6.\n"); // TODO make this an error in v6.0.0
        }
    }
    var cwd = process.cwd();
    return results.map(function (file) {
        return outputAbsolutePaths ? path.resolve(cwd, file) : path.relative(cwd, file);
    });
}
exports.resolveGlobs = resolveGlobs;
function resolveFilesAndProgram(_a, logger) {
    var files = _a.files, project = _a.project, exclude = _a.exclude, outputAbsolutePaths = _a.outputAbsolutePaths;
    // remove single quotes which break matching on Windows when glob is passed in single quotes
    exclude = exclude.map(utils_1.trimSingleQuotes);
    if (project === undefined) {
        return { files: resolveGlobs(files, exclude, outputAbsolutePaths, logger) };
    }
    var projectPath = findTsconfig(project);
    if (projectPath === undefined) {
        throw new error_1.FatalError("Invalid option for project: " + project);
    }
    exclude = exclude.map(function (pattern) { return path.resolve(pattern); });
    var program = linter_1.Linter.createProgram(projectPath);
    var filesFound;
    if (files.length === 0) {
        filesFound = filterFiles(linter_1.Linter.getFileNames(program), exclude, false);
    }
    else {
        files = files.map(function (f) { return path.resolve(f); });
        filesFound = filterFiles(program.getSourceFiles().map(function (f) { return f.fileName; }), files, true);
        filesFound = filterFiles(filesFound, exclude, false);
        // find non-glob files that have no matching file in the project and are not excluded by any exclude pattern
        for (var _i = 0, _b = filterFiles(files, exclude, false); _i < _b.length; _i++) {
            var file = _b[_i];
            if (!glob.hasMagic(file) && !filesFound.some(minimatch_1.filter(file))) {
                if (fs.existsSync(file)) {
                    throw new error_1.FatalError("'" + file + "' is not included in project.");
                }
                logger.error("'" + file + "' does not exist. This will be an error in TSLint 6.\n"); // TODO make this an error in v6.0.0
            }
        }
    }
    return { files: filesFound, program: program };
}
exports.resolveFilesAndProgram = resolveFilesAndProgram;
