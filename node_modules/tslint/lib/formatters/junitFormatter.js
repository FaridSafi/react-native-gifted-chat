"use strict";
/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
var abstractFormatter_1 = require("../language/formatter/abstractFormatter");
var Utils = require("../utils");
var Formatter = /** @class */ (function (_super) {
    tslib_1.__extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Formatter.prototype.format = function (failures, _fixes, fileNames) {
        var output = '<?xml version="1.0" encoding="utf-8"?><testsuites package="tslint">';
        var failureFileNames = new Set(tslib_1.__spreadArrays(failures.map(function (f) { return f.getFileName(); })));
        if (failures.length !== 0) {
            var failuresSorted = failures.sort(function (a, b) {
                return a.getFileName().localeCompare(b.getFileName());
            });
            var previousFilename = null;
            for (var _i = 0, failuresSorted_1 = failuresSorted; _i < failuresSorted_1.length; _i++) {
                var failure = failuresSorted_1[_i];
                var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                var message = this.escapeXml(failure.getFailure());
                var rule = this.escapeXml(failure.getRuleName());
                var severity = failure.getRuleSeverity();
                if (failure.getFileName() !== previousFilename) {
                    if (previousFilename !== null) {
                        output += "</testsuite>";
                    }
                    previousFilename = failure.getFileName();
                    output += "<testsuite name=\"" + this.escapeXml(failure.getFileName()) + "\">";
                }
                output += "<testcase name=\"" + rule + "\" ";
                output += "classname=\"" + this.escapeXml(failure.getFileName()) + "\">";
                output += "<failure type=\"" + severity + "\">" + message + " ";
                output += "Line " + (lineAndCharacter.line + 1) + ", ";
                output += "Column " + (lineAndCharacter.character + 1);
                output += "</failure>";
                output += "</testcase>";
            }
            if (previousFilename !== null) {
                output += "</testsuite>";
            }
        }
        if (fileNames !== undefined && fileNames.length !== 0) {
            // Filter out files which have had a failure associated with them.
            var filteredFileNames = fileNames.filter(function (fileName) { return !failureFileNames.has(fileName); });
            for (var _a = 0, filteredFileNames_1 = filteredFileNames; _a < filteredFileNames_1.length; _a++) {
                var fileName = filteredFileNames_1[_a];
                output += "<testsuite name=\"" + this.escapeXml(fileName) + "\" errors=\"0\">";
                output += "<testcase name=\"" + this.escapeXml(fileName) + "\" />";
                output += "</testsuite>";
            }
        }
        output += "</testsuites>";
        return output;
    };
    Formatter.prototype.escapeXml = function (str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#39;")
            .replace(/"/g, "&quot;");
    };
    /* tslint:disable:object-literal-sort-keys */
    Formatter.metadata = {
        formatterName: "junit",
        description: "Formats errors as though they were JUnit output.",
        descriptionDetails: Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            Imitates the JUnit XML Output"], ["\n            Imitates the JUnit XML Output"]))),
        sample: Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n        <?xml version=\"1.0\" encoding=\"utf-8\"?>\n        <testsuites package=\"tslint\">\n          <testsuite name=\"myFile.ts\">\n            <testcase name=\"semicolon\" classname=\"myFile.ts\">\n              <failure type=\"warning\">Missing semicolon Line 1, Column 14</failure>\n            </testcase>\n          </testsuite>\n        </testsuites>\n        "], ["\n        <?xml version=\"1.0\" encoding=\"utf-8\"?>\n        <testsuites package=\"tslint\">\n          <testsuite name=\"myFile.ts\">\n            <testcase name=\"semicolon\" classname=\"myFile.ts\">\n              <failure type=\"warning\">Missing semicolon Line 1, Column 14</failure>\n            </testcase>\n          </testsuite>\n        </testsuites>\n        "]))),
        consumer: "machine",
    };
    return Formatter;
}(abstractFormatter_1.AbstractFormatter));
exports.Formatter = Formatter;
var templateObject_1, templateObject_2;
