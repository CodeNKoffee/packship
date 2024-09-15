"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPackage = void 0;
var axios_1 = require("axios");
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var commander_1 = require("commander");
var publishCommand = new commander_1.Command();
// Function to get project data from package.json or .packshiprc
function getLocalProjectData() {
    var packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
        var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        return {
            serialNumber: packageJson.serialNumber || "UNKNOWN",
            author: packageJson.author || "UNKNOWN",
            packageName: packageJson.name,
        };
    }
    else {
        throw new Error("package.json not found. Ensure you are in the correct project directory.");
    }
}
// Function to check the npm registry for existing package data
function checkNpmRegistry(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://registry.npmjs.org/".concat(packageName);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, null]; // Package does not exist on npm
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Main function to handle package publishing
publishCommand
    .command("publish")
    .description('Publish a package')
    .action(publishPackage);
function publishPackage() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var localData, registryData, registryAuthor, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    localData = getLocalProjectData();
                    return [4 /*yield*/, checkNpmRegistry(localData.packageName)];
                case 1:
                    registryData = _b.sent();
                    if (!registryData) {
                        console.log("\n\x1b[31m%s\x1b[0m", "Package does not exist on npm. Proceeding to publish...");
                        // Execute npm publish
                        (0, child_process_1.exec)("npm publish", function (err, stdout, stderr) {
                            if (err) {
                                console.error("Error during npm publish: ".concat(stderr));
                            }
                            else {
                                console.log("Publish successful: ".concat(stdout));
                            }
                        });
                    }
                    else {
                        registryAuthor = (_a = registryData.author) === null || _a === void 0 ? void 0 : _a.email;
                        // Check if author and package name match
                        if (registryAuthor === localData.author) {
                            console.log("\n\x1b[31m%s\x1b[0m", "Package is valid and can be published.");
                            // Execute npm publish
                            (0, child_process_1.exec)("npm publish", function (err, stdout, stderr) {
                                if (err) {
                                    console.error("Error during npm publish: ".concat(stderr));
                                }
                                else {
                                    console.log("Publish successful: ".concat(stdout));
                                }
                            });
                        }
                        else {
                            console.error("Package name or author mismatch. Cannot publish.");
                        }
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    console.error("Error: ".concat(error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.publishPackage = publishPackage;
publishCommand.parse(process.argv);
