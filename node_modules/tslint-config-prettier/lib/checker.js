"use strict";
exports.__esModule = true;
var tslint_1 = require("tslint");
// tslint:disable-next-line:no-var-requires
var tslintConfigPrettier = require("..");
exports.check = function (configFilePaths) {
    if (configFilePaths.length === 0) {
        // tslint:disable-next-line:no-console
        console.log("Usage: tslint-config-prettier-check <pathToConfigFile> ...");
        return;
    }
    configFilePaths.forEach(function (configFilePath) {
        try {
            var conflictRules = getConflictRules(configFilePath);
            if (conflictRules.length) {
                // tslint:disable-next-line:no-console
                console.error("Conflict rule(s) detected in " + configFilePath + ":\n" + conflictRules
                    .map(function (conflictRule) { return "  " + conflictRule; })
                    .join("\n"));
                process.exitCode = 1;
            }
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            process.exitCode = 1;
        }
    });
};
function getConflictRules(configFilePath) {
    var _a = tslint_1.Linter.loadConfigurationFromPath(configFilePath), rules = _a.rules, jsRules = _a.jsRules;
    return Object.keys(tslintConfigPrettier.rules).filter(function (conflictRuleName) {
        return isConflict(conflictRuleName, rules) ||
            isConflict(conflictRuleName, jsRules);
    });
}
function isConflict(conflictRuleName, rules) {
    return (rules.has(conflictRuleName) &&
        rules.get(conflictRuleName).ruleSeverity !== "off");
}
