/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 5241:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(5241);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7351));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const childProcess = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const util_1 = __nccwpck_require__(3837);
const ioUtil = __importStar(__nccwpck_require__(1962));
const exec = util_1.promisify(childProcess.exec);
const execFile = util_1.promisify(childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
            try {
                const cmdPath = ioUtil.getCmdPath();
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
                else {
                    yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield execFile(`rm`, [`-rf`, `${inputPath}`]);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 2473:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
const semver = __importStar(__nccwpck_require__(5911));
const core_1 = __nccwpck_require__(2186);
// needs to be require for core node modules to be mocked
/* eslint @typescript-eslint/no-require-imports: 0 */
const os = __nccwpck_require__(2037);
const cp = __nccwpck_require__(2081);
const fs = __nccwpck_require__(7147);
function _findMatch(versionSpec, stable, candidates, archFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
            const version = candidate.version;
            core_1.debug(`check ${version} satisfies ${versionSpec}`);
            if (semver.satisfies(version, versionSpec) &&
                (!stable || candidate.stable === stable)) {
                file = candidate.files.find(item => {
                    core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
                    let chk = item.arch === archFilter && item.platform === platFilter;
                    if (chk && item.platform_version) {
                        const osVersion = module.exports._getOsVersion();
                        if (osVersion === item.platform_version) {
                            chk = true;
                        }
                        else {
                            chk = semver.satisfies(osVersion, item.platform_version);
                        }
                    }
                    return chk;
                });
                if (file) {
                    core_1.debug(`matched ${candidate.version}`);
                    match = candidate;
                    break;
                }
            }
        }
        if (match && file) {
            // clone since we're mutating the file list to be only the file that matches
            result = Object.assign({}, match);
            result.files = [file];
        }
        return result;
    });
}
exports._findMatch = _findMatch;
function _getOsVersion() {
    // TODO: add windows and other linux, arm variants
    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
    const plat = os.platform();
    let version = '';
    if (plat === 'darwin') {
        version = cp.execSync('sw_vers -productVersion').toString();
    }
    else if (plat === 'linux') {
        // lsb_release process not in some containers, readfile
        // Run cat /etc/lsb-release
        // DISTRIB_ID=Ubuntu
        // DISTRIB_RELEASE=18.04
        // DISTRIB_CODENAME=bionic
        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
        const lsbContents = module.exports._readLinuxVersionFile();
        if (lsbContents) {
            const lines = lsbContents.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts.length === 2 &&
                    (parts[0].trim() === 'VERSION_ID' ||
                        parts[0].trim() === 'DISTRIB_RELEASE')) {
                    version = parts[1]
                        .trim()
                        .replace(/^"/, '')
                        .replace(/"$/, '');
                    break;
                }
            }
        }
    }
    return version;
}
exports._getOsVersion = _getOsVersion;
function _readLinuxVersionFile() {
    const lsbReleaseFile = '/etc/lsb-release';
    const osReleaseFile = '/etc/os-release';
    let contents = '';
    if (fs.existsSync(lsbReleaseFile)) {
        contents = fs.readFileSync(lsbReleaseFile).toString();
    }
    else if (fs.existsSync(osReleaseFile)) {
        contents = fs.readFileSync(osReleaseFile).toString();
    }
    return contents;
}
exports._readLinuxVersionFile = _readLinuxVersionFile;
//# sourceMappingURL=manifest.js.map

/***/ }),

/***/ 8279:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetryHelper = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Internal class for retries
 */
class RetryHelper {
    constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
            throw new Error('max attempts should be greater than or equal to 1');
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
            throw new Error('min seconds should be less than or equal to max seconds');
        }
    }
    execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 1;
            while (attempt < this.maxAttempts) {
                // Try
                try {
                    return yield action();
                }
                catch (err) {
                    if (isRetryable && !isRetryable(err)) {
                        throw err;
                    }
                    core.info(err.message);
                }
                // Sleep
                const seconds = this.getSleepAmount();
                core.info(`Waiting ${seconds} seconds before trying again`);
                yield this.sleep(seconds);
                attempt++;
            }
            // Last attempt
            return yield action();
        });
    }
    getSleepAmount() {
        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
            this.minSeconds);
    }
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, seconds * 1000));
        });
    }
}
exports.RetryHelper = RetryHelper;
//# sourceMappingURL=retry-helper.js.map

/***/ }),

/***/ 7784:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateVersions = exports.isExplicitVersion = exports.findFromManifest = exports.getManifestFromRepo = exports.findAllVersions = exports.find = exports.cacheFile = exports.cacheDir = exports.extractZip = exports.extractXar = exports.extractTar = exports.extract7z = exports.downloadTool = exports.HTTPError = void 0;
const core = __importStar(__nccwpck_require__(2186));
const io = __importStar(__nccwpck_require__(7351));
const fs = __importStar(__nccwpck_require__(7147));
const mm = __importStar(__nccwpck_require__(2473));
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const httpm = __importStar(__nccwpck_require__(6255));
const semver = __importStar(__nccwpck_require__(5911));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const assert_1 = __nccwpck_require__(9491);
const v4_1 = __importDefault(__nccwpck_require__(7468));
const exec_1 = __nccwpck_require__(1514);
const retry_helper_1 = __nccwpck_require__(8279);
class HTTPError extends Error {
    constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HTTPError = HTTPError;
const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const userAgent = 'actions/tool-cache';
/**
 * Download a tool from an url and stream it into a file
 *
 * @param url       url of tool to download
 * @param dest      path to download tool
 * @param auth      authorization header
 * @param headers   other headers
 * @returns         path to downloaded tool
 */
function downloadTool(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path.join(_getTempDirectory(), v4_1.default());
        yield io.mkdirP(path.dirname(dest));
        core.debug(`Downloading ${url}`);
        core.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
        const maxSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
            return yield downloadToolAttempt(url, dest || '', auth, headers);
        }), (err) => {
            if (err instanceof HTTPError && err.httpStatusCode) {
                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
                if (err.httpStatusCode < 500 &&
                    err.httpStatusCode !== 408 &&
                    err.httpStatusCode !== 429) {
                    return false;
                }
            }
            // Otherwise retry
            return true;
        });
    });
}
exports.downloadTool = downloadTool;
function downloadToolAttempt(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
            throw new Error(`Destination file path ${dest} already exists`);
        }
        // Get the response headers
        const http = new httpm.HttpClient(userAgent, [], {
            allowRetries: false
        });
        if (auth) {
            core.debug('set auth');
            if (headers === undefined) {
                headers = {};
            }
            headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
            const err = new HTTPError(response.message.statusCode);
            core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            throw err;
        }
        // Download the response body
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
            yield pipeline(readStream, fs.createWriteStream(dest));
            core.debug('download complete');
            succeeded = true;
            return dest;
        }
        finally {
            // Error, delete dest before retry
            if (!succeeded) {
                core.debug('download failed');
                try {
                    yield io.rmRF(dest);
                }
                catch (err) {
                    core.debug(`Failed to delete '${dest}'. ${err.message}`);
                }
            }
        }
    });
}
/**
 * Extract a .7z file
 *
 * @param file     path to the .7z file
 * @param dest     destination directory. Optional.
 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
 * interface, it is smaller than the full command line interface, and it does support long paths. At the
 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
 * to 7zr.exe can be pass to this function.
 * @returns        path to the destination directory
 */
function extract7z(file, dest, _7zPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS, 'extract7z() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
            try {
                const logLevel = core.isDebug() ? '-bb1' : '-bb0';
                const args = [
                    'x',
                    logLevel,
                    '-bd',
                    '-sccUTF-8',
                    file
                ];
                const options = {
                    silent: true
                };
                yield exec_1.exec(`"${_7zPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        else {
            const escapedScript = path
                .join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1')
                .replace(/'/g, "''")
                .replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ];
            const options = {
                silent: true
            };
            try {
                const powershellPath = yield io.which('powershell', true);
                yield exec_1.exec(`"${powershellPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        return dest;
    });
}
exports.extract7z = extract7z;
/**
 * Extract a compressed tar archive
 *
 * @param file     path to the tar
 * @param dest     destination directory. Optional.
 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
 * @returns        path to the destination directory
 */
function extractTar(file, dest, flags = 'xz') {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        // Create dest
        dest = yield _createExtractFolder(dest);
        // Determine whether GNU tar
        core.debug('Checking tar --version');
        let versionOutput = '';
        yield exec_1.exec('tar --version', [], {
            ignoreReturnCode: true,
            silent: true,
            listeners: {
                stdout: (data) => (versionOutput += data.toString()),
                stderr: (data) => (versionOutput += data.toString())
            }
        });
        core.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
        // Initialize args
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        if (core.isDebug() && !flags.includes('v')) {
            args.push('-v');
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS && isGnuTar) {
            args.push('--force-local');
            destArg = dest.replace(/\\/g, '/');
            // Technically only the dest needs to have `/` but for aesthetic consistency
            // convert slashes in the file arg too.
            fileArg = file.replace(/\\/g, '/');
        }
        if (isGnuTar) {
            // Suppress warnings when using GNU tar to extract archives created by BSD tar
            args.push('--warning=no-unknown-keyword');
            args.push('--overwrite');
        }
        args.push('-C', destArg, '-f', fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
    });
}
exports.extractTar = extractTar;
/**
 * Extract a xar compatible archive
 *
 * @param file     path to the archive
 * @param dest     destination directory. Optional.
 * @param flags    flags for the xar. Optional.
 * @returns        path to the destination directory
 */
function extractXar(file, dest, flags = []) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, 'extractXar() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        args.push('-x', '-C', dest, '-f', file);
        if (core.isDebug()) {
            args.push('-v');
        }
        const xarPath = yield io.which('xar', true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
    });
}
exports.extractXar = extractXar;
/**
 * Extract a zip
 *
 * @param file     path to the zip
 * @param dest     destination directory. Optional.
 * @returns        path to the destination directory
 */
function extractZip(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS) {
            yield extractZipWin(file, dest);
        }
        else {
            yield extractZipNix(file, dest);
        }
        return dest;
    });
}
exports.extractZip = extractZip;
function extractZipWin(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // build the powershell command
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
        const pwshPath = yield io.which('pwsh', false);
        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
        //and the -Force flag for Expand-Archive as a fallback
        if (pwshPath) {
            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
            const pwshCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                pwshCommand
            ];
            core.debug(`Using pwsh at path: ${pwshPath}`);
            yield exec_1.exec(`"${pwshPath}"`, args);
        }
        else {
            const powershellCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                powershellCommand
            ];
            const powershellPath = yield io.which('powershell', true);
            core.debug(`Using powershell at path: ${powershellPath}`);
            yield exec_1.exec(`"${powershellPath}"`, args);
        }
    });
}
function extractZipNix(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io.which('unzip', true);
        const args = [file];
        if (!core.isDebug()) {
            args.unshift('-q');
        }
        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
    });
}
/**
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir    the directory to cache into tools
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheDir(sourceDir, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source dir: ${sourceDir}`);
        if (!fs.statSync(sourceDir).isDirectory()) {
            throw new Error('sourceDir is not a directory');
        }
        // Create the tool dir
        const destPath = yield _createToolPath(tool, version, arch);
        // copy each child item. do not move. move can fail on Windows
        // due to anti-virus software having an open handle on a file.
        for (const itemName of fs.readdirSync(sourceDir)) {
            const s = path.join(sourceDir, itemName);
            yield io.cp(s, destPath, { recursive: true });
        }
        // write .complete
        _completeToolPath(tool, version, arch);
        return destPath;
    });
}
exports.cacheDir = cacheDir;
/**
 * Caches a downloaded file (GUID) and installs it
 * into the tool cache with a given targetName
 *
 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
 * @param targetFile    the name of the file name in the tools directory
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheFile(sourceFile, targetFile, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source file: ${sourceFile}`);
        if (!fs.statSync(sourceFile).isFile()) {
            throw new Error('sourceFile is not a file');
        }
        // create the tool dir
        const destFolder = yield _createToolPath(tool, version, arch);
        // copy instead of move. move can fail on Windows due to
        // anti-virus software having an open handle on a file.
        const destPath = path.join(destFolder, targetFile);
        core.debug(`destination file ${destPath}`);
        yield io.cp(sourceFile, destPath);
        // write .complete
        _completeToolPath(tool, version, arch);
        return destFolder;
    });
}
exports.cacheFile = cacheFile;
/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   version of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */
function find(toolName, versionSpec, arch) {
    if (!toolName) {
        throw new Error('toolName parameter is required');
    }
    if (!versionSpec) {
        throw new Error('versionSpec parameter is required');
    }
    arch = arch || os.arch();
    // attempt to resolve an explicit version
    if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
    }
    // check for the explicit version in the cache
    let toolPath = '';
    if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || '';
        const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core.debug(`checking cache: ${cachePath}`);
        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
            core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
            toolPath = cachePath;
        }
        else {
            core.debug('not found');
        }
    }
    return toolPath;
}
exports.find = find;
/**
 * Finds the paths to all versions of a tool that are installed in the local tool cache
 *
 * @param toolName  name of the tool
 * @param arch      optional arch.  defaults to arch of computer
 */
function findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || os.arch();
    const toolPath = path.join(_getCacheDirectory(), toolName);
    if (fs.existsSync(toolPath)) {
        const children = fs.readdirSync(toolPath);
        for (const child of children) {
            if (isExplicitVersion(child)) {
                const fullPath = path.join(toolPath, child, arch || '');
                if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
                    versions.push(child);
                }
            }
        }
    }
    return versions;
}
exports.findAllVersions = findAllVersions;
function getManifestFromRepo(owner, repo, auth, branch = 'master') {
    return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient('tool-cache');
        const headers = {};
        if (auth) {
            core.debug('set auth');
            headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
            return releases;
        }
        let manifestUrl = '';
        for (const item of response.result.tree) {
            if (item.path === 'versions-manifest.json') {
                manifestUrl = item.url;
                break;
            }
        }
        headers['accept'] = 'application/vnd.github.VERSION.raw';
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
            // shouldn't be needed but protects against invalid json saved with BOM
            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
            try {
                releases = JSON.parse(versionsRaw);
            }
            catch (_a) {
                core.debug('Invalid json');
            }
        }
        return releases;
    });
}
exports.getManifestFromRepo = getManifestFromRepo;
function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
    return __awaiter(this, void 0, void 0, function* () {
        // wrap the internal impl
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
    });
}
exports.findFromManifest = findFromManifest;
function _createExtractFolder(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
            // create a temp dir
            dest = path.join(_getTempDirectory(), v4_1.default());
        }
        yield io.mkdirP(dest);
        return dest;
    });
}
function _createToolPath(tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
        core.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io.rmRF(folderPath);
        yield io.rmRF(markerPath);
        yield io.mkdirP(folderPath);
        return folderPath;
    });
}
function _completeToolPath(tool, version, arch) {
    const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
    const markerPath = `${folderPath}.complete`;
    fs.writeFileSync(markerPath, '');
    core.debug('finished caching tool');
}
/**
 * Check if version string is explicit
 *
 * @param versionSpec      version string to check
 */
function isExplicitVersion(versionSpec) {
    const c = semver.clean(versionSpec) || '';
    core.debug(`isExplicit: ${c}`);
    const valid = semver.valid(c) != null;
    core.debug(`explicit? ${valid}`);
    return valid;
}
exports.isExplicitVersion = isExplicitVersion;
/**
 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
 *
 * @param versions        array of versions to evaluate
 * @param versionSpec     semantic version spec to satisfy
 */
function evaluateVersions(versions, versionSpec) {
    let version = '';
    core.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
            return 1;
        }
        return -1;
    });
    for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) {
        core.debug(`matched: ${version}`);
    }
    else {
        core.debug('match not found');
    }
    return version;
}
exports.evaluateVersions = evaluateVersions;
/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
    assert_1.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
    return cacheDirectory;
}
/**
 * Gets RUNNER_TEMP
 */
function _getTempDirectory() {
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    assert_1.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
    return tempDirectory;
}
/**
 * Gets a global variable
 */
function _getGlobal(key, defaultValue) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const value = global[key];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return value !== undefined ? value : defaultValue;
}
/**
 * Returns an array of unique values.
 * @param values Values to make unique.
 */
function _unique(values) {
    return Array.from(new Set(values));
}
//# sourceMappingURL=tool-cache.js.map

/***/ }),

/***/ 7701:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 7269:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __nccwpck_require__(6113);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 7468:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(7269);
var bytesToUuid = __nccwpck_require__(7701);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 308:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

(()=>{"use strict";var e={3497:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.isExternalAccount=t.isServiceAccountKey=t.parseCredential=void 0;const s=n(6976);const i=n(3102);function parseCredential(e){e=(e||"").trim();if(!e){throw new Error(`Missing service account key JSON (got empty value)`)}if(!e.startsWith("{")){e=(0,i.fromBase64)(e)}try{const t=JSON.parse(e);return t}catch(e){const t=(0,s.errorMessage)(e);throw new SyntaxError(`Failed to parse service account key JSON credentials: ${t}`)}}t.parseCredential=parseCredential;function isServiceAccountKey(e){return e.type==="service_account"}t.isServiceAccountKey=isServiceAccountKey;function isExternalAccount(e){return e.type!=="external_account"}t.isExternalAccount=isExternalAccount;t["default"]={parseCredential:parseCredential,isServiceAccountKey:isServiceAccountKey,isExternalAccount:isExternalAccount}},1848:function(e,t,n){var s=this&&this.__createBinding||(Object.create?function(e,t,n,s){if(s===undefined)s=n;var i=Object.getOwnPropertyDescriptor(t,n);if(!i||("get"in i?!t.__esModule:i.writable||i.configurable)){i={enumerable:true,get:function(){return t[n]}}}Object.defineProperty(e,s,i)}:function(e,t,n,s){if(s===undefined)s=n;e[s]=t[n]});var i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t});var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(n!=="default"&&Object.prototype.hasOwnProperty.call(e,n))s(t,e,n);i(t,e);return t};Object.defineProperty(t,"__esModule",{value:true});t.deepClone=void 0;const o=r(n(4655));function deepClone(e,t=true){if(t&&typeof structuredClone==="function"){return structuredClone(e)}return o.deserialize(o.serialize(e))}t.deepClone=deepClone},7962:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.parseCSV=void 0;function parseCSV(e){e=(e||"").trim();if(!e){return[]}const t=e.split(/(?<!\\),/gi);for(let e=0;e<t.length;e++){t[e]=t[e].trim().replace(/\\,/gi,",")}return t}t.parseCSV=parseCSV},3102:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.fromBase64=t.toBase64=void 0;function toBase64(e){return Buffer.from(e).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}t.toBase64=toBase64;function fromBase64(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4)t+="=";return Buffer.from(t,"base64").toString("utf8")}t.fromBase64=fromBase64},6976:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.isNotFoundError=t.errorMessage=void 0;function errorMessage(e){let t;if(e===null){t="null"}else if(e===undefined||typeof e==="undefined"){t="undefined"}else if(typeof e==="bigint"||e instanceof BigInt){t=e.toString()}else if(typeof e==="boolean"||e instanceof Boolean){t=e.toString()}else if(e instanceof Error){t=e.message}else if(typeof e==="function"||e instanceof Function){t=errorMessage(e())}else if(typeof e==="number"||e instanceof Number){t=e.toString()}else if(typeof e==="string"||e instanceof String){t=e.toString()}else if(typeof e==="symbol"||e instanceof Symbol){t=e.toString()}else if(typeof e==="object"||e instanceof Object){t=JSON.stringify(e)}else{t=String(`[${typeof e}] ${e}`)}const n=t.trim().replace("Error: ","").trim();if(!n)return"";if(n.length>1&&isUpper(n[0])&&!isUpper(n[1])){return n[0].toLowerCase()+n.slice(1)}return n}t.errorMessage=errorMessage;function isNotFoundError(e){const t=errorMessage(e);return t.toUpperCase().includes("ENOENT")}t.isNotFoundError=isNotFoundError;function isUpper(e){return e===e.toUpperCase()}},3252:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.readUntil=t.parseFlags=void 0;function parseFlags(e){const t=[];let n="";let s=false;for(let i=0;i<e.length;i++){const r=e[i];if(r===`'`){const t=readUntil(e.slice(i+1),`'`);if(t===null){throw new Error(`Unterminated single quote in ${e} at position ${i}`)}n+=r+t;i+=t.length;continue}if(r===`"`){const t=readUntil(e.slice(i+1),`"`);if(t===null){throw new Error(`Unterminated double quote in ${e} at position ${i}`)}n+=r+t;i+=t.length;continue}if(r==="\r"||r===`\n`||r===` `){s=false;if(n!==``){t.push(n);n=``}continue}if(r===`=`){if(!s&&n[0]===`-`){t.push(n);n=``;s=true;continue}}n+=r}if(n!==""){t.push(n)}return t}t.parseFlags=parseFlags;function readUntil(e,t){let n=false;let s="";for(let i=0;i<e.length;i++){const r=e[i];s+=r;if(r===`\\`){n=true;continue}if(r===t&&!n){return s}n=false}return null}t.readUntil=readUntil},9219:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.removeFile=t.writeSecureFile=t.isEmptyDir=t.forceRemove=void 0;const i=n(7147);const r=n(6976);function forceRemove(e){return s(this,void 0,void 0,(function*(){try{yield i.promises.rm(e,{force:true,recursive:true})}catch(t){if(!(0,r.isNotFoundError)(t)){const n=(0,r.errorMessage)(t);throw new Error(`Failed to remove "${e}": ${n}`)}}}))}t.forceRemove=forceRemove;function isEmptyDir(e){return s(this,void 0,void 0,(function*(){try{const t=yield i.promises.readdir(e);return t.length<=0}catch(e){return true}}))}t.isEmptyDir=isEmptyDir;function writeSecureFile(e,t){return s(this,void 0,void 0,(function*(){yield i.promises.writeFile(e,t,{mode:416,flag:"wx"});return e}))}t.writeSecureFile=writeSecureFile;function removeFile(e){return s(this,void 0,void 0,(function*(){try{yield i.promises.unlink(e);return true}catch(t){if((0,r.isNotFoundError)(t)){return false}const n=(0,r.errorMessage)(t);throw new Error(`Failed to remove "${e}": ${n}`)}}))}t.removeFile=removeFile},546:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.parseGcloudIgnore=void 0;const i=n(7147);const r=n(1017);const o=n(6976);function parseGcloudIgnore(e){return s(this,void 0,void 0,(function*(){const t=(0,r.dirname)(e);let n=[];try{n=(yield i.promises.readFile(e,{encoding:"utf-8"})).toString().split(/\r?\n/).filter(shouldKeepIgnoreLine).map((e=>e.trim()))}catch(e){if(!(0,o.isNotFoundError)(e)){throw e}}for(let e=0;e<n.length;e++){const s=n[e];if(s.startsWith("#!include:")){const o=s.substring(10).trim();const a=(0,r.join)(t,o);const c=(yield i.promises.readFile(a,{encoding:"utf-8"})).toString().split(/\r?\n/).filter(shouldKeepIgnoreLine).map((e=>e.trim()));n.splice(e,1,...c);e+=c.length}}return n}))}t.parseGcloudIgnore=parseGcloudIgnore;function shouldKeepIgnoreLine(e){const t=(e||"").trim();if(t===""){return false}if(t.startsWith("#")&&!t.startsWith("#!")){return false}return true}},6144:function(e,t,n){var s=this&&this.__createBinding||(Object.create?function(e,t,n,s){if(s===undefined)s=n;var i=Object.getOwnPropertyDescriptor(t,n);if(!i||("get"in i?!t.__esModule:i.writable||i.configurable)){i={enumerable:true,get:function(){return t[n]}}}Object.defineProperty(e,s,i)}:function(e,t,n,s){if(s===undefined)s=n;e[s]=t[n]});var i=this&&this.__exportStar||function(e,t){for(var n in e)if(n!=="default"&&!Object.prototype.hasOwnProperty.call(t,n))s(t,e,n)};Object.defineProperty(t,"__esModule",{value:true});i(n(3497),t);i(n(1848),t);i(n(7962),t);i(n(3102),t);i(n(6976),t);i(n(3252),t);i(n(9219),t);i(n(546),t);i(n(575),t);i(n(9497),t);i(n(5737),t);i(n(570),t);i(n(1043),t);i(n(9017),t);i(n(7575),t);i(n(596),t);i(n(9324),t)},575:function(e,t,n){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});t.parseKVStringAndFile=t.parseKVYAML=t.parseKVJSON=t.parseKVFile=t.parseKVString=void 0;const i=s(n(4083));const r=n(7147);const o=n(6976);function parseKVString(e){e=(e||"").trim();if(!e){return{}}const t={};const n=e.split(/(?<!\\)[,\n]/gi);for(let e=0;e<n.length;e++){const s=(n[e]||"").trim();if(!s){continue}const i=s.indexOf("=");if(!i||i===-1){throw new SyntaxError(`Failed to parse KEY=VALUE pair "${s}": missing "="`)}const r=s.slice(0,i).trim().replace(/\\([,\n])/gi,"$1");const o=s.slice(i+1).trim().replace(/\\([,\n])/gi,"$1");if(!r||!o){throw new SyntaxError(`Failed to parse KEY=VALUE pair "${s}": no value`)}t[r]=o}return t}t.parseKVString=parseKVString;function parseKVFile(e){try{const t=(0,r.readFileSync)(e,"utf-8");if(t&&t.trim()&&t.trim()[0]==="{"){return parseKVJSON(t)}return parseKVYAML(t)}catch(t){const n=(0,o.errorMessage)(t);throw new Error(`Failed to read file '${e}': ${n}`)}}t.parseKVFile=parseKVFile;function parseKVJSON(e){e=(e||"").trim();if(!e){return{}}try{const t=JSON.parse(e);const n={};for(const[e,s]of Object.entries(t)){if(typeof e!=="string"){throw new SyntaxError(`Failed to parse key "${e}", expected string, got ${typeof e}`)}if(e.trim()===""){throw new SyntaxError(`Failed to parse key "${e}", expected at least one character`)}if(typeof s!=="string"){const t=JSON.stringify(s);throw new SyntaxError(`Failed to parse value "${t}" for "${e}", expected string, got ${typeof s}`)}if(s.trim()===""){throw new SyntaxError(`Value for key "${e}" cannot be empty (got "${s}")`)}n[e]=s}return n}catch(e){const t=(0,o.errorMessage)(e);throw new Error(`Failed to parse KV pairs as JSON: ${t}`)}}t.parseKVJSON=parseKVJSON;function parseKVYAML(e){if(!e||e.trim().length===0){return{}}const t=i.default.parse(e);const n={};for(const[e,s]of Object.entries(t)){if(typeof e!=="string"||typeof s!=="string"){throw new SyntaxError(`env_vars_file must contain only KEY: VALUE strings. Error parsing key ${e} of type ${typeof e} with value ${s} of type ${typeof s}`)}n[e.trim()]=s.trim()}return n}t.parseKVYAML=parseKVYAML;function parseKVStringAndFile(e,t){e=(e||"").trim();t=(t||"").trim();let n={};if(t){const e=parseKVFile(t);n=Object.assign(Object.assign({},n),e)}if(e){const t=parseKVString(e);n=Object.assign(Object.assign({},n),t)}return n}t.parseKVStringAndFile=parseKVStringAndFile},9497:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.inParallel=void 0;const i=n(2037);function inParallel(e,t,n){return s(this,void 0,void 0,(function*(){const r=Math.min((n===null||n===void 0?void 0:n.concurrency)||(0,i.cpus)().length-1);if(r<1){throw new Error(`concurrency must be at least 1`)}const o=t.map(((e,t)=>({args:e,idx:t})));const a=new Array(t.length);const c=new Array(r).fill(Promise.resolve());const sub=t=>s(this,void 0,void 0,(function*(){const n=o.pop();if(n===undefined){return t}yield t;const s=e.apply(e,n.args);s.then((e=>{a[n.idx]=e}));return sub(s)}));yield Promise.all(c.map(sub));return a}))}t.inParallel=inParallel},5737:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.toPlatformPath=t.toWin32Path=t.toPosixPath=void 0;const s=n(1017);function toPosixPath(e){return e.replace(/[\\]/g,"/")}t.toPosixPath=toPosixPath;function toWin32Path(e){return e.replace(/[/]/g,"\\")}t.toWin32Path=toWin32Path;function toPlatformPath(e){return e.replace(/[/\\]/g,s.sep)}t.toPlatformPath=toPlatformPath},570:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.randomFilepath=t.randomFilename=void 0;const s=n(1017);const i=n(6113);const r=n(2037);function randomFilename(e=12){return(0,i.randomBytes)(e).toString("hex")}t.randomFilename=randomFilename;function randomFilepath(e=(0,r.tmpdir)(),t=12){return(0,s.join)(e,randomFilename(t))}t.randomFilepath=randomFilepath;t["default"]={randomFilename:randomFilename,randomFilepath:randomFilepath}},1043:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.withRetries=void 0;const i=n(6976);const r=n(7575);const o=100;function withRetries(e,t){var n;const a=t.retries;const c=typeof(t===null||t===void 0?void 0:t.backoffLimit)!=="undefined"?Math.max(t.backoffLimit,0):undefined;let l=(n=t.backoff)!==null&&n!==void 0?n:o;if(typeof c!=="undefined"){l=Math.min(l,c)}return function(){return s(this,void 0,void 0,(function*(){let n=a+1;let s=l;const o=c;let f=0;let u="unknown";do{try{return yield e()}catch(e){u=(0,i.errorMessage)(e);--n;if(n>0){yield(0,r.sleep)(s);let e=f+s;if(typeof o!=="undefined"){e=Math.min(e,Number(o))}f=s;s=e}}}while(n>0);const d=t.retries+1;const h=d===1?`1 attempt`:`${d} attempts`;throw new Error(`retry function failed after ${h}: ${u}`)}))}}t.withRetries=withRetries},9017:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.clearEnv=t.clearInputs=t.setInputs=t.setInput=void 0;function setInput(e,t){const n=`INPUT_${e.replace(/ /g,"_").toUpperCase()}`;process.env[n]=t}t.setInput=setInput;function setInputs(e){Object.entries(e).forEach((([e,t])=>setInput(e,t)))}t.setInputs=setInputs;function clearInputs(){clearEnv((e=>e.startsWith(`INPUT_`)))}t.clearInputs=clearInputs;function clearEnv(e){Object.keys(process.env).forEach((t=>{if(e(t,process.env[t])){delete process.env[t]}}))}t.clearEnv=clearEnv},7575:function(e,t){var n=this&&this.__awaiter||function(e,t,n,s){function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,i){function fulfilled(e){try{step(s.next(e))}catch(e){i(e)}}function rejected(e){try{step(s["throw"](e))}catch(e){i(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:true});t.sleep=t.parseDuration=void 0;function parseDuration(e){e=(e||"").trim();if(!e){return 0}let t=0;let n="";for(let s=0;s<e.length;s++){const i=e[s];switch(i){case" ":continue;case",":continue;case"s":{t+=+n;n="";break}case"m":{t+=+n*60;n="";break}case"h":{t+=+n*60*60;n="";break}case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":n+=i;break;default:throw new SyntaxError(`Unsupported character "${i}" at position ${s}`)}}if(n){t+=+n}return t}t.parseDuration=parseDuration;function sleep(e=0){return n(this,void 0,void 0,(function*(){return new Promise((t=>setTimeout(t,e)))}))}t.sleep=sleep},596:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.allOf=t.exactlyOneOf=t.presence=void 0;function presence(e){return(e||"").trim()||undefined}t.presence=presence;function exactlyOneOf(...e){e=e||[];let t=false;for(let n=0;n<e.length;n++){if(e[n]){if(t){return false}else{t=true}}}if(!t){return false}return true}t.exactlyOneOf=exactlyOneOf;function allOf(...e){e=e||[];for(let t=0;t<e.length;t++){if(!e[t])return false}return true}t.allOf=allOf},9324:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.pinnedToHeadWarning=t.isPinnedToHead=void 0;function isPinnedToHead(){const e=process.env.GITHUB_ACTION_REF;return e==="master"||e==="main"}t.isPinnedToHead=isPinnedToHead;function pinnedToHeadWarning(e){const t=process.env.GITHUB_ACTION_REF;const n=process.env.GITHUB_ACTION_REPOSITORY;return`${n} is pinned at "${t}". We strongly advise against `+`pinning to "@${t}" as it may be unstable. Please update your `+`GitHub Action YAML from:\n`+`\n`+`    uses: '${n}@${t}'\n`+`\n`+`to:\n`+`\n`+`    uses: '${n}@${e}'\n`+`\n`+`Alternatively, you can pin to any git tag or git SHA in the repository.`}t.pinnedToHeadWarning=pinnedToHeadWarning},6113:e=>{e.exports=__nccwpck_require__(6113)},7147:e=>{e.exports=__nccwpck_require__(7147)},2037:e=>{e.exports=__nccwpck_require__(2037)},1017:e=>{e.exports=__nccwpck_require__(1017)},4655:e=>{e.exports=__nccwpck_require__(4655)},8109:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(2986);var o=n(2289);var a=n(45);function composeCollection(e,t,n,c,l){let f;switch(n.type){case"block-map":{f=r.resolveBlockMap(e,t,n,l);break}case"block-seq":{f=o.resolveBlockSeq(e,t,n,l);break}case"flow-collection":{f=a.resolveFlowCollection(e,t,n,l);break}}if(!c)return f;const u=t.directives.tagName(c.source,(e=>l(c,"TAG_RESOLVE_FAILED",e)));if(!u)return f;const d=f.constructor;if(u==="!"||u===d.tagName){f.tag=d.tagName;return f}const h=s.isMap(f)?"map":"seq";let p=t.schema.tags.find((e=>e.collection===h&&e.tag===u));if(!p){const e=t.schema.knownTags[u];if(e&&e.collection===h){t.schema.tags.push(Object.assign({},e,{default:false}));p=e}else{l(c,"TAG_RESOLVE_FAILED",`Unresolved tag: ${u}`,true);f.tag=u;return f}}const m=p.resolve(f,(e=>l(c,"TAG_RESOLVE_FAILED",e)),t.options);const y=s.isNode(m)?m:new i.Scalar(m);y.range=f.range;y.tag=u;if(p?.format)y.format=p.format;return y}t.composeCollection=composeCollection},5050:(e,t,n)=>{var s=n(42);var i=n(8676);var r=n(1250);var o=n(6985);function composeDoc(e,t,{offset:n,start:a,value:c,end:l},f){const u=Object.assign({_directives:t},e);const d=new s.Document(undefined,u);const h={atRoot:true,directives:d.directives,options:d.options,schema:d.schema};const p=o.resolveProps(a,{indicator:"doc-start",next:c??l?.[0],offset:n,onError:f,startOnNewline:true});if(p.found){d.directives.docStart=true;if(c&&(c.type==="block-map"||c.type==="block-seq")&&!p.hasNewline)f(p.end,"MISSING_CHAR","Block collection cannot start on same line with directives-end marker")}d.contents=c?i.composeNode(h,c,p,f):i.composeEmptyNode(h,p.end,a,null,p,f);const m=d.contents.range[2];const y=r.resolveEnd(l,m,false,f);if(y.comment)d.comment=y.comment;d.range=[n,m,y.offset];return d}t.composeDoc=composeDoc},8676:(e,t,n)=>{var s=n(5639);var i=n(8109);var r=n(4766);var o=n(1250);var a=n(8781);const c={composeNode:composeNode,composeEmptyNode:composeEmptyNode};function composeNode(e,t,n,s){const{spaceBefore:o,comment:a,anchor:l,tag:f}=n;let u;let d=true;switch(t.type){case"alias":u=composeAlias(e,t,s);if(l||f)s(t,"ALIAS_PROPS","An alias node must not specify any properties");break;case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"block-scalar":u=r.composeScalar(e,t,f,s);if(l)u.anchor=l.source.substring(1);break;case"block-map":case"block-seq":case"flow-collection":u=i.composeCollection(c,e,t,f,s);if(l)u.anchor=l.source.substring(1);break;default:{const i=t.type==="error"?t.message:`Unsupported token (type: ${t.type})`;s(t,"UNEXPECTED_TOKEN",i);u=composeEmptyNode(e,t.offset,undefined,null,n,s);d=false}}if(l&&u.anchor==="")s(l,"BAD_ALIAS","Anchor cannot be an empty string");if(o)u.spaceBefore=true;if(a){if(t.type==="scalar"&&t.source==="")u.comment=a;else u.commentBefore=a}if(e.options.keepSourceTokens&&d)u.srcToken=t;return u}function composeEmptyNode(e,t,n,s,{spaceBefore:i,comment:o,anchor:c,tag:l,end:f},u){const d={type:"scalar",offset:a.emptyScalarPosition(t,n,s),indent:-1,source:""};const h=r.composeScalar(e,d,l,u);if(c){h.anchor=c.source.substring(1);if(h.anchor==="")u(c,"BAD_ALIAS","Anchor cannot be an empty string")}if(i)h.spaceBefore=true;if(o){h.comment=o;h.range[2]=f}return h}function composeAlias({options:e},{offset:t,source:n,end:i},r){const a=new s.Alias(n.substring(1));if(a.source==="")r(t,"BAD_ALIAS","Alias cannot be an empty string");if(a.source.endsWith(":"))r(t+n.length-1,"BAD_ALIAS","Alias ending in : is ambiguous",true);const c=t+n.length;const l=o.resolveEnd(i,c,e.strict,r);a.range=[t,c,l.offset];if(l.comment)a.comment=l.comment;return a}t.composeEmptyNode=composeEmptyNode;t.composeNode=composeNode},4766:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(9485);var o=n(7578);function composeScalar(e,t,n,a){const{value:c,type:l,comment:f,range:u}=t.type==="block-scalar"?r.resolveBlockScalar(t,e.options.strict,a):o.resolveFlowScalar(t,e.options.strict,a);const d=n?e.directives.tagName(n.source,(e=>a(n,"TAG_RESOLVE_FAILED",e))):null;const h=n&&d?findScalarTagByName(e.schema,c,d,n,a):t.type==="scalar"?findScalarTagByTest(e,c,t,a):e.schema[s.SCALAR];let p;try{const r=h.resolve(c,(e=>a(n??t,"TAG_RESOLVE_FAILED",e)),e.options);p=s.isScalar(r)?r:new i.Scalar(r)}catch(e){const s=e instanceof Error?e.message:String(e);a(n??t,"TAG_RESOLVE_FAILED",s);p=new i.Scalar(c)}p.range=u;p.source=c;if(l)p.type=l;if(d)p.tag=d;if(h.format)p.format=h.format;if(f)p.comment=f;return p}function findScalarTagByName(e,t,n,i,r){if(n==="!")return e[s.SCALAR];const o=[];for(const t of e.tags){if(!t.collection&&t.tag===n){if(t.default&&t.test)o.push(t);else return t}}for(const e of o)if(e.test?.test(t))return e;const a=e.knownTags[n];if(a&&!a.collection){e.tags.push(Object.assign({},a,{default:false,test:undefined}));return a}r(i,"TAG_RESOLVE_FAILED",`Unresolved tag: ${n}`,n!=="tag:yaml.org,2002:str");return e[s.SCALAR]}function findScalarTagByTest({directives:e,schema:t},n,i,r){const o=t.tags.find((e=>e.default&&e.test?.test(n)))||t[s.SCALAR];if(t.compat){const a=t.compat.find((e=>e.default&&e.test?.test(n)))??t[s.SCALAR];if(o.tag!==a.tag){const t=e.tagString(o.tag);const n=e.tagString(a.tag);const s=`Value may be parsed as either ${t} or ${n}`;r(i,"TAG_RESOLVE_FAILED",s,true)}}return o}t.composeScalar=composeScalar},9493:(e,t,n)=>{var s=n(5400);var i=n(42);var r=n(4236);var o=n(1399);var a=n(5050);var c=n(1250);function getErrorPos(e){if(typeof e==="number")return[e,e+1];if(Array.isArray(e))return e.length===2?e:[e[0],e[1]];const{offset:t,source:n}=e;return[t,t+(typeof n==="string"?n.length:1)]}function parsePrelude(e){let t="";let n=false;let s=false;for(let i=0;i<e.length;++i){const r=e[i];switch(r[0]){case"#":t+=(t===""?"":s?"\n\n":"\n")+(r.substring(1)||" ");n=true;s=false;break;case"%":if(e[i+1]?.[0]!=="#")i+=1;n=false;break;default:if(!n)s=true;n=false}}return{comment:t,afterEmptyLine:s}}class Composer{constructor(e={}){this.doc=null;this.atDirectives=false;this.prelude=[];this.errors=[];this.warnings=[];this.onError=(e,t,n,s)=>{const i=getErrorPos(e);if(s)this.warnings.push(new r.YAMLWarning(i,t,n));else this.errors.push(new r.YAMLParseError(i,t,n))};this.directives=new s.Directives({version:e.version||"1.2"});this.options=e}decorate(e,t){const{comment:n,afterEmptyLine:s}=parsePrelude(this.prelude);if(n){const i=e.contents;if(t){e.comment=e.comment?`${e.comment}\n${n}`:n}else if(s||e.directives.docStart||!i){e.commentBefore=n}else if(o.isCollection(i)&&!i.flow&&i.items.length>0){let e=i.items[0];if(o.isPair(e))e=e.key;const t=e.commentBefore;e.commentBefore=t?`${n}\n${t}`:n}else{const e=i.commentBefore;i.commentBefore=e?`${n}\n${e}`:n}}if(t){Array.prototype.push.apply(e.errors,this.errors);Array.prototype.push.apply(e.warnings,this.warnings)}else{e.errors=this.errors;e.warnings=this.warnings}this.prelude=[];this.errors=[];this.warnings=[]}streamInfo(){return{comment:parsePrelude(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=false,n=-1){for(const t of e)yield*this.next(t);yield*this.end(t,n)}*next(e){if(process.env.LOG_STREAM)console.dir(e,{depth:null});switch(e.type){case"directive":this.directives.add(e.source,((t,n,s)=>{const i=getErrorPos(e);i[0]+=t;this.onError(i,"BAD_DIRECTIVE",n,s)}));this.prelude.push(e.source);this.atDirectives=true;break;case"document":{const t=a.composeDoc(this.options,this.directives,e,this.onError);if(this.atDirectives&&!t.directives.docStart)this.onError(e,"MISSING_CHAR","Missing directives-end/doc-start indicator line");this.decorate(t,false);if(this.doc)yield this.doc;this.doc=t;this.atDirectives=false;break}case"byte-order-mark":case"space":break;case"comment":case"newline":this.prelude.push(e.source);break;case"error":{const t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message;const n=new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",t);if(this.atDirectives||!this.doc)this.errors.push(n);else this.doc.errors.push(n);break}case"doc-end":{if(!this.doc){const t="Unexpected doc-end without preceding document";this.errors.push(new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",t));break}this.doc.directives.docEnd=true;const t=c.resolveEnd(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);this.decorate(this.doc,true);if(t.comment){const e=this.doc.comment;this.doc.comment=e?`${e}\n${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new r.YAMLParseError(getErrorPos(e),"UNEXPECTED_TOKEN",`Unsupported token ${e.type}`))}}*end(e=false,t=-1){if(this.doc){this.decorate(this.doc,true);yield this.doc;this.doc=null}else if(e){const e=Object.assign({_directives:this.directives},this.options);const n=new i.Document(undefined,e);if(this.atDirectives)this.onError(t,"MISSING_CHAR","Missing directives-end indicator line");n.range=[0,t,t];this.decorate(n,false);yield n}}}t.Composer=Composer},2986:(e,t,n)=>{var s=n(246);var i=n(6011);var r=n(6985);var o=n(976);var a=n(3669);var c=n(6899);const l="All mapping items must start at the same column";function resolveBlockMap({composeNode:e,composeEmptyNode:t},n,f,u){const d=new i.YAMLMap(n.schema);if(n.atRoot)n.atRoot=false;let h=f.offset;let p=null;for(const i of f.items){const{start:m,key:y,sep:g,value:v}=i;const b=r.resolveProps(m,{indicator:"explicit-key-ind",next:y??g?.[0],offset:h,onError:u,startOnNewline:true});const S=!b.found;if(S){if(y){if(y.type==="block-seq")u(h,"BLOCK_AS_IMPLICIT_KEY","A block sequence may not be used as an implicit map key");else if("indent"in y&&y.indent!==f.indent)u(h,"BAD_INDENT",l)}if(!b.anchor&&!b.tag&&!g){p=b.end;if(b.comment){if(d.comment)d.comment+="\n"+b.comment;else d.comment=b.comment}continue}if(b.hasNewlineAfterProp||o.containsNewline(y)){u(y??m[m.length-1],"MULTILINE_IMPLICIT_KEY","Implicit keys need to be on a single line")}}else if(b.found?.indent!==f.indent){u(h,"BAD_INDENT",l)}const w=b.end;const k=y?e(n,y,b,u):t(n,w,m,null,b,u);if(n.schema.compat)a.flowIndentCheck(f.indent,y,u);if(c.mapIncludes(n,d.items,k))u(w,"DUPLICATE_KEY","Map keys must be unique");const E=r.resolveProps(g??[],{indicator:"map-value-ind",next:v,offset:k.range[2],onError:u,startOnNewline:!y||y.type==="block-scalar"});h=E.end;if(E.found){if(S){if(v?.type==="block-map"&&!E.hasNewline)u(h,"BLOCK_AS_IMPLICIT_KEY","Nested mappings are not allowed in compact mappings");if(n.options.strict&&b.start<E.found.offset-1024)u(k.range,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit block mapping key")}const r=v?e(n,v,E,u):t(n,h,g,null,E,u);if(n.schema.compat)a.flowIndentCheck(f.indent,v,u);h=r.range[2];const o=new s.Pair(k,r);if(n.options.keepSourceTokens)o.srcToken=i;d.items.push(o)}else{if(S)u(k.range,"MISSING_CHAR","Implicit map keys need to be followed by map values");if(E.comment){if(k.comment)k.comment+="\n"+E.comment;else k.comment=E.comment}const e=new s.Pair(k);if(n.options.keepSourceTokens)e.srcToken=i;d.items.push(e)}}if(p&&p<h)u(p,"IMPOSSIBLE","Map comment with trailing content");d.range=[f.offset,h,p??h];return d}t.resolveBlockMap=resolveBlockMap},9485:(e,t,n)=>{var s=n(9338);function resolveBlockScalar(e,t,n){const i=e.offset;const r=parseBlockScalarHeader(e,t,n);if(!r)return{value:"",type:null,comment:"",range:[i,i,i]};const o=r.mode===">"?s.Scalar.BLOCK_FOLDED:s.Scalar.BLOCK_LITERAL;const a=e.source?splitLines(e.source):[];let c=a.length;for(let e=a.length-1;e>=0;--e){const t=a[e][1];if(t===""||t==="\r")c=e;else break}if(c===0){const t=r.chomp==="+"&&a.length>0?"\n".repeat(Math.max(1,a.length-1)):"";let n=i+r.length;if(e.source)n+=e.source.length;return{value:t,type:o,comment:r.comment,range:[i,n,n]}}let l=e.indent+r.indent;let f=e.offset+r.length;let u=0;for(let e=0;e<c;++e){const[t,s]=a[e];if(s===""||s==="\r"){if(r.indent===0&&t.length>l)l=t.length}else{if(t.length<l){const e="Block scalars with more-indented leading empty lines must use an explicit indentation indicator";n(f+t.length,"MISSING_CHAR",e)}if(r.indent===0)l=t.length;u=e;break}f+=t.length+s.length+1}for(let e=a.length-1;e>=c;--e){if(a[e][0].length>l)c=e+1}let d="";let h="";let p=false;for(let e=0;e<u;++e)d+=a[e][0].slice(l)+"\n";for(let e=u;e<c;++e){let[t,i]=a[e];f+=t.length+i.length+1;const c=i[i.length-1]==="\r";if(c)i=i.slice(0,-1);if(i&&t.length<l){const e=r.indent?"explicit indentation indicator":"first line";const s=`Block scalar lines must not be less indented than their ${e}`;n(f-i.length-(c?2:1),"BAD_INDENT",s);t=""}if(o===s.Scalar.BLOCK_LITERAL){d+=h+t.slice(l)+i;h="\n"}else if(t.length>l||i[0]==="\t"){if(h===" ")h="\n";else if(!p&&h==="\n")h="\n\n";d+=h+t.slice(l)+i;h="\n";p=true}else if(i===""){if(h==="\n")d+="\n";else h="\n"}else{d+=h+i;h=" ";p=false}}switch(r.chomp){case"-":break;case"+":for(let e=c;e<a.length;++e)d+="\n"+a[e][0].slice(l);if(d[d.length-1]!=="\n")d+="\n";break;default:d+="\n"}const m=i+r.length+e.source.length;return{value:d,type:o,comment:r.comment,range:[i,m,m]}}function parseBlockScalarHeader({offset:e,props:t},n,s){if(t[0].type!=="block-scalar-header"){s(t[0],"IMPOSSIBLE","Block scalar header not found");return null}const{source:i}=t[0];const r=i[0];let o=0;let a="";let c=-1;for(let t=1;t<i.length;++t){const n=i[t];if(!a&&(n==="-"||n==="+"))a=n;else{const s=Number(n);if(!o&&s)o=s;else if(c===-1)c=e+t}}if(c!==-1)s(c,"UNEXPECTED_TOKEN",`Block scalar header includes extra characters: ${i}`);let l=false;let f="";let u=i.length;for(let e=1;e<t.length;++e){const i=t[e];switch(i.type){case"space":l=true;case"newline":u+=i.source.length;break;case"comment":if(n&&!l){const e="Comments must be separated from other tokens by white space characters";s(i,"MISSING_CHAR",e)}u+=i.source.length;f=i.source.substring(1);break;case"error":s(i,"UNEXPECTED_TOKEN",i.message);u+=i.source.length;break;default:{const e=`Unexpected token in block scalar header: ${i.type}`;s(i,"UNEXPECTED_TOKEN",e);const t=i.source;if(t&&typeof t==="string")u+=t.length}}}return{mode:r,indent:o,chomp:a,comment:f,length:u}}function splitLines(e){const t=e.split(/\n( *)/);const n=t[0];const s=n.match(/^( *)/);const i=s?.[1]?[s[1],n.slice(s[1].length)]:["",n];const r=[i];for(let e=1;e<t.length;e+=2)r.push([t[e],t[e+1]]);return r}t.resolveBlockScalar=resolveBlockScalar},2289:(e,t,n)=>{var s=n(5161);var i=n(6985);var r=n(3669);function resolveBlockSeq({composeNode:e,composeEmptyNode:t},n,o,a){const c=new s.YAMLSeq(n.schema);if(n.atRoot)n.atRoot=false;let l=o.offset;let f=null;for(const{start:s,value:u}of o.items){const d=i.resolveProps(s,{indicator:"seq-item-ind",next:u,offset:l,onError:a,startOnNewline:true});if(!d.found){if(d.anchor||d.tag||u){if(u&&u.type==="block-seq")a(d.end,"BAD_INDENT","All sequence items must start at the same column");else a(l,"MISSING_CHAR","Sequence item without - indicator")}else{f=d.end;if(d.comment)c.comment=d.comment;continue}}const h=u?e(n,u,d,a):t(n,d.end,s,null,d,a);if(n.schema.compat)r.flowIndentCheck(o.indent,u,a);l=h.range[2];c.items.push(h)}c.range=[o.offset,l,f??l];return c}t.resolveBlockSeq=resolveBlockSeq},1250:(e,t)=>{function resolveEnd(e,t,n,s){let i="";if(e){let r=false;let o="";for(const a of e){const{source:e,type:c}=a;switch(c){case"space":r=true;break;case"comment":{if(n&&!r)s(a,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");const t=e.substring(1)||" ";if(!i)i=t;else i+=o+t;o="";break}case"newline":if(i)o+=e;r=true;break;default:s(a,"UNEXPECTED_TOKEN",`Unexpected ${c} at node end`)}t+=e.length}}return{comment:i,offset:t}}t.resolveEnd=resolveEnd},45:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);var o=n(5161);var a=n(1250);var c=n(6985);var l=n(976);var f=n(6899);const u="Block collections are not allowed within flow collections";const isBlock=e=>e&&(e.type==="block-map"||e.type==="block-seq");function resolveFlowCollection({composeNode:e,composeEmptyNode:t},n,d,h){const p=d.start.source==="{";const m=p?"flow map":"flow sequence";const y=p?new r.YAMLMap(n.schema):new o.YAMLSeq(n.schema);y.flow=true;const g=n.atRoot;if(g)n.atRoot=false;let v=d.offset+d.start.source.length;for(let o=0;o<d.items.length;++o){const a=d.items[o];const{start:g,key:b,sep:S,value:w}=a;const k=c.resolveProps(g,{flow:m,indicator:"explicit-key-ind",next:b??S?.[0],offset:v,onError:h,startOnNewline:false});if(!k.found){if(!k.anchor&&!k.tag&&!S&&!w){if(o===0&&k.comma)h(k.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${m}`);else if(o<d.items.length-1)h(k.start,"UNEXPECTED_TOKEN",`Unexpected empty item in ${m}`);if(k.comment){if(y.comment)y.comment+="\n"+k.comment;else y.comment=k.comment}v=k.end;continue}if(!p&&n.options.strict&&l.containsNewline(b))h(b,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line")}if(o===0){if(k.comma)h(k.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${m}`)}else{if(!k.comma)h(k.start,"MISSING_CHAR",`Missing , between ${m} items`);if(k.comment){let e="";e:for(const t of g){switch(t.type){case"comma":case"space":break;case"comment":e=t.source.substring(1);break e;default:break e}}if(e){let t=y.items[y.items.length-1];if(s.isPair(t))t=t.value??t.key;if(t.comment)t.comment+="\n"+e;else t.comment=e;k.comment=k.comment.substring(e.length+1)}}}if(!p&&!S&&!k.found){const s=w?e(n,w,k,h):t(n,k.end,S,null,k,h);y.items.push(s);v=s.range[2];if(isBlock(w))h(s.range,"BLOCK_IN_FLOW",u)}else{const s=k.end;const o=b?e(n,b,k,h):t(n,s,g,null,k,h);if(isBlock(b))h(o.range,"BLOCK_IN_FLOW",u);const l=c.resolveProps(S??[],{flow:m,indicator:"map-value-ind",next:w,offset:o.range[2],onError:h,startOnNewline:false});if(l.found){if(!p&&!k.found&&n.options.strict){if(S)for(const e of S){if(e===l.found)break;if(e.type==="newline"){h(e,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line");break}}if(k.start<l.found.offset-1024)h(l.found,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")}}else if(w){if("source"in w&&w.source&&w.source[0]===":")h(w,"MISSING_CHAR",`Missing space after : in ${m}`);else h(l.start,"MISSING_CHAR",`Missing , or : between ${m} items`)}const d=w?e(n,w,l,h):l.found?t(n,l.end,S,null,l,h):null;if(d){if(isBlock(w))h(d.range,"BLOCK_IN_FLOW",u)}else if(l.comment){if(o.comment)o.comment+="\n"+l.comment;else o.comment=l.comment}const E=new i.Pair(o,d);if(n.options.keepSourceTokens)E.srcToken=a;if(p){const e=y;if(f.mapIncludes(n,e.items,o))h(s,"DUPLICATE_KEY","Map keys must be unique");e.items.push(E)}else{const e=new r.YAMLMap(n.schema);e.flow=true;e.items.push(E);y.items.push(e)}v=d?d.range[2]:l.end}}const b=p?"}":"]";const[S,...w]=d.end;let k=v;if(S&&S.source===b)k=S.offset+S.source.length;else{const e=m[0].toUpperCase()+m.substring(1);const t=g?`${e} must end with a ${b}`:`${e} in block collection must be sufficiently indented and end with a ${b}`;h(v,g?"MISSING_CHAR":"BAD_INDENT",t);if(S&&S.source.length!==1)w.unshift(S)}if(w.length>0){const e=a.resolveEnd(w,k,n.options.strict,h);if(e.comment){if(y.comment)y.comment+="\n"+e.comment;else y.comment=e.comment}y.range=[d.offset,k,e.offset]}else{y.range=[d.offset,k,k]}return y}t.resolveFlowCollection=resolveFlowCollection},7578:(e,t,n)=>{var s=n(9338);var i=n(1250);function resolveFlowScalar(e,t,n){const{offset:r,type:o,source:a,end:c}=e;let l;let f;const _onError=(e,t,s)=>n(r+e,t,s);switch(o){case"scalar":l=s.Scalar.PLAIN;f=plainValue(a,_onError);break;case"single-quoted-scalar":l=s.Scalar.QUOTE_SINGLE;f=singleQuotedValue(a,_onError);break;case"double-quoted-scalar":l=s.Scalar.QUOTE_DOUBLE;f=doubleQuotedValue(a,_onError);break;default:n(e,"UNEXPECTED_TOKEN",`Expected a flow scalar value, but found: ${o}`);return{value:"",type:null,comment:"",range:[r,r+a.length,r+a.length]}}const u=r+a.length;const d=i.resolveEnd(c,u,t,n);return{value:f,type:l,comment:d.comment,range:[r,u,d.offset]}}function plainValue(e,t){let n="";switch(e[0]){case"\t":n="a tab character";break;case",":n="flow indicator character ,";break;case"%":n="directive indicator character %";break;case"|":case">":{n=`block scalar indicator ${e[0]}`;break}case"@":case"`":{n=`reserved character ${e[0]}`;break}}if(n)t(0,"BAD_SCALAR_START",`Plain value cannot start with ${n}`);return foldLines(e)}function singleQuotedValue(e,t){if(e[e.length-1]!=="'"||e.length===1)t(e.length,"MISSING_CHAR","Missing closing 'quote");return foldLines(e.slice(1,-1)).replace(/''/g,"'")}function foldLines(e){let t,n;try{t=new RegExp("(.*?)(?<![ \t])[ \t]*\r?\n","sy");n=new RegExp("[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n","sy")}catch(e){t=/(.*?)[ \t]*\r?\n/ys;n=/[ \t]*(.*?)[ \t]*\r?\n/ys}let s=t.exec(e);if(!s)return e;let i=s[1];let r=" ";let o=t.lastIndex;n.lastIndex=o;while(s=n.exec(e)){if(s[1]===""){if(r==="\n")i+=r;else r="\n"}else{i+=r+s[1];r=" "}o=n.lastIndex}const a=/[ \t]*(.*)/ys;a.lastIndex=o;s=a.exec(e);return i+r+(s?.[1]??"")}function doubleQuotedValue(e,t){let n="";for(let s=1;s<e.length-1;++s){const i=e[s];if(i==="\r"&&e[s+1]==="\n")continue;if(i==="\n"){const{fold:t,offset:i}=foldNewline(e,s);n+=t;s=i}else if(i==="\\"){let i=e[++s];const o=r[i];if(o)n+=o;else if(i==="\n"){i=e[s+1];while(i===" "||i==="\t")i=e[++s+1]}else if(i==="\r"&&e[s+1]==="\n"){i=e[++s+1];while(i===" "||i==="\t")i=e[++s+1]}else if(i==="x"||i==="u"||i==="U"){const r={x:2,u:4,U:8}[i];n+=parseCharCode(e,s+1,r,t);s+=r}else{const i=e.substr(s-1,2);t(s-1,"BAD_DQ_ESCAPE",`Invalid escape sequence ${i}`);n+=i}}else if(i===" "||i==="\t"){const t=s;let r=e[s+1];while(r===" "||r==="\t")r=e[++s+1];if(r!=="\n"&&!(r==="\r"&&e[s+2]==="\n"))n+=s>t?e.slice(t,s+1):i}else{n+=i}}if(e[e.length-1]!=='"'||e.length===1)t(e.length,"MISSING_CHAR",'Missing closing "quote');return n}function foldNewline(e,t){let n="";let s=e[t+1];while(s===" "||s==="\t"||s==="\n"||s==="\r"){if(s==="\r"&&e[t+2]!=="\n")break;if(s==="\n")n+="\n";t+=1;s=e[t+1]}if(!n)n=" ";return{fold:n,offset:t}}const r={0:"\0",a:"",b:"\b",e:"",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v",N:"",_:" ",L:"\u2028",P:"\u2029"," ":" ",'"':'"',"/":"/","\\":"\\","\t":"\t"};function parseCharCode(e,t,n,s){const i=e.substr(t,n);const r=i.length===n&&/^[0-9a-fA-F]+$/.test(i);const o=r?parseInt(i,16):NaN;if(isNaN(o)){const i=e.substr(t-2,n+2);s(t-2,"BAD_DQ_ESCAPE",`Invalid escape sequence ${i}`);return i}return String.fromCodePoint(o)}t.resolveFlowScalar=resolveFlowScalar},6985:(e,t)=>{function resolveProps(e,{flow:t,indicator:n,next:s,offset:i,onError:r,startOnNewline:o}){let a=false;let c=o;let l=o;let f="";let u="";let d=false;let h=false;let p=false;let m=null;let y=null;let g=null;let v=null;let b=null;for(const s of e){if(p){if(s.type!=="space"&&s.type!=="newline"&&s.type!=="comma")r(s.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space");p=false}switch(s.type){case"space":if(!t&&c&&n!=="doc-start"&&s.source[0]==="\t")r(s,"TAB_AS_INDENT","Tabs are not allowed as indentation");l=true;break;case"comment":{if(!l)r(s,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");const e=s.source.substring(1)||" ";if(!f)f=e;else f+=u+e;u="";c=false;break}case"newline":if(c){if(f)f+=s.source;else a=true}else u+=s.source;c=true;d=true;if(m||y)h=true;l=true;break;case"anchor":if(m)r(s,"MULTIPLE_ANCHORS","A node can have at most one anchor");if(s.source.endsWith(":"))r(s.offset+s.source.length-1,"BAD_ALIAS","Anchor ending in : is ambiguous",true);m=s;if(b===null)b=s.offset;c=false;l=false;p=true;break;case"tag":{if(y)r(s,"MULTIPLE_TAGS","A node can have at most one tag");y=s;if(b===null)b=s.offset;c=false;l=false;p=true;break}case n:if(m||y)r(s,"BAD_PROP_ORDER",`Anchors and tags must be after the ${s.source} indicator`);if(v)r(s,"UNEXPECTED_TOKEN",`Unexpected ${s.source} in ${t??"collection"}`);v=s;c=false;l=false;break;case"comma":if(t){if(g)r(s,"UNEXPECTED_TOKEN",`Unexpected , in ${t}`);g=s;c=false;l=false;break}default:r(s,"UNEXPECTED_TOKEN",`Unexpected ${s.type} token`);c=false;l=false}}const S=e[e.length-1];const w=S?S.offset+S.source.length:i;if(p&&s&&s.type!=="space"&&s.type!=="newline"&&s.type!=="comma"&&(s.type!=="scalar"||s.source!==""))r(s.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space");return{comma:g,found:v,spaceBefore:a,comment:f,hasNewline:d,hasNewlineAfterProp:h,anchor:m,tag:y,end:w,start:b??w}}t.resolveProps=resolveProps},976:(e,t)=>{function containsNewline(e){if(!e)return null;switch(e.type){case"alias":case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":if(e.source.includes("\n"))return true;if(e.end)for(const t of e.end)if(t.type==="newline")return true;return false;case"flow-collection":for(const t of e.items){for(const e of t.start)if(e.type==="newline")return true;if(t.sep)for(const e of t.sep)if(e.type==="newline")return true;if(containsNewline(t.key)||containsNewline(t.value))return true}return false;default:return true}}t.containsNewline=containsNewline},8781:(e,t)=>{function emptyScalarPosition(e,t,n){if(t){if(n===null)n=t.length;for(let s=n-1;s>=0;--s){let n=t[s];switch(n.type){case"space":case"comment":case"newline":e-=n.source.length;continue}n=t[++s];while(n?.type==="space"){e+=n.source.length;n=t[++s]}break}}return e}t.emptyScalarPosition=emptyScalarPosition},3669:(e,t,n)=>{var s=n(976);function flowIndentCheck(e,t,n){if(t?.type==="flow-collection"){const i=t.end[0];if(i.indent===e&&(i.source==="]"||i.source==="}")&&s.containsNewline(t)){const e="Flow end indicator should be more indented than parent";n(i,"BAD_INDENT",e,true)}}}t.flowIndentCheck=flowIndentCheck},6899:(e,t,n)=>{var s=n(1399);function mapIncludes(e,t,n){const{uniqueKeys:i}=e.options;if(i===false)return false;const r=typeof i==="function"?i:(t,n)=>t===n||s.isScalar(t)&&s.isScalar(n)&&t.value===n.value&&!(t.value==="<<"&&e.schema.merge);return t.some((e=>r(e.key,n)))}t.mapIncludes=mapIncludes},42:(e,t,n)=>{var s=n(5639);var i=n(3466);var r=n(1399);var o=n(246);var a=n(2463);var c=n(6831);var l=n(8409);var f=n(5225);var u=n(8459);var d=n(3412);var h=n(9652);var p=n(5400);class Document{constructor(e,t,n){this.commentBefore=null;this.comment=null;this.errors=[];this.warnings=[];Object.defineProperty(this,r.NODE_TYPE,{value:r.DOC});let s=null;if(typeof t==="function"||Array.isArray(t)){s=t}else if(n===undefined&&t){n=t;t=undefined}const i=Object.assign({intAsBigInt:false,keepSourceTokens:false,logLevel:"warn",prettyErrors:true,strict:true,uniqueKeys:true,version:"1.2"},n);this.options=i;let{version:o}=i;if(n?._directives){this.directives=n._directives.atDocument();if(this.directives.yaml.explicit)o=this.directives.yaml.version}else this.directives=new p.Directives({version:o});this.setSchema(o,n);if(e===undefined)this.contents=null;else{this.contents=this.createNode(e,s,n)}}clone(){const e=Object.create(Document.prototype,{[r.NODE_TYPE]:{value:r.DOC}});e.commentBefore=this.commentBefore;e.comment=this.comment;e.errors=this.errors.slice();e.warnings=this.warnings.slice();e.options=Object.assign({},this.options);if(this.directives)e.directives=this.directives.clone();e.schema=this.schema.clone();e.contents=r.isNode(this.contents)?this.contents.clone(e.schema):this.contents;if(this.range)e.range=this.range.slice();return e}add(e){if(assertCollection(this.contents))this.contents.add(e)}addIn(e,t){if(assertCollection(this.contents))this.contents.addIn(e,t)}createAlias(e,t){if(!e.anchor){const n=u.anchorNames(this);e.anchor=!t||n.has(t)?u.findNewAnchor(t||"a",n):t}return new s.Alias(e.anchor)}createNode(e,t,n){let s=undefined;if(typeof t==="function"){e=t.call({"":e},"",e);s=t}else if(Array.isArray(t)){const keyToStr=e=>typeof e==="number"||e instanceof String||e instanceof Number;const e=t.filter(keyToStr).map(String);if(e.length>0)t=t.concat(e);s=t}else if(n===undefined&&t){n=t;t=undefined}const{aliasDuplicateObjects:i,anchorPrefix:o,flow:a,keepUndefined:c,onTagObj:l,tag:f}=n??{};const{onAnchor:d,setAnchors:p,sourceObjects:m}=u.createNodeAnchors(this,o||"a");const y={aliasDuplicateObjects:i??true,keepUndefined:c??false,onAnchor:d,onTagObj:l,replacer:s,schema:this.schema,sourceObjects:m};const g=h.createNode(e,f,y);if(a&&r.isCollection(g))g.flow=true;p();return g}createPair(e,t,n={}){const s=this.createNode(e,null,n);const i=this.createNode(t,null,n);return new o.Pair(s,i)}delete(e){return assertCollection(this.contents)?this.contents.delete(e):false}deleteIn(e){if(i.isEmptyPath(e)){if(this.contents==null)return false;this.contents=null;return true}return assertCollection(this.contents)?this.contents.deleteIn(e):false}get(e,t){return r.isCollection(this.contents)?this.contents.get(e,t):undefined}getIn(e,t){if(i.isEmptyPath(e))return!t&&r.isScalar(this.contents)?this.contents.value:this.contents;return r.isCollection(this.contents)?this.contents.getIn(e,t):undefined}has(e){return r.isCollection(this.contents)?this.contents.has(e):false}hasIn(e){if(i.isEmptyPath(e))return this.contents!==undefined;return r.isCollection(this.contents)?this.contents.hasIn(e):false}set(e,t){if(this.contents==null){this.contents=i.collectionFromPath(this.schema,[e],t)}else if(assertCollection(this.contents)){this.contents.set(e,t)}}setIn(e,t){if(i.isEmptyPath(e))this.contents=t;else if(this.contents==null){this.contents=i.collectionFromPath(this.schema,Array.from(e),t)}else if(assertCollection(this.contents)){this.contents.setIn(e,t)}}setSchema(e,t={}){if(typeof e==="number")e=String(e);let n;switch(e){case"1.1":if(this.directives)this.directives.yaml.version="1.1";else this.directives=new p.Directives({version:"1.1"});n={merge:true,resolveKnownTags:false,schema:"yaml-1.1"};break;case"1.2":case"next":if(this.directives)this.directives.yaml.version=e;else this.directives=new p.Directives({version:e});n={merge:false,resolveKnownTags:true,schema:"core"};break;case null:if(this.directives)delete this.directives;n=null;break;default:{const t=JSON.stringify(e);throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`)}}if(t.schema instanceof Object)this.schema=t.schema;else if(n)this.schema=new c.Schema(Object.assign(n,t));else throw new Error(`With a null YAML version, the { schema: Schema } option is required`)}toJS({json:e,jsonArg:t,mapAsMap:n,maxAliasCount:s,onAnchor:i,reviver:r}={}){const o={anchors:new Map,doc:this,keep:!e,mapAsMap:n===true,mapKeyWarned:false,maxAliasCount:typeof s==="number"?s:100,stringify:l.stringify};const c=a.toJS(this.contents,t??"",o);if(typeof i==="function")for(const{count:e,res:t}of o.anchors.values())i(t,e);return typeof r==="function"?d.applyReviver(r,{"":c},"",c):c}toJSON(e,t){return this.toJS({json:true,jsonArg:e,mapAsMap:false,onAnchor:t})}toString(e={}){if(this.errors.length>0)throw new Error("Document with errors cannot be stringified");if("indent"in e&&(!Number.isInteger(e.indent)||Number(e.indent)<=0)){const t=JSON.stringify(e.indent);throw new Error(`"indent" option must be a positive integer, not ${t}`)}return f.stringifyDocument(this,e)}}function assertCollection(e){if(r.isCollection(e))return true;throw new Error("Expected a YAML collection as document contents")}t.Document=Document},8459:(e,t,n)=>{var s=n(1399);var i=n(6796);function anchorIsValid(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){const t=JSON.stringify(e);const n=`Anchor must not contain whitespace or control characters: ${t}`;throw new Error(n)}return true}function anchorNames(e){const t=new Set;i.visit(e,{Value(e,n){if(n.anchor)t.add(n.anchor)}});return t}function findNewAnchor(e,t){for(let n=1;true;++n){const s=`${e}${n}`;if(!t.has(s))return s}}function createNodeAnchors(e,t){const n=[];const i=new Map;let r=null;return{onAnchor:s=>{n.push(s);if(!r)r=anchorNames(e);const i=findNewAnchor(t,r);r.add(i);return i},setAnchors:()=>{for(const e of n){const t=i.get(e);if(typeof t==="object"&&t.anchor&&(s.isScalar(t.node)||s.isCollection(t.node))){t.node.anchor=t.anchor}else{const t=new Error("Failed to resolve repeated object (this should not happen)");t.source=e;throw t}}},sourceObjects:i}}t.anchorIsValid=anchorIsValid;t.anchorNames=anchorNames;t.createNodeAnchors=createNodeAnchors;t.findNewAnchor=findNewAnchor},3412:(e,t)=>{function applyReviver(e,t,n,s){if(s&&typeof s==="object"){if(Array.isArray(s)){for(let t=0,n=s.length;t<n;++t){const n=s[t];const i=applyReviver(e,s,String(t),n);if(i===undefined)delete s[t];else if(i!==n)s[t]=i}}else if(s instanceof Map){for(const t of Array.from(s.keys())){const n=s.get(t);const i=applyReviver(e,s,t,n);if(i===undefined)s.delete(t);else if(i!==n)s.set(t,i)}}else if(s instanceof Set){for(const t of Array.from(s)){const n=applyReviver(e,s,t,t);if(n===undefined)s.delete(t);else if(n!==t){s.delete(t);s.add(n)}}}else{for(const[t,n]of Object.entries(s)){const i=applyReviver(e,s,t,n);if(i===undefined)delete s[t];else if(i!==n)s[t]=i}}}return e.call(t,n,s)}t.applyReviver=applyReviver},9652:(e,t,n)=>{var s=n(5639);var i=n(1399);var r=n(9338);const o="tag:yaml.org,2002:";function findTagObject(e,t,n){if(t){const e=n.filter((e=>e.tag===t));const s=e.find((e=>!e.format))??e[0];if(!s)throw new Error(`Tag ${t} not found`);return s}return n.find((t=>t.identify?.(e)&&!t.format))}function createNode(e,t,n){if(i.isDocument(e))e=e.contents;if(i.isNode(e))return e;if(i.isPair(e)){const t=n.schema[i.MAP].createNode?.(n.schema,null,n);t.items.push(e);return t}if(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt!=="undefined"&&e instanceof BigInt){e=e.valueOf()}const{aliasDuplicateObjects:a,onAnchor:c,onTagObj:l,schema:f,sourceObjects:u}=n;let d=undefined;if(a&&e&&typeof e==="object"){d=u.get(e);if(d){if(!d.anchor)d.anchor=c(e);return new s.Alias(d.anchor)}else{d={anchor:null,node:null};u.set(e,d)}}if(t?.startsWith("!!"))t=o+t.slice(2);let h=findTagObject(e,t,f.tags);if(!h){if(e&&typeof e.toJSON==="function"){e=e.toJSON()}if(!e||typeof e!=="object"){const t=new r.Scalar(e);if(d)d.node=t;return t}h=e instanceof Map?f[i.MAP]:Symbol.iterator in Object(e)?f[i.SEQ]:f[i.MAP]}if(l){l(h);delete n.onTagObj}const p=h?.createNode?h.createNode(n.schema,e,n):new r.Scalar(e);if(t)p.tag=t;if(d)d.node=p;return p}t.createNode=createNode},5400:(e,t,n)=>{var s=n(1399);var i=n(6796);const r={"!":"%21",",":"%2C","[":"%5B","]":"%5D","{":"%7B","}":"%7D"};const escapeTagName=e=>e.replace(/[!,[\]{}]/g,(e=>r[e]));class Directives{constructor(e,t){this.docStart=null;this.docEnd=false;this.yaml=Object.assign({},Directives.defaultYaml,e);this.tags=Object.assign({},Directives.defaultTags,t)}clone(){const e=new Directives(this.yaml,this.tags);e.docStart=this.docStart;return e}atDocument(){const e=new Directives(this.yaml,this.tags);switch(this.yaml.version){case"1.1":this.atNextDocument=true;break;case"1.2":this.atNextDocument=false;this.yaml={explicit:Directives.defaultYaml.explicit,version:"1.2"};this.tags=Object.assign({},Directives.defaultTags);break}return e}add(e,t){if(this.atNextDocument){this.yaml={explicit:Directives.defaultYaml.explicit,version:"1.1"};this.tags=Object.assign({},Directives.defaultTags);this.atNextDocument=false}const n=e.trim().split(/[ \t]+/);const s=n.shift();switch(s){case"%TAG":{if(n.length!==2){t(0,"%TAG directive should contain exactly two parts");if(n.length<2)return false}const[e,s]=n;this.tags[e]=s;return true}case"%YAML":{this.yaml.explicit=true;if(n.length!==1){t(0,"%YAML directive should contain exactly one part");return false}const[e]=n;if(e==="1.1"||e==="1.2"){this.yaml.version=e;return true}else{const n=/^\d+\.\d+$/.test(e);t(6,`Unsupported YAML version ${e}`,n);return false}}default:t(0,`Unknown directive ${s}`,true);return false}}tagName(e,t){if(e==="!")return"!";if(e[0]!=="!"){t(`Not a valid tag: ${e}`);return null}if(e[1]==="<"){const n=e.slice(2,-1);if(n==="!"||n==="!!"){t(`Verbatim tags aren't resolved, so ${e} is invalid.`);return null}if(e[e.length-1]!==">")t("Verbatim tags must end with a >");return n}const[,n,s]=e.match(/^(.*!)([^!]*)$/);if(!s)t(`The ${e} tag has no suffix`);const i=this.tags[n];if(i)return i+decodeURIComponent(s);if(n==="!")return e;t(`Could not resolve tag: ${e}`);return null}tagString(e){for(const[t,n]of Object.entries(this.tags)){if(e.startsWith(n))return t+escapeTagName(e.substring(n.length))}return e[0]==="!"?e:`!<${e}>`}toString(e){const t=this.yaml.explicit?[`%YAML ${this.yaml.version||"1.2"}`]:[];const n=Object.entries(this.tags);let r;if(e&&n.length>0&&s.isNode(e.contents)){const t={};i.visit(e.contents,((e,n)=>{if(s.isNode(n)&&n.tag)t[n.tag]=true}));r=Object.keys(t)}else r=[];for(const[s,i]of n){if(s==="!!"&&i==="tag:yaml.org,2002:")continue;if(!e||r.some((e=>e.startsWith(i))))t.push(`%TAG ${s} ${i}`)}return t.join("\n")}}Directives.defaultYaml={explicit:false,version:"1.2"};Directives.defaultTags={"!!":"tag:yaml.org,2002:"};t.Directives=Directives},4236:(e,t)=>{class YAMLError extends Error{constructor(e,t,n,s){super();this.name=e;this.code=n;this.message=s;this.pos=t}}class YAMLParseError extends YAMLError{constructor(e,t,n){super("YAMLParseError",e,t,n)}}class YAMLWarning extends YAMLError{constructor(e,t,n){super("YAMLWarning",e,t,n)}}const prettifyError=(e,t)=>n=>{if(n.pos[0]===-1)return;n.linePos=n.pos.map((e=>t.linePos(e)));const{line:s,col:i}=n.linePos[0];n.message+=` at line ${s}, column ${i}`;let r=i-1;let o=e.substring(t.lineStarts[s-1],t.lineStarts[s]).replace(/[\n\r]+$/,"");if(r>=60&&o.length>80){const e=Math.min(r-39,o.length-79);o="…"+o.substring(e);r-=e-1}if(o.length>80)o=o.substring(0,79)+"…";if(s>1&&/^ *$/.test(o.substring(0,r))){let n=e.substring(t.lineStarts[s-2],t.lineStarts[s-1]);if(n.length>80)n=n.substring(0,79)+"…\n";o=n+o}if(/[^ ]/.test(o)){let e=1;const t=n.linePos[1];if(t&&t.line===s&&t.col>i){e=Math.min(t.col-i,80-r)}const a=" ".repeat(r)+"^".repeat(e);n.message+=`:\n\n${o}\n${a}\n`}};t.YAMLError=YAMLError;t.YAMLParseError=YAMLParseError;t.YAMLWarning=YAMLWarning;t.prettifyError=prettifyError},4083:(e,t,n)=>{var s=n(9493);var i=n(42);var r=n(6831);var o=n(4236);var a=n(5639);var c=n(1399);var l=n(246);var f=n(9338);var u=n(6011);var d=n(5161);var h=n(9169);var p=n(5976);var m=n(1929);var y=n(3328);var g=n(8649);var v=n(6796);t.Composer=s.Composer;t.Document=i.Document;t.Schema=r.Schema;t.YAMLError=o.YAMLError;t.YAMLParseError=o.YAMLParseError;t.YAMLWarning=o.YAMLWarning;t.Alias=a.Alias;t.isAlias=c.isAlias;t.isCollection=c.isCollection;t.isDocument=c.isDocument;t.isMap=c.isMap;t.isNode=c.isNode;t.isPair=c.isPair;t.isScalar=c.isScalar;t.isSeq=c.isSeq;t.Pair=l.Pair;t.Scalar=f.Scalar;t.YAMLMap=u.YAMLMap;t.YAMLSeq=d.YAMLSeq;t.CST=h;t.Lexer=p.Lexer;t.LineCounter=m.LineCounter;t.Parser=y.Parser;t.parse=g.parse;t.parseAllDocuments=g.parseAllDocuments;t.parseDocument=g.parseDocument;t.stringify=g.stringify;t.visit=v.visit;t.visitAsync=v.visitAsync},6909:(e,t)=>{function debug(e,...t){if(e==="debug")console.log(...t)}function warn(e,t){if(e==="debug"||e==="warn"){if(typeof process!=="undefined"&&process.emitWarning)process.emitWarning(t);else console.warn(t)}}t.debug=debug;t.warn=warn},5639:(e,t,n)=>{var s=n(8459);var i=n(6796);var r=n(1399);class Alias extends r.NodeBase{constructor(e){super(r.ALIAS);this.source=e;Object.defineProperty(this,"tag",{set(){throw new Error("Alias nodes cannot have tags")}})}resolve(e){let t=undefined;i.visit(e,{Node:(e,n)=>{if(n===this)return i.visit.BREAK;if(n.anchor===this.source)t=n}});return t}toJSON(e,t){if(!t)return{source:this.source};const{anchors:n,doc:s,maxAliasCount:i}=t;const r=this.resolve(s);if(!r){const e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new ReferenceError(e)}const o=n.get(r);if(!o||o.res===undefined){const e="This should not happen: Alias anchor was not resolved?";throw new ReferenceError(e)}if(i>=0){o.count+=1;if(o.aliasCount===0)o.aliasCount=getAliasCount(s,r,n);if(o.count*o.aliasCount>i){const e="Excessive alias count indicates a resource exhaustion attack";throw new ReferenceError(e)}}return o.res}toString(e,t,n){const i=`*${this.source}`;if(e){s.anchorIsValid(this.source);if(e.options.verifyAliasOrder&&!e.anchors.has(this.source)){const e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new Error(e)}if(e.implicitKey)return`${i} `}return i}}function getAliasCount(e,t,n){if(r.isAlias(t)){const s=t.resolve(e);const i=n&&s&&n.get(s);return i?i.count*i.aliasCount:0}else if(r.isCollection(t)){let s=0;for(const i of t.items){const t=getAliasCount(e,i,n);if(t>s)s=t}return s}else if(r.isPair(t)){const s=getAliasCount(e,t.key,n);const i=getAliasCount(e,t.value,n);return Math.max(s,i)}return 1}t.Alias=Alias},3466:(e,t,n)=>{var s=n(9652);var i=n(1399);function collectionFromPath(e,t,n){let i=n;for(let e=t.length-1;e>=0;--e){const n=t[e];if(typeof n==="number"&&Number.isInteger(n)&&n>=0){const e=[];e[n]=i;i=e}else{i=new Map([[n,i]])}}return s.createNode(i,undefined,{aliasDuplicateObjects:false,keepUndefined:false,onAnchor:()=>{throw new Error("This should not happen, please report a bug.")},schema:e,sourceObjects:new Map})}const isEmptyPath=e=>e==null||typeof e==="object"&&!!e[Symbol.iterator]().next().done;class Collection extends i.NodeBase{constructor(e,t){super(e);Object.defineProperty(this,"schema",{value:t,configurable:true,enumerable:false,writable:true})}clone(e){const t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));if(e)t.schema=e;t.items=t.items.map((t=>i.isNode(t)||i.isPair(t)?t.clone(e):t));if(this.range)t.range=this.range.slice();return t}addIn(e,t){if(isEmptyPath(e))this.add(t);else{const[n,...s]=e;const r=this.get(n,true);if(i.isCollection(r))r.addIn(s,t);else if(r===undefined&&this.schema)this.set(n,collectionFromPath(this.schema,s,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`)}}deleteIn(e){const[t,...n]=e;if(n.length===0)return this.delete(t);const s=this.get(t,true);if(i.isCollection(s))return s.deleteIn(n);else throw new Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){const[n,...s]=e;const r=this.get(n,true);if(s.length===0)return!t&&i.isScalar(r)?r.value:r;else return i.isCollection(r)?r.getIn(s,t):undefined}hasAllNullValues(e){return this.items.every((t=>{if(!i.isPair(t))return false;const n=t.value;return n==null||e&&i.isScalar(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag}))}hasIn(e){const[t,...n]=e;if(n.length===0)return this.has(t);const s=this.get(t,true);return i.isCollection(s)?s.hasIn(n):false}setIn(e,t){const[n,...s]=e;if(s.length===0){this.set(n,t)}else{const e=this.get(n,true);if(i.isCollection(e))e.setIn(s,t);else if(e===undefined&&this.schema)this.set(n,collectionFromPath(this.schema,s,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`)}}}Collection.maxFlowStringSingleLineLength=60;t.Collection=Collection;t.collectionFromPath=collectionFromPath;t.isEmptyPath=isEmptyPath},1399:(e,t)=>{const n=Symbol.for("yaml.alias");const s=Symbol.for("yaml.document");const i=Symbol.for("yaml.map");const r=Symbol.for("yaml.pair");const o=Symbol.for("yaml.scalar");const a=Symbol.for("yaml.seq");const c=Symbol.for("yaml.node.type");const isAlias=e=>!!e&&typeof e==="object"&&e[c]===n;const isDocument=e=>!!e&&typeof e==="object"&&e[c]===s;const isMap=e=>!!e&&typeof e==="object"&&e[c]===i;const isPair=e=>!!e&&typeof e==="object"&&e[c]===r;const isScalar=e=>!!e&&typeof e==="object"&&e[c]===o;const isSeq=e=>!!e&&typeof e==="object"&&e[c]===a;function isCollection(e){if(e&&typeof e==="object")switch(e[c]){case i:case a:return true}return false}function isNode(e){if(e&&typeof e==="object")switch(e[c]){case n:case i:case o:case a:return true}return false}const hasAnchor=e=>(isScalar(e)||isCollection(e))&&!!e.anchor;class NodeBase{constructor(e){Object.defineProperty(this,c,{value:e})}clone(){const e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));if(this.range)e.range=this.range.slice();return e}}t.ALIAS=n;t.DOC=s;t.MAP=i;t.NODE_TYPE=c;t.NodeBase=NodeBase;t.PAIR=r;t.SCALAR=o;t.SEQ=a;t.hasAnchor=hasAnchor;t.isAlias=isAlias;t.isCollection=isCollection;t.isDocument=isDocument;t.isMap=isMap;t.isNode=isNode;t.isPair=isPair;t.isScalar=isScalar;t.isSeq=isSeq},246:(e,t,n)=>{var s=n(9652);var i=n(4875);var r=n(4676);var o=n(1399);function createPair(e,t,n){const i=s.createNode(e,undefined,n);const r=s.createNode(t,undefined,n);return new Pair(i,r)}class Pair{constructor(e,t=null){Object.defineProperty(this,o.NODE_TYPE,{value:o.PAIR});this.key=e;this.value=t}clone(e){let{key:t,value:n}=this;if(o.isNode(t))t=t.clone(e);if(o.isNode(n))n=n.clone(e);return new Pair(t,n)}toJSON(e,t){const n=t?.mapAsMap?new Map:{};return r.addPairToJSMap(t,n,this)}toString(e,t,n){return e?.doc?i.stringifyPair(this,e,t,n):JSON.stringify(this)}}t.Pair=Pair;t.createPair=createPair},9338:(e,t,n)=>{var s=n(1399);var i=n(2463);const isScalarValue=e=>!e||typeof e!=="function"&&typeof e!=="object";class Scalar extends s.NodeBase{constructor(e){super(s.SCALAR);this.value=e}toJSON(e,t){return t?.keep?this.value:i.toJS(this.value,e,t)}toString(){return String(this.value)}}Scalar.BLOCK_FOLDED="BLOCK_FOLDED";Scalar.BLOCK_LITERAL="BLOCK_LITERAL";Scalar.PLAIN="PLAIN";Scalar.QUOTE_DOUBLE="QUOTE_DOUBLE";Scalar.QUOTE_SINGLE="QUOTE_SINGLE";t.Scalar=Scalar;t.isScalarValue=isScalarValue},6011:(e,t,n)=>{var s=n(2466);var i=n(4676);var r=n(3466);var o=n(1399);var a=n(246);var c=n(9338);function findPair(e,t){const n=o.isScalar(t)?t.value:t;for(const s of e){if(o.isPair(s)){if(s.key===t||s.key===n)return s;if(o.isScalar(s.key)&&s.key.value===n)return s}}return undefined}class YAMLMap extends r.Collection{constructor(e){super(o.MAP,e);this.items=[]}static get tagName(){return"tag:yaml.org,2002:map"}add(e,t){let n;if(o.isPair(e))n=e;else if(!e||typeof e!=="object"||!("key"in e)){n=new a.Pair(e,e?.value)}else n=new a.Pair(e.key,e.value);const s=findPair(this.items,n.key);const i=this.schema?.sortMapEntries;if(s){if(!t)throw new Error(`Key ${n.key} already set`);if(o.isScalar(s.value)&&c.isScalarValue(n.value))s.value.value=n.value;else s.value=n.value}else if(i){const e=this.items.findIndex((e=>i(n,e)<0));if(e===-1)this.items.push(n);else this.items.splice(e,0,n)}else{this.items.push(n)}}delete(e){const t=findPair(this.items,e);if(!t)return false;const n=this.items.splice(this.items.indexOf(t),1);return n.length>0}get(e,t){const n=findPair(this.items,e);const s=n?.value;return(!t&&o.isScalar(s)?s.value:s)??undefined}has(e){return!!findPair(this.items,e)}set(e,t){this.add(new a.Pair(e,t),true)}toJSON(e,t,n){const s=n?new n:t?.mapAsMap?new Map:{};if(t?.onCreate)t.onCreate(s);for(const e of this.items)i.addPairToJSMap(t,s,e);return s}toString(e,t,n){if(!e)return JSON.stringify(this);for(const e of this.items){if(!o.isPair(e))throw new Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`)}if(!e.allNullValues&&this.hasAllNullValues(false))e=Object.assign({},e,{allNullValues:true});return s.stringifyCollection(this,e,{blockItemPrefix:"",flowChars:{start:"{",end:"}"},itemIndent:e.indent||"",onChompKeep:n,onComment:t})}}t.YAMLMap=YAMLMap;t.findPair=findPair},5161:(e,t,n)=>{var s=n(2466);var i=n(3466);var r=n(1399);var o=n(9338);var a=n(2463);class YAMLSeq extends i.Collection{constructor(e){super(r.SEQ,e);this.items=[]}static get tagName(){return"tag:yaml.org,2002:seq"}add(e){this.items.push(e)}delete(e){const t=asItemIndex(e);if(typeof t!=="number")return false;const n=this.items.splice(t,1);return n.length>0}get(e,t){const n=asItemIndex(e);if(typeof n!=="number")return undefined;const s=this.items[n];return!t&&r.isScalar(s)?s.value:s}has(e){const t=asItemIndex(e);return typeof t==="number"&&t<this.items.length}set(e,t){const n=asItemIndex(e);if(typeof n!=="number")throw new Error(`Expected a valid index, not ${e}.`);const s=this.items[n];if(r.isScalar(s)&&o.isScalarValue(t))s.value=t;else this.items[n]=t}toJSON(e,t){const n=[];if(t?.onCreate)t.onCreate(n);let s=0;for(const e of this.items)n.push(a.toJS(e,String(s++),t));return n}toString(e,t,n){if(!e)return JSON.stringify(this);return s.stringifyCollection(this,e,{blockItemPrefix:"- ",flowChars:{start:"[",end:"]"},itemIndent:(e.indent||"")+"  ",onChompKeep:n,onComment:t})}}function asItemIndex(e){let t=r.isScalar(e)?e.value:e;if(t&&typeof t==="string")t=Number(t);return typeof t==="number"&&Number.isInteger(t)&&t>=0?t:null}t.YAMLSeq=YAMLSeq},4676:(e,t,n)=>{var s=n(6909);var i=n(8409);var r=n(1399);var o=n(9338);var a=n(2463);const c="<<";function addPairToJSMap(e,t,{key:n,value:s}){if(e?.doc.schema.merge&&isMergeKey(n)){s=r.isAlias(s)?s.resolve(e.doc):s;if(r.isSeq(s))for(const n of s.items)mergeToJSMap(e,t,n);else if(Array.isArray(s))for(const n of s)mergeToJSMap(e,t,n);else mergeToJSMap(e,t,s)}else{const i=a.toJS(n,"",e);if(t instanceof Map){t.set(i,a.toJS(s,i,e))}else if(t instanceof Set){t.add(i)}else{const r=stringifyKey(n,i,e);const o=a.toJS(s,r,e);if(r in t)Object.defineProperty(t,r,{value:o,writable:true,enumerable:true,configurable:true});else t[r]=o}}return t}const isMergeKey=e=>e===c||r.isScalar(e)&&e.value===c&&(!e.type||e.type===o.Scalar.PLAIN);function mergeToJSMap(e,t,n){const s=e&&r.isAlias(n)?n.resolve(e.doc):n;if(!r.isMap(s))throw new Error("Merge sources must be maps or map aliases");const i=s.toJSON(null,e,Map);for(const[e,n]of i){if(t instanceof Map){if(!t.has(e))t.set(e,n)}else if(t instanceof Set){t.add(e)}else if(!Object.prototype.hasOwnProperty.call(t,e)){Object.defineProperty(t,e,{value:n,writable:true,enumerable:true,configurable:true})}}return t}function stringifyKey(e,t,n){if(t===null)return"";if(typeof t!=="object")return String(t);if(r.isNode(e)&&n&&n.doc){const t=i.createStringifyContext(n.doc,{});t.anchors=new Set;for(const e of n.anchors.keys())t.anchors.add(e.anchor);t.inFlow=true;t.inStringifyKey=true;const r=e.toString(t);if(!n.mapKeyWarned){let e=JSON.stringify(r);if(e.length>40)e=e.substring(0,36)+'..."';s.warn(n.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`);n.mapKeyWarned=true}return r}return JSON.stringify(t)}t.addPairToJSMap=addPairToJSMap},2463:(e,t,n)=>{var s=n(1399);function toJS(e,t,n){if(Array.isArray(e))return e.map(((e,t)=>toJS(e,String(t),n)));if(e&&typeof e.toJSON==="function"){if(!n||!s.hasAnchor(e))return e.toJSON(t,n);const i={aliasCount:0,count:1,res:undefined};n.anchors.set(e,i);n.onCreate=e=>{i.res=e;delete n.onCreate};const r=e.toJSON(t,n);if(n.onCreate)n.onCreate(r);return r}if(typeof e==="bigint"&&!n?.keep)return Number(e);return e}t.toJS=toJS},9027:(e,t,n)=>{var s=n(9485);var i=n(7578);var r=n(4236);var o=n(6226);function resolveAsScalar(e,t=true,n){if(e){const _onError=(e,t,s)=>{const i=typeof e==="number"?e:Array.isArray(e)?e[0]:e.offset;if(n)n(i,t,s);else throw new r.YAMLParseError([i,i+1],t,s)};switch(e.type){case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return i.resolveFlowScalar(e,t,_onError);case"block-scalar":return s.resolveBlockScalar(e,t,_onError)}}return null}function createScalarToken(e,t){const{implicitKey:n=false,indent:s,inFlow:i=false,offset:r=-1,type:a="PLAIN"}=t;const c=o.stringifyString({type:a,value:e},{implicitKey:n,indent:s>0?" ".repeat(s):"",inFlow:i,options:{blockQuote:true,lineWidth:-1}});const l=t.end??[{type:"newline",offset:-1,indent:s,source:"\n"}];switch(c[0]){case"|":case">":{const e=c.indexOf("\n");const t=c.substring(0,e);const n=c.substring(e+1)+"\n";const i=[{type:"block-scalar-header",offset:r,indent:s,source:t}];if(!addEndtoBlockProps(i,l))i.push({type:"newline",offset:-1,indent:s,source:"\n"});return{type:"block-scalar",offset:r,indent:s,props:i,source:n}}case'"':return{type:"double-quoted-scalar",offset:r,indent:s,source:c,end:l};case"'":return{type:"single-quoted-scalar",offset:r,indent:s,source:c,end:l};default:return{type:"scalar",offset:r,indent:s,source:c,end:l}}}function setScalarValue(e,t,n={}){let{afterKey:s=false,implicitKey:i=false,inFlow:r=false,type:a}=n;let c="indent"in e?e.indent:null;if(s&&typeof c==="number")c+=2;if(!a)switch(e.type){case"single-quoted-scalar":a="QUOTE_SINGLE";break;case"double-quoted-scalar":a="QUOTE_DOUBLE";break;case"block-scalar":{const t=e.props[0];if(t.type!=="block-scalar-header")throw new Error("Invalid block scalar header");a=t.source[0]===">"?"BLOCK_FOLDED":"BLOCK_LITERAL";break}default:a="PLAIN"}const l=o.stringifyString({type:a,value:t},{implicitKey:i||c===null,indent:c!==null&&c>0?" ".repeat(c):"",inFlow:r,options:{blockQuote:true,lineWidth:-1}});switch(l[0]){case"|":case">":setBlockScalarValue(e,l);break;case'"':setFlowScalarValue(e,l,"double-quoted-scalar");break;case"'":setFlowScalarValue(e,l,"single-quoted-scalar");break;default:setFlowScalarValue(e,l,"scalar")}}function setBlockScalarValue(e,t){const n=t.indexOf("\n");const s=t.substring(0,n);const i=t.substring(n+1)+"\n";if(e.type==="block-scalar"){const t=e.props[0];if(t.type!=="block-scalar-header")throw new Error("Invalid block scalar header");t.source=s;e.source=i}else{const{offset:t}=e;const n="indent"in e?e.indent:-1;const r=[{type:"block-scalar-header",offset:t,indent:n,source:s}];if(!addEndtoBlockProps(r,"end"in e?e.end:undefined))r.push({type:"newline",offset:-1,indent:n,source:"\n"});for(const t of Object.keys(e))if(t!=="type"&&t!=="offset")delete e[t];Object.assign(e,{type:"block-scalar",indent:n,props:r,source:i})}}function addEndtoBlockProps(e,t){if(t)for(const n of t)switch(n.type){case"space":case"comment":e.push(n);break;case"newline":e.push(n);return true}return false}function setFlowScalarValue(e,t,n){switch(e.type){case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":e.type=n;e.source=t;break;case"block-scalar":{const s=e.props.slice(1);let i=t.length;if(e.props[0].type==="block-scalar-header")i-=e.props[0].source.length;for(const e of s)e.offset+=i;delete e.props;Object.assign(e,{type:n,source:t,end:s});break}case"block-map":case"block-seq":{const s=e.offset+t.length;const i={type:"newline",offset:s,indent:e.indent,source:"\n"};delete e.items;Object.assign(e,{type:n,source:t,end:[i]});break}default:{const s="indent"in e?e.indent:-1;const i="end"in e&&Array.isArray(e.end)?e.end.filter((e=>e.type==="space"||e.type==="comment"||e.type==="newline")):[];for(const t of Object.keys(e))if(t!=="type"&&t!=="offset")delete e[t];Object.assign(e,{type:n,indent:s,source:t,end:i})}}}t.createScalarToken=createScalarToken;t.resolveAsScalar=resolveAsScalar;t.setScalarValue=setScalarValue},6307:(e,t)=>{const stringify=e=>"type"in e?stringifyToken(e):stringifyItem(e);function stringifyToken(e){switch(e.type){case"block-scalar":{let t="";for(const n of e.props)t+=stringifyToken(n);return t+e.source}case"block-map":case"block-seq":{let t="";for(const n of e.items)t+=stringifyItem(n);return t}case"flow-collection":{let t=e.start.source;for(const n of e.items)t+=stringifyItem(n);for(const n of e.end)t+=n.source;return t}case"document":{let t=stringifyItem(e);if(e.end)for(const n of e.end)t+=n.source;return t}default:{let t=e.source;if("end"in e&&e.end)for(const n of e.end)t+=n.source;return t}}}function stringifyItem({start:e,key:t,sep:n,value:s}){let i="";for(const t of e)i+=t.source;if(t)i+=stringifyToken(t);if(n)for(const e of n)i+=e.source;if(s)i+=stringifyToken(s);return i}t.stringify=stringify},8497:(e,t)=>{const n=Symbol("break visit");const s=Symbol("skip children");const i=Symbol("remove item");function visit(e,t){if("type"in e&&e.type==="document")e={start:e.start,value:e.value};_visit(Object.freeze([]),e,t)}visit.BREAK=n;visit.SKIP=s;visit.REMOVE=i;visit.itemAtPath=(e,t)=>{let n=e;for(const[e,s]of t){const t=n?.[e];if(t&&"items"in t){n=t.items[s]}else return undefined}return n};visit.parentCollection=(e,t)=>{const n=visit.itemAtPath(e,t.slice(0,-1));const s=t[t.length-1][0];const i=n?.[s];if(i&&"items"in i)return i;throw new Error("Parent collection not found")};function _visit(e,t,s){let r=s(t,e);if(typeof r==="symbol")return r;for(const o of["key","value"]){const a=t[o];if(a&&"items"in a){for(let t=0;t<a.items.length;++t){const r=_visit(Object.freeze(e.concat([[o,t]])),a.items[t],s);if(typeof r==="number")t=r-1;else if(r===n)return n;else if(r===i){a.items.splice(t,1);t-=1}}if(typeof r==="function"&&o==="key")r=r(t,e)}}return typeof r==="function"?r(t,e):r}t.visit=visit},9169:(e,t,n)=>{var s=n(9027);var i=n(6307);var r=n(8497);const o="\ufeff";const a="";const c="";const l="";const isCollection=e=>!!e&&"items"in e;const isScalar=e=>!!e&&(e.type==="scalar"||e.type==="single-quoted-scalar"||e.type==="double-quoted-scalar"||e.type==="block-scalar");function prettyToken(e){switch(e){case o:return"<BOM>";case a:return"<DOC>";case c:return"<FLOW_END>";case l:return"<SCALAR>";default:return JSON.stringify(e)}}function tokenType(e){switch(e){case o:return"byte-order-mark";case a:return"doc-mode";case c:return"flow-error-end";case l:return"scalar";case"---":return"doc-start";case"...":return"doc-end";case"":case"\n":case"\r\n":return"newline";case"-":return"seq-item-ind";case"?":return"explicit-key-ind";case":":return"map-value-ind";case"{":return"flow-map-start";case"}":return"flow-map-end";case"[":return"flow-seq-start";case"]":return"flow-seq-end";case",":return"comma"}switch(e[0]){case" ":case"\t":return"space";case"#":return"comment";case"%":return"directive-line";case"*":return"alias";case"&":return"anchor";case"!":return"tag";case"'":return"single-quoted-scalar";case'"':return"double-quoted-scalar";case"|":case">":return"block-scalar-header"}return null}t.createScalarToken=s.createScalarToken;t.resolveAsScalar=s.resolveAsScalar;t.setScalarValue=s.setScalarValue;t.stringify=i.stringify;t.visit=r.visit;t.BOM=o;t.DOCUMENT=a;t.FLOW_END=c;t.SCALAR=l;t.isCollection=isCollection;t.isScalar=isScalar;t.prettyToken=prettyToken;t.tokenType=tokenType},5976:(e,t,n)=>{var s=n(9169);function isEmpty(e){switch(e){case undefined:case" ":case"\n":case"\r":case"\t":return true;default:return false}}const i="0123456789ABCDEFabcdef".split("");const r="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split("");const o=",[]{}".split("");const a=" ,[]{}\n\r\t".split("");const isNotAnchorChar=e=>!e||a.includes(e);class Lexer{constructor(){this.atEnd=false;this.blockScalarIndent=-1;this.blockScalarKeep=false;this.buffer="";this.flowKey=false;this.flowLevel=0;this.indentNext=0;this.indentValue=0;this.lineEndPos=null;this.next=null;this.pos=0}*lex(e,t=false){if(e){this.buffer=this.buffer?this.buffer+e:e;this.lineEndPos=null}this.atEnd=!t;let n=this.next??"stream";while(n&&(t||this.hasChars(1)))n=yield*this.parseNext(n)}atLineEnd(){let e=this.pos;let t=this.buffer[e];while(t===" "||t==="\t")t=this.buffer[++e];if(!t||t==="#"||t==="\n")return true;if(t==="\r")return this.buffer[e+1]==="\n";return false}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let n=0;while(t===" ")t=this.buffer[++n+e];if(t==="\r"){const t=this.buffer[n+e+1];if(t==="\n"||!t&&!this.atEnd)return e+n+1}return t==="\n"||n>=this.indentNext||!t&&!this.atEnd?e+n:-1}if(t==="-"||t==="."){const t=this.buffer.substr(e,3);if((t==="---"||t==="...")&&isEmpty(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;if(typeof e!=="number"||e!==-1&&e<this.pos){e=this.buffer.indexOf("\n",this.pos);this.lineEndPos=e}if(e===-1)return this.atEnd?this.buffer.substring(this.pos):null;if(this.buffer[e-1]==="\r")e-=1;return this.buffer.substring(this.pos,e)}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){this.buffer=this.buffer.substring(this.pos);this.pos=0;this.lineEndPos=null;this.next=e;return null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case"stream":return yield*this.parseStream();case"line-start":return yield*this.parseLineStart();case"block-start":return yield*this.parseBlockStart();case"doc":return yield*this.parseDocument();case"flow":return yield*this.parseFlowCollection();case"quoted-scalar":return yield*this.parseQuotedScalar();case"block-scalar":return yield*this.parseBlockScalar();case"plain-scalar":return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext("stream");if(e[0]===s.BOM){yield*this.pushCount(1);e=e.substring(1)}if(e[0]==="%"){let t=e.length;const n=e.indexOf("#");if(n!==-1){const s=e[n-1];if(s===" "||s==="\t")t=n-1}while(true){const n=e[t-1];if(n===" "||n==="\t")t-=1;else break}const s=(yield*this.pushCount(t))+(yield*this.pushSpaces(true));yield*this.pushCount(e.length-s);this.pushNewline();return"stream"}if(this.atLineEnd()){const t=yield*this.pushSpaces(true);yield*this.pushCount(e.length-t);yield*this.pushNewline();return"stream"}yield s.DOCUMENT;return yield*this.parseLineStart()}*parseLineStart(){const e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext("line-start");if(e==="-"||e==="."){if(!this.atEnd&&!this.hasChars(4))return this.setNext("line-start");const e=this.peek(3);if(e==="---"&&isEmpty(this.charAt(3))){yield*this.pushCount(3);this.indentValue=0;this.indentNext=0;return"doc"}else if(e==="..."&&isEmpty(this.charAt(3))){yield*this.pushCount(3);return"stream"}}this.indentValue=yield*this.pushSpaces(false);if(this.indentNext>this.indentValue&&!isEmpty(this.charAt(1)))this.indentNext=this.indentValue;return yield*this.parseBlockStart()}*parseBlockStart(){const[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext("block-start");if((e==="-"||e==="?"||e===":")&&isEmpty(t)){const e=(yield*this.pushCount(1))+(yield*this.pushSpaces(true));this.indentNext=this.indentValue+1;this.indentValue+=e;return yield*this.parseBlockStart()}return"doc"}*parseDocument(){yield*this.pushSpaces(true);const e=this.getLine();if(e===null)return this.setNext("doc");let t=yield*this.pushIndicators();switch(e[t]){case"#":yield*this.pushCount(e.length-t);case undefined:yield*this.pushNewline();return yield*this.parseLineStart();case"{":case"[":yield*this.pushCount(1);this.flowKey=false;this.flowLevel=1;return"flow";case"}":case"]":yield*this.pushCount(1);return"doc";case"*":yield*this.pushUntil(isNotAnchorChar);return"doc";case'"':case"'":return yield*this.parseQuotedScalar();case"|":case">":t+=(yield*this.parseBlockScalarHeader());t+=(yield*this.pushSpaces(true));yield*this.pushCount(e.length-t);yield*this.pushNewline();return yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t;let n=-1;do{e=yield*this.pushNewline();if(e>0){t=yield*this.pushSpaces(false);this.indentValue=n=t}else{t=0}t+=(yield*this.pushSpaces(true))}while(e+t>0);const i=this.getLine();if(i===null)return this.setNext("flow");if(n!==-1&&n<this.indentNext&&i[0]!=="#"||n===0&&(i.startsWith("---")||i.startsWith("..."))&&isEmpty(i[3])){const e=n===this.indentNext-1&&this.flowLevel===1&&(i[0]==="]"||i[0]==="}");if(!e){this.flowLevel=0;yield s.FLOW_END;return yield*this.parseLineStart()}}let r=0;while(i[r]===","){r+=(yield*this.pushCount(1));r+=(yield*this.pushSpaces(true));this.flowKey=false}r+=(yield*this.pushIndicators());switch(i[r]){case undefined:return"flow";case"#":yield*this.pushCount(i.length-r);return"flow";case"{":case"[":yield*this.pushCount(1);this.flowKey=false;this.flowLevel+=1;return"flow";case"}":case"]":yield*this.pushCount(1);this.flowKey=true;this.flowLevel-=1;return this.flowLevel?"flow":"doc";case"*":yield*this.pushUntil(isNotAnchorChar);return"flow";case'"':case"'":this.flowKey=true;return yield*this.parseQuotedScalar();case":":{const e=this.charAt(1);if(this.flowKey||isEmpty(e)||e===","){this.flowKey=false;yield*this.pushCount(1);yield*this.pushSpaces(true);return"flow"}}default:this.flowKey=false;return yield*this.parsePlainScalar()}}*parseQuotedScalar(){const e=this.charAt(0);let t=this.buffer.indexOf(e,this.pos+1);if(e==="'"){while(t!==-1&&this.buffer[t+1]==="'")t=this.buffer.indexOf("'",t+2)}else{while(t!==-1){let e=0;while(this.buffer[t-1-e]==="\\")e+=1;if(e%2===0)break;t=this.buffer.indexOf('"',t+1)}}const n=this.buffer.substring(0,t);let s=n.indexOf("\n",this.pos);if(s!==-1){while(s!==-1){const e=this.continueScalar(s+1);if(e===-1)break;s=n.indexOf("\n",e)}if(s!==-1){t=s-(n[s-1]==="\r"?2:1)}}if(t===-1){if(!this.atEnd)return this.setNext("quoted-scalar");t=this.buffer.length}yield*this.pushToIndex(t+1,false);return this.flowLevel?"flow":"doc"}*parseBlockScalarHeader(){this.blockScalarIndent=-1;this.blockScalarKeep=false;let e=this.pos;while(true){const t=this.buffer[++e];if(t==="+")this.blockScalarKeep=true;else if(t>"0"&&t<="9")this.blockScalarIndent=Number(t)-1;else if(t!=="-")break}return yield*this.pushUntil((e=>isEmpty(e)||e==="#"))}*parseBlockScalar(){let e=this.pos-1;let t=0;let n;e:for(let s=this.pos;n=this.buffer[s];++s){switch(n){case" ":t+=1;break;case"\n":e=s;t=0;break;case"\r":{const e=this.buffer[s+1];if(!e&&!this.atEnd)return this.setNext("block-scalar");if(e==="\n")break}default:break e}}if(!n&&!this.atEnd)return this.setNext("block-scalar");if(t>=this.indentNext){if(this.blockScalarIndent===-1)this.indentNext=t;else this.indentNext+=this.blockScalarIndent;do{const t=this.continueScalar(e+1);if(t===-1)break;e=this.buffer.indexOf("\n",t)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext("block-scalar");e=this.buffer.length}}if(!this.blockScalarKeep){do{let n=e-1;let s=this.buffer[n];if(s==="\r")s=this.buffer[--n];const i=n;while(s===" "||s==="\t")s=this.buffer[--n];if(s==="\n"&&n>=this.pos&&n+1+t>i)e=n;else break}while(true)}yield s.SCALAR;yield*this.pushToIndex(e+1,true);return yield*this.parseLineStart()}*parsePlainScalar(){const e=this.flowLevel>0;let t=this.pos-1;let n=this.pos-1;let i;while(i=this.buffer[++n]){if(i===":"){const s=this.buffer[n+1];if(isEmpty(s)||e&&s===",")break;t=n}else if(isEmpty(i)){let s=this.buffer[n+1];if(i==="\r"){if(s==="\n"){n+=1;i="\n";s=this.buffer[n+1]}else t=n}if(s==="#"||e&&o.includes(s))break;if(i==="\n"){const e=this.continueScalar(n+1);if(e===-1)break;n=Math.max(n,e-2)}}else{if(e&&o.includes(i))break;t=n}}if(!i&&!this.atEnd)return this.setNext("plain-scalar");yield s.SCALAR;yield*this.pushToIndex(t+1,true);return e?"flow":"doc"}*pushCount(e){if(e>0){yield this.buffer.substr(this.pos,e);this.pos+=e;return e}return 0}*pushToIndex(e,t){const n=this.buffer.slice(this.pos,e);if(n){yield n;this.pos+=n.length;return n.length}else if(t)yield"";return 0}*pushIndicators(){switch(this.charAt(0)){case"!":return(yield*this.pushTag())+(yield*this.pushSpaces(true))+(yield*this.pushIndicators());case"&":return(yield*this.pushUntil(isNotAnchorChar))+(yield*this.pushSpaces(true))+(yield*this.pushIndicators());case"-":case"?":case":":{const e=this.flowLevel>0;const t=this.charAt(1);if(isEmpty(t)||e&&o.includes(t)){if(!e)this.indentNext=this.indentValue+1;else if(this.flowKey)this.flowKey=false;return(yield*this.pushCount(1))+(yield*this.pushSpaces(true))+(yield*this.pushIndicators())}}}return 0}*pushTag(){if(this.charAt(1)==="<"){let e=this.pos+2;let t=this.buffer[e];while(!isEmpty(t)&&t!==">")t=this.buffer[++e];return yield*this.pushToIndex(t===">"?e+1:e,false)}else{let e=this.pos+1;let t=this.buffer[e];while(t){if(r.includes(t))t=this.buffer[++e];else if(t==="%"&&i.includes(this.buffer[e+1])&&i.includes(this.buffer[e+2])){t=this.buffer[e+=3]}else break}return yield*this.pushToIndex(e,false)}}*pushNewline(){const e=this.buffer[this.pos];if(e==="\n")return yield*this.pushCount(1);else if(e==="\r"&&this.charAt(1)==="\n")return yield*this.pushCount(2);else return 0}*pushSpaces(e){let t=this.pos-1;let n;do{n=this.buffer[++t]}while(n===" "||e&&n==="\t");const s=t-this.pos;if(s>0){yield this.buffer.substr(this.pos,s);this.pos=t}return s}*pushUntil(e){let t=this.pos;let n=this.buffer[t];while(!e(n))n=this.buffer[++t];return yield*this.pushToIndex(t,false)}}t.Lexer=Lexer},1929:(e,t)=>{class LineCounter{constructor(){this.lineStarts=[];this.addNewLine=e=>this.lineStarts.push(e);this.linePos=e=>{let t=0;let n=this.lineStarts.length;while(t<n){const s=t+n>>1;if(this.lineStarts[s]<e)t=s+1;else n=s}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};const s=this.lineStarts[t-1];return{line:t,col:e-s+1}}}}t.LineCounter=LineCounter},3328:(e,t,n)=>{var s=n(9169);var i=n(5976);function includesToken(e,t){for(let n=0;n<e.length;++n)if(e[n].type===t)return true;return false}function findNonEmptyIndex(e){for(let t=0;t<e.length;++t){switch(e[t].type){case"space":case"comment":case"newline":break;default:return t}}return-1}function isFlowToken(e){switch(e?.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"flow-collection":return true;default:return false}}function getPrevProps(e){switch(e.type){case"document":return e.start;case"block-map":{const t=e.items[e.items.length-1];return t.sep??t.start}case"block-seq":return e.items[e.items.length-1].start;default:return[]}}function getFirstKeyStartProps(e){if(e.length===0)return[];let t=e.length;e:while(--t>=0){switch(e[t].type){case"doc-start":case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":case"newline":break e}}while(e[++t]?.type==="space"){}return e.splice(t,e.length)}function fixFlowSeqItems(e){if(e.start.type==="flow-seq-start"){for(const t of e.items){if(t.sep&&!t.value&&!includesToken(t.start,"explicit-key-ind")&&!includesToken(t.sep,"map-value-ind")){if(t.key)t.value=t.key;delete t.key;if(isFlowToken(t.value)){if(t.value.end)Array.prototype.push.apply(t.value.end,t.sep);else t.value.end=t.sep}else Array.prototype.push.apply(t.start,t.sep);delete t.sep}}}}class Parser{constructor(e){this.atNewLine=true;this.atScalar=false;this.indent=0;this.offset=0;this.onKeyLine=false;this.stack=[];this.source="";this.type="";this.lexer=new i.Lexer;this.onNewLine=e}*parse(e,t=false){if(this.onNewLine&&this.offset===0)this.onNewLine(0);for(const n of this.lexer.lex(e,t))yield*this.next(n);if(!t)yield*this.end()}*next(e){this.source=e;if(process.env.LOG_TOKENS)console.log("|",s.prettyToken(e));if(this.atScalar){this.atScalar=false;yield*this.step();this.offset+=e.length;return}const t=s.tokenType(e);if(!t){const t=`Not a YAML token: ${e}`;yield*this.pop({type:"error",offset:this.offset,message:t,source:e});this.offset+=e.length}else if(t==="scalar"){this.atNewLine=false;this.atScalar=true;this.type="scalar"}else{this.type=t;yield*this.step();switch(t){case"newline":this.atNewLine=true;this.indent=0;if(this.onNewLine)this.onNewLine(this.offset+e.length);break;case"space":if(this.atNewLine&&e[0]===" ")this.indent+=e.length;break;case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":if(this.atNewLine)this.indent+=e.length;break;case"doc-mode":case"flow-error-end":return;default:this.atNewLine=false}this.offset+=e.length}}*end(){while(this.stack.length>0)yield*this.pop()}get sourceToken(){const e={type:this.type,offset:this.offset,indent:this.indent,source:this.source};return e}*step(){const e=this.peek(1);if(this.type==="doc-end"&&(!e||e.type!=="doc-end")){while(this.stack.length>0)yield*this.pop();this.stack.push({type:"doc-end",offset:this.offset,source:this.source});return}if(!e)return yield*this.stream();switch(e.type){case"document":return yield*this.document(e);case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return yield*this.scalar(e);case"block-scalar":return yield*this.blockScalar(e);case"block-map":return yield*this.blockMap(e);case"block-seq":return yield*this.blockSequence(e);case"flow-collection":return yield*this.flowCollection(e);case"doc-end":return yield*this.documentEnd(e)}yield*this.pop()}peek(e){return this.stack[this.stack.length-e]}*pop(e){const t=e??this.stack.pop();if(!t){const e="Tried to pop an empty stack";yield{type:"error",offset:this.offset,source:"",message:e}}else if(this.stack.length===0){yield t}else{const e=this.peek(1);if(t.type==="block-scalar"){t.indent="indent"in e?e.indent:0}else if(t.type==="flow-collection"&&e.type==="document"){t.indent=0}if(t.type==="flow-collection")fixFlowSeqItems(t);switch(e.type){case"document":e.value=t;break;case"block-scalar":e.props.push(t);break;case"block-map":{const n=e.items[e.items.length-1];if(n.value){e.items.push({start:[],key:t,sep:[]});this.onKeyLine=true;return}else if(n.sep){n.value=t}else{Object.assign(n,{key:t,sep:[]});this.onKeyLine=!includesToken(n.start,"explicit-key-ind");return}break}case"block-seq":{const n=e.items[e.items.length-1];if(n.value)e.items.push({start:[],value:t});else n.value=t;break}case"flow-collection":{const n=e.items[e.items.length-1];if(!n||n.value)e.items.push({start:[],key:t,sep:[]});else if(n.sep)n.value=t;else Object.assign(n,{key:t,sep:[]});return}default:yield*this.pop();yield*this.pop(t)}if((e.type==="document"||e.type==="block-map"||e.type==="block-seq")&&(t.type==="block-map"||t.type==="block-seq")){const n=t.items[t.items.length-1];if(n&&!n.sep&&!n.value&&n.start.length>0&&findNonEmptyIndex(n.start)===-1&&(t.indent===0||n.start.every((e=>e.type!=="comment"||e.indent<t.indent)))){if(e.type==="document")e.end=n.start;else e.items.push({start:n.start});t.items.splice(-1,1)}}}}*stream(){switch(this.type){case"directive-line":yield{type:"directive",offset:this.offset,source:this.source};return;case"byte-order-mark":case"space":case"comment":case"newline":yield this.sourceToken;return;case"doc-mode":case"doc-start":{const e={type:"document",offset:this.offset,start:[]};if(this.type==="doc-start")e.start.push(this.sourceToken);this.stack.push(e);return}}yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case"doc-start":{if(findNonEmptyIndex(e.start)!==-1){yield*this.pop();yield*this.step()}else e.start.push(this.sourceToken);return}case"anchor":case"tag":case"space":case"comment":case"newline":e.start.push(this.sourceToken);return}const t=this.startBlockValue(e);if(t)this.stack.push(t);else{yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}}*scalar(e){if(this.type==="map-value-ind"){const t=getPrevProps(this.peek(2));const n=getFirstKeyStartProps(t);let s;if(e.end){s=e.end;s.push(this.sourceToken);delete e.end}else s=[this.sourceToken];const i={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:n,key:e,sep:s}]};this.onKeyLine=true;this.stack[this.stack.length-1]=i}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case"space":case"comment":case"newline":e.props.push(this.sourceToken);return;case"scalar":e.source=this.source;this.atNewLine=true;this.indent=0;if(this.onNewLine){let e=this.source.indexOf("\n")+1;while(e!==0){this.onNewLine(this.offset+e);e=this.source.indexOf("\n",e)+1}}yield*this.pop();break;default:yield*this.pop();yield*this.step()}}*blockMap(e){const t=e.items[e.items.length-1];switch(this.type){case"newline":this.onKeyLine=false;if(t.value){const n="end"in t.value?t.value.end:undefined;const s=Array.isArray(n)?n[n.length-1]:undefined;if(s?.type==="comment")n?.push(this.sourceToken);else e.items.push({start:[this.sourceToken]})}else if(t.sep){t.sep.push(this.sourceToken)}else{t.start.push(this.sourceToken)}return;case"space":case"comment":if(t.value){e.items.push({start:[this.sourceToken]})}else if(t.sep){t.sep.push(this.sourceToken)}else{if(this.atIndentedComment(t.start,e.indent)){const n=e.items[e.items.length-2];const s=n?.value?.end;if(Array.isArray(s)){Array.prototype.push.apply(s,t.start);s.push(this.sourceToken);e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){const n=!this.onKeyLine&&this.indent===e.indent&&t.sep;let s=[];if(n&&t.sep&&!t.value){const n=[];for(let s=0;s<t.sep.length;++s){const i=t.sep[s];switch(i.type){case"newline":n.push(s);break;case"space":break;case"comment":if(i.indent>e.indent)n.length=0;break;default:n.length=0}}if(n.length>=2)s=t.sep.splice(n[1])}switch(this.type){case"anchor":case"tag":if(n||t.value){s.push(this.sourceToken);e.items.push({start:s});this.onKeyLine=true}else if(t.sep){t.sep.push(this.sourceToken)}else{t.start.push(this.sourceToken)}return;case"explicit-key-ind":if(!t.sep&&!includesToken(t.start,"explicit-key-ind")){t.start.push(this.sourceToken)}else if(n||t.value){s.push(this.sourceToken);e.items.push({start:s})}else{this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]})}this.onKeyLine=true;return;case"map-value-ind":if(includesToken(t.start,"explicit-key-ind")){if(!t.sep){if(includesToken(t.start,"newline")){Object.assign(t,{key:null,sep:[this.sourceToken]})}else{const e=getFirstKeyStartProps(t.start);this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:e,key:null,sep:[this.sourceToken]}]})}}else if(t.value){e.items.push({start:[],key:null,sep:[this.sourceToken]})}else if(includesToken(t.sep,"map-value-ind")){this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:s,key:null,sep:[this.sourceToken]}]})}else if(isFlowToken(t.key)&&!includesToken(t.sep,"newline")){const e=getFirstKeyStartProps(t.start);const n=t.key;const s=t.sep;s.push(this.sourceToken);delete t.key,delete t.sep;this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:e,key:n,sep:s}]})}else if(s.length>0){t.sep=t.sep.concat(s,this.sourceToken)}else{t.sep.push(this.sourceToken)}}else{if(!t.sep){Object.assign(t,{key:null,sep:[this.sourceToken]})}else if(t.value||n){e.items.push({start:s,key:null,sep:[this.sourceToken]})}else if(includesToken(t.sep,"map-value-ind")){this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]})}else{t.sep.push(this.sourceToken)}}this.onKeyLine=true;return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{const i=this.flowScalar(this.type);if(n||t.value){e.items.push({start:s,key:i,sep:[]});this.onKeyLine=true}else if(t.sep){this.stack.push(i)}else{Object.assign(t,{key:i,sep:[]});this.onKeyLine=true}return}default:{const i=this.startBlockValue(e);if(i){if(n&&i.type!=="block-seq"&&includesToken(t.start,"explicit-key-ind")){e.items.push({start:s})}this.stack.push(i);return}}}}yield*this.pop();yield*this.step()}*blockSequence(e){const t=e.items[e.items.length-1];switch(this.type){case"newline":if(t.value){const n="end"in t.value?t.value.end:undefined;const s=Array.isArray(n)?n[n.length-1]:undefined;if(s?.type==="comment")n?.push(this.sourceToken);else e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){const n=e.items[e.items.length-2];const s=n?.value?.end;if(Array.isArray(s)){Array.prototype.push.apply(s,t.start);s.push(this.sourceToken);e.items.pop();return}}t.start.push(this.sourceToken)}return;case"anchor":case"tag":if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case"seq-item-ind":if(this.indent!==e.indent)break;if(t.value||includesToken(t.start,"seq-item-ind"))e.items.push({start:[this.sourceToken]});else t.start.push(this.sourceToken);return}if(this.indent>e.indent){const t=this.startBlockValue(e);if(t){this.stack.push(t);return}}yield*this.pop();yield*this.step()}*flowCollection(e){const t=e.items[e.items.length-1];if(this.type==="flow-error-end"){let e;do{yield*this.pop();e=this.peek(1)}while(e&&e.type==="flow-collection")}else if(e.end.length===0){switch(this.type){case"comma":case"explicit-key-ind":if(!t||t.sep)e.items.push({start:[this.sourceToken]});else t.start.push(this.sourceToken);return;case"map-value-ind":if(!t||t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else Object.assign(t,{key:null,sep:[this.sourceToken]});return;case"space":case"comment":case"newline":case"anchor":case"tag":if(!t||t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else t.start.push(this.sourceToken);return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{const n=this.flowScalar(this.type);if(!t||t.value)e.items.push({start:[],key:n,sep:[]});else if(t.sep)this.stack.push(n);else Object.assign(t,{key:n,sep:[]});return}case"flow-map-end":case"flow-seq-end":e.end.push(this.sourceToken);return}const n=this.startBlockValue(e);if(n)this.stack.push(n);else{yield*this.pop();yield*this.step()}}else{const t=this.peek(2);if(t.type==="block-map"&&(this.type==="map-value-ind"&&t.indent===e.indent||this.type==="newline"&&!t.items[t.items.length-1].sep)){yield*this.pop();yield*this.step()}else if(this.type==="map-value-ind"&&t.type!=="flow-collection"){const n=getPrevProps(t);const s=getFirstKeyStartProps(n);fixFlowSeqItems(e);const i=e.end.splice(1,e.end.length);i.push(this.sourceToken);const r={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:s,key:e,sep:i}]};this.onKeyLine=true;this.stack[this.stack.length-1]=r}else{yield*this.lineEnd(e)}}}flowScalar(e){if(this.onNewLine){let e=this.source.indexOf("\n")+1;while(e!==0){this.onNewLine(this.offset+e);e=this.source.indexOf("\n",e)+1}}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return this.flowScalar(this.type);case"block-scalar-header":return{type:"block-scalar",offset:this.offset,indent:this.indent,props:[this.sourceToken],source:""};case"flow-map-start":case"flow-seq-start":return{type:"flow-collection",offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case"seq-item-ind":return{type:"block-seq",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case"explicit-key-ind":{this.onKeyLine=true;const t=getPrevProps(e);const n=getFirstKeyStartProps(t);n.push(this.sourceToken);return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n}]}}case"map-value-ind":{this.onKeyLine=true;const t=getPrevProps(e);const n=getFirstKeyStartProps(t);return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){if(this.type!=="comment")return false;if(this.indent<=t)return false;return e.every((e=>e.type==="newline"||e.type==="space"))}*documentEnd(e){if(this.type!=="doc-mode"){if(e.end)e.end.push(this.sourceToken);else e.end=[this.sourceToken];if(this.type==="newline")yield*this.pop()}}*lineEnd(e){switch(this.type){case"comma":case"doc-start":case"doc-end":case"flow-seq-end":case"flow-map-end":case"map-value-ind":yield*this.pop();yield*this.step();break;case"newline":this.onKeyLine=false;case"space":case"comment":default:if(e.end)e.end.push(this.sourceToken);else e.end=[this.sourceToken];if(this.type==="newline")yield*this.pop()}}}t.Parser=Parser},8649:(e,t,n)=>{var s=n(9493);var i=n(42);var r=n(4236);var o=n(6909);var a=n(1929);var c=n(3328);function parseOptions(e){const t=e.prettyErrors!==false;const n=e.lineCounter||t&&new a.LineCounter||null;return{lineCounter:n,prettyErrors:t}}function parseAllDocuments(e,t={}){const{lineCounter:n,prettyErrors:i}=parseOptions(t);const o=new c.Parser(n?.addNewLine);const a=new s.Composer(t);const l=Array.from(a.compose(o.parse(e)));if(i&&n)for(const t of l){t.errors.forEach(r.prettifyError(e,n));t.warnings.forEach(r.prettifyError(e,n))}if(l.length>0)return l;return Object.assign([],{empty:true},a.streamInfo())}function parseDocument(e,t={}){const{lineCounter:n,prettyErrors:i}=parseOptions(t);const o=new c.Parser(n?.addNewLine);const a=new s.Composer(t);let l=null;for(const t of a.compose(o.parse(e),true,e.length)){if(!l)l=t;else if(l.options.logLevel!=="silent"){l.errors.push(new r.YAMLParseError(t.range.slice(0,2),"MULTIPLE_DOCS","Source contains multiple documents; please use YAML.parseAllDocuments()"));break}}if(i&&n){l.errors.forEach(r.prettifyError(e,n));l.warnings.forEach(r.prettifyError(e,n))}return l}function parse(e,t,n){let s=undefined;if(typeof t==="function"){s=t}else if(n===undefined&&t&&typeof t==="object"){n=t}const i=parseDocument(e,n);if(!i)return null;i.warnings.forEach((e=>o.warn(i.options.logLevel,e)));if(i.errors.length>0){if(i.options.logLevel!=="silent")throw i.errors[0];else i.errors=[]}return i.toJS(Object.assign({reviver:s},n))}function stringify(e,t,n){let s=null;if(typeof t==="function"||Array.isArray(t)){s=t}else if(n===undefined&&t){n=t}if(typeof n==="string")n=n.length;if(typeof n==="number"){const e=Math.round(n);n=e<1?undefined:e>8?{indent:8}:{indent:e}}if(e===undefined){const{keepUndefined:e}=n??t??{};if(!e)return undefined}return new i.Document(e,s,n).toString(n)}t.parse=parse;t.parseAllDocuments=parseAllDocuments;t.parseDocument=parseDocument;t.stringify=stringify},6831:(e,t,n)=>{var s=n(1399);var i=n(83);var r=n(1693);var o=n(2201);var a=n(4138);const sortMapEntriesByKey=(e,t)=>e.key<t.key?-1:e.key>t.key?1:0;class Schema{constructor({compat:e,customTags:t,merge:n,resolveKnownTags:c,schema:l,sortMapEntries:f,toStringDefaults:u}){this.compat=Array.isArray(e)?a.getTags(e,"compat"):e?a.getTags(null,e):null;this.merge=!!n;this.name=typeof l==="string"&&l||"core";this.knownTags=c?a.coreKnownTags:{};this.tags=a.getTags(t,this.name);this.toStringOptions=u??null;Object.defineProperty(this,s.MAP,{value:i.map});Object.defineProperty(this,s.SCALAR,{value:o.string});Object.defineProperty(this,s.SEQ,{value:r.seq});this.sortMapEntries=typeof f==="function"?f:f===true?sortMapEntriesByKey:null}clone(){const e=Object.create(Schema.prototype,Object.getOwnPropertyDescriptors(this));e.tags=this.tags.slice();return e}}t.Schema=Schema},83:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);function createMap(e,t,n){const{keepUndefined:s,replacer:o}=n;const a=new r.YAMLMap(e);const add=(e,r)=>{if(typeof o==="function")r=o.call(t,e,r);else if(Array.isArray(o)&&!o.includes(e))return;if(r!==undefined||s)a.items.push(i.createPair(e,r,n))};if(t instanceof Map){for(const[e,n]of t)add(e,n)}else if(t&&typeof t==="object"){for(const e of Object.keys(t))add(e,t[e])}if(typeof e.sortMapEntries==="function"){a.items.sort(e.sortMapEntries)}return a}const o={collection:"map",createNode:createMap,default:true,nodeClass:r.YAMLMap,tag:"tag:yaml.org,2002:map",resolve(e,t){if(!s.isMap(e))t("Expected a mapping for this tag");return e}};t.map=o},6703:(e,t,n)=>{var s=n(9338);const i={identify:e=>e==null,createNode:()=>new s.Scalar(null),default:true,tag:"tag:yaml.org,2002:null",test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new s.Scalar(null),stringify:({source:e},t)=>typeof e==="string"&&i.test.test(e)?e:t.options.nullStr};t.nullTag=i},1693:(e,t,n)=>{var s=n(9652);var i=n(1399);var r=n(5161);function createSeq(e,t,n){const{replacer:i}=n;const o=new r.YAMLSeq(e);if(t&&Symbol.iterator in Object(t)){let e=0;for(let r of t){if(typeof i==="function"){const n=t instanceof Set?r:String(e++);r=i.call(t,n,r)}o.items.push(s.createNode(r,undefined,n))}}return o}const o={collection:"seq",createNode:createSeq,default:true,nodeClass:r.YAMLSeq,tag:"tag:yaml.org,2002:seq",resolve(e,t){if(!i.isSeq(e))t("Expected a sequence for this tag");return e}};t.seq=o},2201:(e,t,n)=>{var s=n(6226);const i={identify:e=>typeof e==="string",default:true,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify(e,t,n,i){t=Object.assign({actualString:true},t);return s.stringifyString(e,t,n,i)}};t.string=i},2045:(e,t,n)=>{var s=n(9338);const i={identify:e=>typeof e==="boolean",default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:e=>new s.Scalar(e[0]==="t"||e[0]==="T"),stringify({source:e,value:t},n){if(e&&i.test.test(e)){const n=e[0]==="t"||e[0]==="T";if(t===n)return e}return t?n.options.trueStr:n.options.falseStr}};t.boolTag=i},6810:(e,t,n)=>{var s=n(9338);var i=n(4174);const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:i.stringifyNumber};const o={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e),stringify(e){const t=Number(e.value);return isFinite(t)?t.toExponential():i.stringifyNumber(e)}};const a={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(e){const t=new s.Scalar(parseFloat(e));const n=e.indexOf(".");if(n!==-1&&e[e.length-1]==="0")t.minFractionDigits=e.length-n-1;return t},stringify:i.stringifyNumber};t.float=a;t.floatExp=o;t.floatNaN=r},3019:(e,t,n)=>{var s=n(4174);const intIdentify=e=>typeof e==="bigint"||Number.isInteger(e);const intResolve=(e,t,n,{intAsBigInt:s})=>s?BigInt(e):parseInt(e.substring(t),n);function intStringify(e,t,n){const{value:i}=e;if(intIdentify(i)&&i>=0)return n+i.toString(t);return s.stringifyNumber(e)}const i={identify:e=>intIdentify(e)&&e>=0,default:true,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^0o[0-7]+$/,resolve:(e,t,n)=>intResolve(e,2,8,n),stringify:e=>intStringify(e,8,"0o")};const r={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9]+$/,resolve:(e,t,n)=>intResolve(e,0,10,n),stringify:s.stringifyNumber};const o={identify:e=>intIdentify(e)&&e>=0,default:true,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^0x[0-9a-fA-F]+$/,resolve:(e,t,n)=>intResolve(e,2,16,n),stringify:e=>intStringify(e,16,"0x")};t.int=r;t.intHex=o;t.intOct=i},27:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(2045);var c=n(6810);var l=n(3019);const f=[s.map,r.seq,o.string,i.nullTag,a.boolTag,l.intOct,l.int,l.intHex,c.floatNaN,c.floatExp,c.float];t.schema=f},4545:(e,t,n)=>{var s=n(9338);var i=n(83);var r=n(1693);function intIdentify(e){return typeof e==="bigint"||Number.isInteger(e)}const stringifyJSON=({value:e})=>JSON.stringify(e);const o=[{identify:e=>typeof e==="string",default:true,tag:"tag:yaml.org,2002:str",resolve:e=>e,stringify:stringifyJSON},{identify:e=>e==null,createNode:()=>new s.Scalar(null),default:true,tag:"tag:yaml.org,2002:null",test:/^null$/,resolve:()=>null,stringify:stringifyJSON},{identify:e=>typeof e==="boolean",default:true,tag:"tag:yaml.org,2002:bool",test:/^true|false$/,resolve:e=>e==="true",stringify:stringifyJSON},{identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:n})=>n?BigInt(e):parseInt(e,10),stringify:({value:e})=>intIdentify(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:stringifyJSON}];const a={default:true,tag:"",test:/^/,resolve(e,t){t(`Unresolved plain scalar ${JSON.stringify(e)}`);return e}};const c=[i.map,r.seq].concat(o,a);t.schema=c},4138:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(2045);var c=n(6810);var l=n(3019);var f=n(27);var u=n(4545);var d=n(5724);var h=n(8974);var p=n(9841);var m=n(5389);var y=n(7847);var g=n(1156);const v=new Map([["core",f.schema],["failsafe",[s.map,r.seq,o.string]],["json",u.schema],["yaml11",m.schema],["yaml-1.1",m.schema]]);const b={binary:d.binary,bool:a.boolTag,float:c.float,floatExp:c.floatExp,floatNaN:c.floatNaN,floatTime:g.floatTime,int:l.int,intHex:l.intHex,intOct:l.intOct,intTime:g.intTime,map:s.map,null:i.nullTag,omap:h.omap,pairs:p.pairs,seq:r.seq,set:y.set,timestamp:g.timestamp};const S={"tag:yaml.org,2002:binary":d.binary,"tag:yaml.org,2002:omap":h.omap,"tag:yaml.org,2002:pairs":p.pairs,"tag:yaml.org,2002:set":y.set,"tag:yaml.org,2002:timestamp":g.timestamp};function getTags(e,t){let n=v.get(t);if(!n){if(Array.isArray(e))n=[];else{const e=Array.from(v.keys()).filter((e=>e!=="yaml11")).map((e=>JSON.stringify(e))).join(", ");throw new Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`)}}if(Array.isArray(e)){for(const t of e)n=n.concat(t)}else if(typeof e==="function"){n=e(n.slice())}return n.map((e=>{if(typeof e!=="string")return e;const t=b[e];if(t)return t;const n=Object.keys(b).map((e=>JSON.stringify(e))).join(", ");throw new Error(`Unknown custom tag "${e}"; use one of ${n}`)}))}t.coreKnownTags=S;t.getTags=getTags},5724:(e,t,n)=>{var s=n(9338);var i=n(6226);const r={identify:e=>e instanceof Uint8Array,default:false,tag:"tag:yaml.org,2002:binary",resolve(e,t){if(typeof Buffer==="function"){return Buffer.from(e,"base64")}else if(typeof atob==="function"){const t=atob(e.replace(/[\n\r]/g,""));const n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}else{t("This environment does not support reading binary tags; either Buffer or atob is required");return e}},stringify({comment:e,type:t,value:n},r,o,a){const c=n;let l;if(typeof Buffer==="function"){l=c instanceof Buffer?c.toString("base64"):Buffer.from(c.buffer).toString("base64")}else if(typeof btoa==="function"){let e="";for(let t=0;t<c.length;++t)e+=String.fromCharCode(c[t]);l=btoa(e)}else{throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required")}if(!t)t=s.Scalar.BLOCK_LITERAL;if(t!==s.Scalar.QUOTE_DOUBLE){const e=Math.max(r.options.lineWidth-r.indent.length,r.options.minContentWidth);const n=Math.ceil(l.length/e);const i=new Array(n);for(let t=0,s=0;t<n;++t,s+=e){i[t]=l.substr(s,e)}l=i.join(t===s.Scalar.BLOCK_LITERAL?"\n":" ")}return i.stringifyString({comment:e,type:t,value:l},r,o,a)}};t.binary=r},2631:(e,t,n)=>{var s=n(9338);function boolStringify({value:e,source:t},n){const s=e?i:r;if(t&&s.test.test(t))return t;return e?n.options.trueStr:n.options.falseStr}const i={identify:e=>e===true,default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new s.Scalar(true),stringify:boolStringify};const r={identify:e=>e===false,default:true,tag:"tag:yaml.org,2002:bool",test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,resolve:()=>new s.Scalar(false),stringify:boolStringify};t.falseTag=r;t.trueTag=i},8035:(e,t,n)=>{var s=n(9338);var i=n(4174);const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,resolve:e=>e.slice(-3).toLowerCase()==="nan"?NaN:e[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:i.stringifyNumber};const o={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:e=>parseFloat(e.replace(/_/g,"")),stringify(e){const t=Number(e.value);return isFinite(t)?t.toExponential():i.stringifyNumber(e)}};const a={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(e){const t=new s.Scalar(parseFloat(e.replace(/_/g,"")));const n=e.indexOf(".");if(n!==-1){const s=e.substring(n+1).replace(/_/g,"");if(s[s.length-1]==="0")t.minFractionDigits=s.length}return t},stringify:i.stringifyNumber};t.float=a;t.floatExp=o;t.floatNaN=r},9503:(e,t,n)=>{var s=n(4174);const intIdentify=e=>typeof e==="bigint"||Number.isInteger(e);function intResolve(e,t,n,{intAsBigInt:s}){const i=e[0];if(i==="-"||i==="+")t+=1;e=e.substring(t).replace(/_/g,"");if(s){switch(n){case 2:e=`0b${e}`;break;case 8:e=`0o${e}`;break;case 16:e=`0x${e}`;break}const t=BigInt(e);return i==="-"?BigInt(-1)*t:t}const r=parseInt(e,n);return i==="-"?-1*r:r}function intStringify(e,t,n){const{value:i}=e;if(intIdentify(i)){const e=i.toString(t);return i<0?"-"+n+e.substr(1):n+e}return s.stringifyNumber(e)}const i={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"BIN",test:/^[-+]?0b[0-1_]+$/,resolve:(e,t,n)=>intResolve(e,2,2,n),stringify:e=>intStringify(e,2,"0b")};const r={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^[-+]?0[0-7_]+$/,resolve:(e,t,n)=>intResolve(e,1,8,n),stringify:e=>intStringify(e,8,"0")};const o={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9][0-9_]*$/,resolve:(e,t,n)=>intResolve(e,0,10,n),stringify:s.stringifyNumber};const a={identify:intIdentify,default:true,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(e,t,n)=>intResolve(e,2,16,n),stringify:e=>intStringify(e,16,"0x")};t.int=o;t.intBin=i;t.intHex=a;t.intOct=r},8974:(e,t,n)=>{var s=n(5161);var i=n(2463);var r=n(1399);var o=n(6011);var a=n(9841);class YAMLOMap extends s.YAMLSeq{constructor(){super();this.add=o.YAMLMap.prototype.add.bind(this);this.delete=o.YAMLMap.prototype.delete.bind(this);this.get=o.YAMLMap.prototype.get.bind(this);this.has=o.YAMLMap.prototype.has.bind(this);this.set=o.YAMLMap.prototype.set.bind(this);this.tag=YAMLOMap.tag}toJSON(e,t){if(!t)return super.toJSON(e);const n=new Map;if(t?.onCreate)t.onCreate(n);for(const e of this.items){let s,o;if(r.isPair(e)){s=i.toJS(e.key,"",t);o=i.toJS(e.value,s,t)}else{s=i.toJS(e,"",t)}if(n.has(s))throw new Error("Ordered maps must not include duplicate keys");n.set(s,o)}return n}}YAMLOMap.tag="tag:yaml.org,2002:omap";const c={collection:"seq",identify:e=>e instanceof Map,nodeClass:YAMLOMap,default:false,tag:"tag:yaml.org,2002:omap",resolve(e,t){const n=a.resolvePairs(e,t);const s=[];for(const{key:e}of n.items){if(r.isScalar(e)){if(s.includes(e.value)){t(`Ordered maps must not include duplicate keys: ${e.value}`)}else{s.push(e.value)}}}return Object.assign(new YAMLOMap,n)},createNode(e,t,n){const s=a.createPairs(e,t,n);const i=new YAMLOMap;i.items=s.items;return i}};t.YAMLOMap=YAMLOMap;t.omap=c},9841:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(9338);var o=n(5161);function resolvePairs(e,t){if(s.isSeq(e)){for(let n=0;n<e.items.length;++n){let o=e.items[n];if(s.isPair(o))continue;else if(s.isMap(o)){if(o.items.length>1)t("Each pair must have its own sequence indicator");const e=o.items[0]||new i.Pair(new r.Scalar(null));if(o.commentBefore)e.key.commentBefore=e.key.commentBefore?`${o.commentBefore}\n${e.key.commentBefore}`:o.commentBefore;if(o.comment){const t=e.value??e.key;t.comment=t.comment?`${o.comment}\n${t.comment}`:o.comment}o=e}e.items[n]=s.isPair(o)?o:new i.Pair(o)}}else t("Expected a sequence for this tag");return e}function createPairs(e,t,n){const{replacer:s}=n;const r=new o.YAMLSeq(e);r.tag="tag:yaml.org,2002:pairs";let a=0;if(t&&Symbol.iterator in Object(t))for(let e of t){if(typeof s==="function")e=s.call(t,String(a++),e);let o,c;if(Array.isArray(e)){if(e.length===2){o=e[0];c=e[1]}else throw new TypeError(`Expected [key, value] tuple: ${e}`)}else if(e&&e instanceof Object){const t=Object.keys(e);if(t.length===1){o=t[0];c=e[o]}else throw new TypeError(`Expected { key: value } tuple: ${e}`)}else{o=e}r.items.push(i.createPair(o,c,n))}return r}const a={collection:"seq",default:false,tag:"tag:yaml.org,2002:pairs",resolve:resolvePairs,createNode:createPairs};t.createPairs=createPairs;t.pairs=a;t.resolvePairs=resolvePairs},5389:(e,t,n)=>{var s=n(83);var i=n(6703);var r=n(1693);var o=n(2201);var a=n(5724);var c=n(2631);var l=n(8035);var f=n(9503);var u=n(8974);var d=n(9841);var h=n(7847);var p=n(1156);const m=[s.map,r.seq,o.string,i.nullTag,c.trueTag,c.falseTag,f.intBin,f.intOct,f.int,f.intHex,l.floatNaN,l.floatExp,l.float,a.binary,u.omap,d.pairs,h.set,p.intTime,p.floatTime,p.timestamp];t.schema=m},7847:(e,t,n)=>{var s=n(1399);var i=n(246);var r=n(6011);class YAMLSet extends r.YAMLMap{constructor(e){super(e);this.tag=YAMLSet.tag}add(e){let t;if(s.isPair(e))t=e;else if(e&&typeof e==="object"&&"key"in e&&"value"in e&&e.value===null)t=new i.Pair(e.key,null);else t=new i.Pair(e,null);const n=r.findPair(this.items,t.key);if(!n)this.items.push(t)}get(e,t){const n=r.findPair(this.items,e);return!t&&s.isPair(n)?s.isScalar(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!=="boolean")throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);const n=r.findPair(this.items,e);if(n&&!t){this.items.splice(this.items.indexOf(n),1)}else if(!n&&t){this.items.push(new i.Pair(e))}}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(true))return super.toString(Object.assign({},e,{allNullValues:true}),t,n);else throw new Error("Set items must all have null values")}}YAMLSet.tag="tag:yaml.org,2002:set";const o={collection:"map",identify:e=>e instanceof Set,nodeClass:YAMLSet,default:false,tag:"tag:yaml.org,2002:set",resolve(e,t){if(s.isMap(e)){if(e.hasAllNullValues(true))return Object.assign(new YAMLSet,e);else t("Set items must all have null values")}else t("Expected a mapping for this tag");return e},createNode(e,t,n){const{replacer:s}=n;const r=new YAMLSet(e);if(t&&Symbol.iterator in Object(t))for(let e of t){if(typeof s==="function")e=s.call(t,e,e);r.items.push(i.createPair(e,null,n))}return r}};t.YAMLSet=YAMLSet;t.set=o},1156:(e,t,n)=>{var s=n(4174);function parseSexagesimal(e,t){const n=e[0];const s=n==="-"||n==="+"?e.substring(1):e;const num=e=>t?BigInt(e):Number(e);const i=s.replace(/_/g,"").split(":").reduce(((e,t)=>e*num(60)+num(t)),num(0));return n==="-"?num(-1)*i:i}function stringifySexagesimal(e){let{value:t}=e;let num=e=>e;if(typeof t==="bigint")num=e=>BigInt(e);else if(isNaN(t)||!isFinite(t))return s.stringifyNumber(e);let n="";if(t<0){n="-";t*=num(-1)}const i=num(60);const r=[t%i];if(t<60){r.unshift(0)}else{t=(t-r[0])/i;r.unshift(t%i);if(t>=60){t=(t-r[0])/i;r.unshift(t)}}return n+r.map((e=>e<10?"0"+String(e):String(e))).join(":").replace(/000000\d*$/,"")}const i={identify:e=>typeof e==="bigint"||Number.isInteger(e),default:true,tag:"tag:yaml.org,2002:int",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(e,t,{intAsBigInt:n})=>parseSexagesimal(e,n),stringify:stringifySexagesimal};const r={identify:e=>typeof e==="number",default:true,tag:"tag:yaml.org,2002:float",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:e=>parseSexagesimal(e,false),stringify:stringifySexagesimal};const o={identify:e=>e instanceof Date,default:true,tag:"tag:yaml.org,2002:timestamp",test:RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})"+"(?:"+"(?:t|T|[ \\t]+)"+"([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)"+"(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?"+")?$"),resolve(e){const t=e.match(o.test);if(!t)throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");const[,n,s,i,r,a,c]=t.map(Number);const l=t[7]?Number((t[7]+"00").substr(1,3)):0;let f=Date.UTC(n,s-1,i,r||0,a||0,c||0,l);const u=t[8];if(u&&u!=="Z"){let e=parseSexagesimal(u,false);if(Math.abs(e)<30)e*=60;f-=6e4*e}return new Date(f)},stringify:({value:e})=>e.toISOString().replace(/((T00:00)?:00)?\.000Z$/,"")};t.floatTime=r;t.intTime=i;t.timestamp=o},2889:(e,t)=>{const n="flow";const s="block";const i="quoted";function foldFlowLines(e,t,n="flow",{indentAtStart:r,lineWidth:o=80,minContentWidth:a=20,onFold:c,onOverflow:l}={}){if(!o||o<0)return e;const f=Math.max(1+a,1+o-t.length);if(e.length<=f)return e;const u=[];const d={};let h=o-t.length;if(typeof r==="number"){if(r>o-Math.max(2,a))u.push(0);else h=o-r}let p=undefined;let m=undefined;let y=false;let g=-1;let v=-1;let b=-1;if(n===s){g=consumeMoreIndentedLines(e,g);if(g!==-1)h=g+f}for(let t;t=e[g+=1];){if(n===i&&t==="\\"){v=g;switch(e[g+1]){case"x":g+=3;break;case"u":g+=5;break;case"U":g+=9;break;default:g+=1}b=g}if(t==="\n"){if(n===s)g=consumeMoreIndentedLines(e,g);h=g+f;p=undefined}else{if(t===" "&&m&&m!==" "&&m!=="\n"&&m!=="\t"){const t=e[g+1];if(t&&t!==" "&&t!=="\n"&&t!=="\t")p=g}if(g>=h){if(p){u.push(p);h=p+f;p=undefined}else if(n===i){while(m===" "||m==="\t"){m=t;t=e[g+=1];y=true}const n=g>b+1?g-2:v-1;if(d[n])return e;u.push(n);d[n]=true;h=n+f;p=undefined}else{y=true}}}m=t}if(y&&l)l();if(u.length===0)return e;if(c)c();let S=e.slice(0,u[0]);for(let s=0;s<u.length;++s){const r=u[s];const o=u[s+1]||e.length;if(r===0)S=`\n${t}${e.slice(0,o)}`;else{if(n===i&&d[r])S+=`${e[r]}\\`;S+=`\n${t}${e.slice(r+1,o)}`}}return S}function consumeMoreIndentedLines(e,t){let n=e[t+1];while(n===" "||n==="\t"){do{n=e[t+=1]}while(n&&n!=="\n");n=e[t+1]}return t}t.FOLD_BLOCK=s;t.FOLD_FLOW=n;t.FOLD_QUOTED=i;t.foldFlowLines=foldFlowLines},8409:(e,t,n)=>{var s=n(8459);var i=n(1399);var r=n(5182);var o=n(6226);function createStringifyContext(e,t){const n=Object.assign({blockQuote:true,commentString:r.stringifyComment,defaultKeyType:null,defaultStringType:"PLAIN",directives:null,doubleQuotedAsJSON:false,doubleQuotedMinMultiLineLength:40,falseStr:"false",indentSeq:true,lineWidth:80,minContentWidth:20,nullStr:"null",simpleKeys:false,singleQuote:null,trueStr:"true",verifyAliasOrder:true},e.schema.toStringOptions,t);let s;switch(n.collectionStyle){case"block":s=false;break;case"flow":s=true;break;default:s=null}return{anchors:new Set,doc:e,indent:"",indentStep:typeof n.indent==="number"?" ".repeat(n.indent):"  ",inFlow:s,options:n}}function getTagObject(e,t){if(t.tag){const n=e.filter((e=>e.tag===t.tag));if(n.length>0)return n.find((e=>e.format===t.format))??n[0]}let n=undefined;let s;if(i.isScalar(t)){s=t.value;const i=e.filter((e=>e.identify?.(s)));n=i.find((e=>e.format===t.format))??i.find((e=>!e.format))}else{s=t;n=e.find((e=>e.nodeClass&&s instanceof e.nodeClass))}if(!n){const e=s?.constructor?.name??typeof s;throw new Error(`Tag not resolved for ${e} value`)}return n}function stringifyProps(e,t,{anchors:n,doc:r}){if(!r.directives)return"";const o=[];const a=(i.isScalar(e)||i.isCollection(e))&&e.anchor;if(a&&s.anchorIsValid(a)){n.add(a);o.push(`&${a}`)}const c=e.tag?e.tag:t.default?null:t.tag;if(c)o.push(r.directives.tagString(c));return o.join(" ")}function stringify(e,t,n,s){if(i.isPair(e))return e.toString(t,n,s);if(i.isAlias(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e)){throw new TypeError(`Cannot stringify circular structure without alias nodes`)}else{if(t.resolvedAliases)t.resolvedAliases.add(e);else t.resolvedAliases=new Set([e]);e=e.resolve(t.doc)}}let r=undefined;const a=i.isNode(e)?e:t.doc.createNode(e,{onTagObj:e=>r=e});if(!r)r=getTagObject(t.doc.schema.tags,a);const c=stringifyProps(a,r,t);if(c.length>0)t.indentAtStart=(t.indentAtStart??0)+c.length+1;const l=typeof r.stringify==="function"?r.stringify(a,t,n,s):i.isScalar(a)?o.stringifyString(a,t,n,s):a.toString(t,n,s);if(!c)return l;return i.isScalar(a)||l[0]==="{"||l[0]==="["?`${c} ${l}`:`${c}\n${t.indent}${l}`}t.createStringifyContext=createStringifyContext;t.stringify=stringify},2466:(e,t,n)=>{var s=n(3466);var i=n(1399);var r=n(8409);var o=n(5182);function stringifyCollection(e,t,n){const s=t.inFlow??e.flow;const i=s?stringifyFlowCollection:stringifyBlockCollection;return i(e,t,n)}function stringifyBlockCollection({comment:e,items:t},n,{blockItemPrefix:s,flowChars:a,itemIndent:c,onChompKeep:l,onComment:f}){const{indent:u,options:{commentString:d}}=n;const h=Object.assign({},n,{indent:c,type:null});let p=false;const m=[];for(let e=0;e<t.length;++e){const a=t[e];let l=null;if(i.isNode(a)){if(!p&&a.spaceBefore)m.push("");addCommentBefore(n,m,a.commentBefore,p);if(a.comment)l=a.comment}else if(i.isPair(a)){const e=i.isNode(a.key)?a.key:null;if(e){if(!p&&e.spaceBefore)m.push("");addCommentBefore(n,m,e.commentBefore,p)}}p=false;let f=r.stringify(a,h,(()=>l=null),(()=>p=true));if(l)f+=o.lineComment(f,c,d(l));if(p&&l)p=false;m.push(s+f)}let y;if(m.length===0){y=a.start+a.end}else{y=m[0];for(let e=1;e<m.length;++e){const t=m[e];y+=t?`\n${u}${t}`:"\n"}}if(e){y+="\n"+o.indentComment(d(e),u);if(f)f()}else if(p&&l)l();return y}function stringifyFlowCollection({comment:e,items:t},n,{flowChars:a,itemIndent:c,onComment:l}){const{indent:f,indentStep:u,options:{commentString:d}}=n;c+=u;const h=Object.assign({},n,{indent:c,inFlow:true,type:null});let p=false;let m=0;const y=[];for(let e=0;e<t.length;++e){const s=t[e];let a=null;if(i.isNode(s)){if(s.spaceBefore)y.push("");addCommentBefore(n,y,s.commentBefore,false);if(s.comment)a=s.comment}else if(i.isPair(s)){const e=i.isNode(s.key)?s.key:null;if(e){if(e.spaceBefore)y.push("");addCommentBefore(n,y,e.commentBefore,false);if(e.comment)p=true}const t=i.isNode(s.value)?s.value:null;if(t){if(t.comment)a=t.comment;if(t.commentBefore)p=true}else if(s.value==null&&e&&e.comment){a=e.comment}}if(a)p=true;let l=r.stringify(s,h,(()=>a=null));if(e<t.length-1)l+=",";if(a)l+=o.lineComment(l,c,d(a));if(!p&&(y.length>m||l.includes("\n")))p=true;y.push(l);m=y.length}let g;const{start:v,end:b}=a;if(y.length===0){g=v+b}else{if(!p){const e=y.reduce(((e,t)=>e+t.length+2),2);p=e>s.Collection.maxFlowStringSingleLineLength}if(p){g=v;for(const e of y)g+=e?`\n${u}${f}${e}`:"\n";g+=`\n${f}${b}`}else{g=`${v} ${y.join(" ")} ${b}`}}if(e){g+=o.lineComment(g,d(e),f);if(l)l()}return g}function addCommentBefore({indent:e,options:{commentString:t}},n,s,i){if(s&&i)s=s.replace(/^\n+/,"");if(s){const i=o.indentComment(t(s),e);n.push(i.trimStart())}}t.stringifyCollection=stringifyCollection},5182:(e,t)=>{const stringifyComment=e=>e.replace(/^(?!$)(?: $)?/gm,"#");function indentComment(e,t){if(/^\n+$/.test(e))return e.substring(1);return t?e.replace(/^(?! *$)/gm,t):e}const lineComment=(e,t,n)=>e.endsWith("\n")?indentComment(n,t):n.includes("\n")?"\n"+indentComment(n,t):(e.endsWith(" ")?"":" ")+n;t.indentComment=indentComment;t.lineComment=lineComment;t.stringifyComment=stringifyComment},5225:(e,t,n)=>{var s=n(1399);var i=n(8409);var r=n(5182);function stringifyDocument(e,t){const n=[];let o=t.directives===true;if(t.directives!==false&&e.directives){const t=e.directives.toString(e);if(t){n.push(t);o=true}else if(e.directives.docStart)o=true}if(o)n.push("---");const a=i.createStringifyContext(e,t);const{commentString:c}=a.options;if(e.commentBefore){if(n.length!==1)n.unshift("");const t=c(e.commentBefore);n.unshift(r.indentComment(t,""))}let l=false;let f=null;if(e.contents){if(s.isNode(e.contents)){if(e.contents.spaceBefore&&o)n.push("");if(e.contents.commentBefore){const t=c(e.contents.commentBefore);n.push(r.indentComment(t,""))}a.forceBlockIndent=!!e.comment;f=e.contents.comment}const t=f?undefined:()=>l=true;let u=i.stringify(e.contents,a,(()=>f=null),t);if(f)u+=r.lineComment(u,"",c(f));if((u[0]==="|"||u[0]===">")&&n[n.length-1]==="---"){n[n.length-1]=`--- ${u}`}else n.push(u)}else{n.push(i.stringify(e.contents,a))}if(e.directives?.docEnd){if(e.comment){const t=c(e.comment);if(t.includes("\n")){n.push("...");n.push(r.indentComment(t,""))}else{n.push(`... ${t}`)}}else{n.push("...")}}else{let t=e.comment;if(t&&l)t=t.replace(/^\n+/,"");if(t){if((!l||f)&&n[n.length-1]!=="")n.push("");n.push(r.indentComment(c(t),""))}}return n.join("\n")+"\n"}t.stringifyDocument=stringifyDocument},4174:(e,t)=>{function stringifyNumber({format:e,minFractionDigits:t,tag:n,value:s}){if(typeof s==="bigint")return String(s);const i=typeof s==="number"?s:Number(s);if(!isFinite(i))return isNaN(i)?".nan":i<0?"-.inf":".inf";let r=JSON.stringify(s);if(!e&&t&&(!n||n==="tag:yaml.org,2002:float")&&/^\d/.test(r)){let e=r.indexOf(".");if(e<0){e=r.length;r+="."}let n=t-(r.length-e-1);while(n-- >0)r+="0"}return r}t.stringifyNumber=stringifyNumber},4875:(e,t,n)=>{var s=n(1399);var i=n(9338);var r=n(8409);var o=n(5182);function stringifyPair({key:e,value:t},n,a,c){const{allNullValues:l,doc:f,indent:u,indentStep:d,options:{commentString:h,indentSeq:p,simpleKeys:m}}=n;let y=s.isNode(e)&&e.comment||null;if(m){if(y){throw new Error("With simple keys, key nodes cannot have comments")}if(s.isCollection(e)){const e="With simple keys, collection cannot be used as a key value";throw new Error(e)}}let g=!m&&(!e||y&&t==null&&!n.inFlow||s.isCollection(e)||(s.isScalar(e)?e.type===i.Scalar.BLOCK_FOLDED||e.type===i.Scalar.BLOCK_LITERAL:typeof e==="object"));n=Object.assign({},n,{allNullValues:false,implicitKey:!g&&(m||!l),indent:u+d});let v=false;let b=false;let S=r.stringify(e,n,(()=>v=true),(()=>b=true));if(!g&&!n.inFlow&&S.length>1024){if(m)throw new Error("With simple keys, single line scalar must not span more than 1024 characters");g=true}if(n.inFlow){if(l||t==null){if(v&&a)a();return S===""?"?":g?`? ${S}`:S}}else if(l&&!m||t==null&&g){S=`? ${S}`;if(y&&!v){S+=o.lineComment(S,n.indent,h(y))}else if(b&&c)c();return S}if(v)y=null;if(g){if(y)S+=o.lineComment(S,n.indent,h(y));S=`? ${S}\n${u}:`}else{S=`${S}:`;if(y)S+=o.lineComment(S,n.indent,h(y))}let w="";let k=null;if(s.isNode(t)){if(t.spaceBefore)w="\n";if(t.commentBefore){const e=h(t.commentBefore);w+=`\n${o.indentComment(e,n.indent)}`}k=t.comment}else if(t&&typeof t==="object"){t=f.createNode(t)}n.implicitKey=false;if(!g&&!y&&s.isScalar(t))n.indentAtStart=S.length+1;b=false;if(!p&&d.length>=2&&!n.inFlow&&!g&&s.isSeq(t)&&!t.flow&&!t.tag&&!t.anchor){n.indent=n.indent.substr(2)}let E=false;const A=r.stringify(t,n,(()=>E=true),(()=>b=true));let N=" ";if(w||y){if(A===""&&!n.inFlow)N=w==="\n"?"\n\n":w;else N=`${w}\n${n.indent}`}else if(!g&&s.isCollection(t)){const e=A[0]==="["||A[0]==="{";if(!e||A.includes("\n"))N=`\n${n.indent}`}else if(A===""||A[0]==="\n")N="";S+=N+A;if(n.inFlow){if(E&&a)a()}else if(k&&!E){S+=o.lineComment(S,n.indent,h(k))}else if(b&&c){c()}return S}t.stringifyPair=stringifyPair},6226:(e,t,n)=>{var s=n(9338);var i=n(2889);const getFoldOptions=e=>({indentAtStart:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth});const containsDocumentMarker=e=>/^(%|---|\.\.\.)/m.test(e);function lineLengthOverLimit(e,t,n){if(!t||t<0)return false;const s=t-n;const i=e.length;if(i<=s)return false;for(let t=0,n=0;t<i;++t){if(e[t]==="\n"){if(t-n>s)return true;n=t+1;if(i-n<=s)return false}}return true}function doubleQuotedString(e,t){const n=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return n;const{implicitKey:s}=t;const r=t.options.doubleQuotedMinMultiLineLength;const o=t.indent||(containsDocumentMarker(e)?"  ":"");let a="";let c=0;for(let e=0,t=n[e];t;t=n[++e]){if(t===" "&&n[e+1]==="\\"&&n[e+2]==="n"){a+=n.slice(c,e)+"\\ ";e+=1;c=e;t="\\"}if(t==="\\")switch(n[e+1]){case"u":{a+=n.slice(c,e);const t=n.substr(e+2,4);switch(t){case"0000":a+="\\0";break;case"0007":a+="\\a";break;case"000b":a+="\\v";break;case"001b":a+="\\e";break;case"0085":a+="\\N";break;case"00a0":a+="\\_";break;case"2028":a+="\\L";break;case"2029":a+="\\P";break;default:if(t.substr(0,2)==="00")a+="\\x"+t.substr(2);else a+=n.substr(e,6)}e+=5;c=e+1}break;case"n":if(s||n[e+2]==='"'||n.length<r){e+=1}else{a+=n.slice(c,e)+"\n\n";while(n[e+2]==="\\"&&n[e+3]==="n"&&n[e+4]!=='"'){a+="\n";e+=2}a+=o;if(n[e+2]===" ")a+="\\";e+=1;c=e+1}break;default:e+=1}}a=c?a+n.slice(c):n;return s?a:i.foldFlowLines(a,o,i.FOLD_QUOTED,getFoldOptions(t))}function singleQuotedString(e,t){if(t.options.singleQuote===false||t.implicitKey&&e.includes("\n")||/[ \t]\n|\n[ \t]/.test(e))return doubleQuotedString(e,t);const n=t.indent||(containsDocumentMarker(e)?"  ":"");const s="'"+e.replace(/'/g,"''").replace(/\n+/g,`$&\n${n}`)+"'";return t.implicitKey?s:i.foldFlowLines(s,n,i.FOLD_FLOW,getFoldOptions(t))}function quotedString(e,t){const{singleQuote:n}=t.options;let s;if(n===false)s=doubleQuotedString;else{const t=e.includes('"');const i=e.includes("'");if(t&&!i)s=singleQuotedString;else if(i&&!t)s=doubleQuotedString;else s=n?singleQuotedString:doubleQuotedString}return s(e,t)}function blockString({comment:e,type:t,value:n},r,o,a){const{blockQuote:c,commentString:l,lineWidth:f}=r.options;if(!c||/\n[\t ]+$/.test(n)||/^\s*$/.test(n)){return quotedString(n,r)}const u=r.indent||(r.forceBlockIndent||containsDocumentMarker(n)?"  ":"");const d=c==="literal"?true:c==="folded"||t===s.Scalar.BLOCK_FOLDED?false:t===s.Scalar.BLOCK_LITERAL?true:!lineLengthOverLimit(n,f,u.length);if(!n)return d?"|\n":">\n";let h;let p;for(p=n.length;p>0;--p){const e=n[p-1];if(e!=="\n"&&e!=="\t"&&e!==" ")break}let m=n.substring(p);const y=m.indexOf("\n");if(y===-1){h="-"}else if(n===m||y!==m.length-1){h="+";if(a)a()}else{h=""}if(m){n=n.slice(0,-m.length);if(m[m.length-1]==="\n")m=m.slice(0,-1);m=m.replace(/\n+(?!\n|$)/g,`$&${u}`)}let g=false;let v;let b=-1;for(v=0;v<n.length;++v){const e=n[v];if(e===" ")g=true;else if(e==="\n")b=v;else break}let S=n.substring(0,b<v?b+1:v);if(S){n=n.substring(S.length);S=S.replace(/\n+/g,`$&${u}`)}const w=u?"2":"1";let k=(d?"|":">")+(g?w:"")+h;if(e){k+=" "+l(e.replace(/ ?[\r\n]+/g," "));if(o)o()}if(d){n=n.replace(/\n+/g,`$&${u}`);return`${k}\n${u}${S}${n}${m}`}n=n.replace(/\n+/g,"\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,"$1$2").replace(/\n+/g,`$&${u}`);const E=i.foldFlowLines(`${S}${n}${m}`,u,i.FOLD_BLOCK,getFoldOptions(r));return`${k}\n${u}${E}`}function plainString(e,t,n,r){const{type:o,value:a}=e;const{actualString:c,implicitKey:l,indent:f,inFlow:u}=t;if(l&&/[\n[\]{},]/.test(a)||u&&/[[\]{},]/.test(a)){return quotedString(a,t)}if(!a||/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)){return l||u||!a.includes("\n")?quotedString(a,t):blockString(e,t,n,r)}if(!l&&!u&&o!==s.Scalar.PLAIN&&a.includes("\n")){return blockString(e,t,n,r)}if(f===""&&containsDocumentMarker(a)){t.forceBlockIndent=true;return blockString(e,t,n,r)}const d=a.replace(/\n+/g,`$&\n${f}`);if(c){const test=e=>e.default&&e.tag!=="tag:yaml.org,2002:str"&&e.test?.test(d);const{compat:e,tags:n}=t.doc.schema;if(n.some(test)||e?.some(test))return quotedString(a,t)}return l?d:i.foldFlowLines(d,f,i.FOLD_FLOW,getFoldOptions(t))}function stringifyString(e,t,n,i){const{implicitKey:r,inFlow:o}=t;const a=typeof e.value==="string"?e:Object.assign({},e,{value:String(e.value)});let{type:c}=e;if(c!==s.Scalar.QUOTE_DOUBLE){if(/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(a.value))c=s.Scalar.QUOTE_DOUBLE}const _stringify=e=>{switch(e){case s.Scalar.BLOCK_FOLDED:case s.Scalar.BLOCK_LITERAL:return r||o?quotedString(a.value,t):blockString(a,t,n,i);case s.Scalar.QUOTE_DOUBLE:return doubleQuotedString(a.value,t);case s.Scalar.QUOTE_SINGLE:return singleQuotedString(a.value,t);case s.Scalar.PLAIN:return plainString(a,t,n,i);default:return null}};let l=_stringify(c);if(l===null){const{defaultKeyType:e,defaultStringType:n}=t.options;const s=r&&e||n;l=_stringify(s);if(l===null)throw new Error(`Unsupported default string type ${s}`)}return l}t.stringifyString=stringifyString},6796:(e,t,n)=>{var s=n(1399);const i=Symbol("break visit");const r=Symbol("skip children");const o=Symbol("remove node");function visit(e,t){const n=initVisitor(t);if(s.isDocument(e)){const t=visit_(null,e.contents,n,Object.freeze([e]));if(t===o)e.contents=null}else visit_(null,e,n,Object.freeze([]))}visit.BREAK=i;visit.SKIP=r;visit.REMOVE=o;function visit_(e,t,n,r){const a=callVisitor(e,t,n,r);if(s.isNode(a)||s.isPair(a)){replaceNode(e,r,a);return visit_(e,a,n,r)}if(typeof a!=="symbol"){if(s.isCollection(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){const s=visit_(e,t.items[e],n,r);if(typeof s==="number")e=s-1;else if(s===i)return i;else if(s===o){t.items.splice(e,1);e-=1}}}else if(s.isPair(t)){r=Object.freeze(r.concat(t));const e=visit_("key",t.key,n,r);if(e===i)return i;else if(e===o)t.key=null;const s=visit_("value",t.value,n,r);if(s===i)return i;else if(s===o)t.value=null}}return a}async function visitAsync(e,t){const n=initVisitor(t);if(s.isDocument(e)){const t=await visitAsync_(null,e.contents,n,Object.freeze([e]));if(t===o)e.contents=null}else await visitAsync_(null,e,n,Object.freeze([]))}visitAsync.BREAK=i;visitAsync.SKIP=r;visitAsync.REMOVE=o;async function visitAsync_(e,t,n,r){const a=await callVisitor(e,t,n,r);if(s.isNode(a)||s.isPair(a)){replaceNode(e,r,a);return visitAsync_(e,a,n,r)}if(typeof a!=="symbol"){if(s.isCollection(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){const s=await visitAsync_(e,t.items[e],n,r);if(typeof s==="number")e=s-1;else if(s===i)return i;else if(s===o){t.items.splice(e,1);e-=1}}}else if(s.isPair(t)){r=Object.freeze(r.concat(t));const e=await visitAsync_("key",t.key,n,r);if(e===i)return i;else if(e===o)t.key=null;const s=await visitAsync_("value",t.value,n,r);if(s===i)return i;else if(s===o)t.value=null}}return a}function initVisitor(e){if(typeof e==="object"&&(e.Collection||e.Node||e.Value)){return Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e)}return e}function callVisitor(e,t,n,i){if(typeof n==="function")return n(e,t,i);if(s.isMap(t))return n.Map?.(e,t,i);if(s.isSeq(t))return n.Seq?.(e,t,i);if(s.isPair(t))return n.Pair?.(e,t,i);if(s.isScalar(t))return n.Scalar?.(e,t,i);if(s.isAlias(t))return n.Alias?.(e,t,i);return undefined}function replaceNode(e,t,n){const i=t[t.length-1];if(s.isCollection(i)){i.items[e]=n}else if(s.isPair(i)){if(e==="key")i.key=n;else i.value=n}else if(s.isDocument(i)){i.contents=n}else{const e=s.isAlias(i)?"alias":"scalar";throw new Error(`Cannot replace node with ${e} parent`)}}t.visit=visit;t.visitAsync=visitAsync}};var t={};function __nccwpck_require2_(n){var s=t[n];if(s!==undefined){return s.exports}var i=t[n]={exports:{}};var r=true;try{e[n].call(i.exports,i,i.exports,__nccwpck_require2_);r=false}finally{if(r)delete t[n]}return i.exports}if(typeof __nccwpck_require2_!=="undefined")__nccwpck_require2_.ab=__dirname+"/";var n=__nccwpck_require2_(6144);module.exports=n})();
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5911:
/***/ ((module, exports) => {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 208:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021 Google LLC
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadAndExtractTool = void 0;
/**
 * Contains download utility functions.
 */
const toolCache = __importStar(__nccwpck_require__(7784));
const index_1 = __nccwpck_require__(6144);
/**
 * Downloads and extracts the tool at the specified URL.
 *
 * @url The URL of the tool to be downloaded.
 * @returns The path to the locally extracted tool.
 */
function downloadAndExtractTool(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadPath = yield toolCache.downloadTool(url, undefined, undefined, {
            'User-Agent': index_1.userAgentString,
        });
        let extractedPath;
        if (url.indexOf('.zip') != -1) {
            extractedPath = yield toolCache.extractZip(downloadPath);
        }
        else if (url.indexOf('.tar.gz') != -1) {
            extractedPath = yield toolCache.extractTar(downloadPath);
        }
        else if (url.indexOf('.7z') != -1) {
            extractedPath = yield toolCache.extract7z(downloadPath);
        }
        else {
            throw new Error(`Unexpected download archive type, downloadPath: ${downloadPath}`);
        }
        return extractedPath;
    });
}
exports.downloadAndExtractTool = downloadAndExtractTool;


/***/ }),

/***/ 3844:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2021 Google LLC
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildReleaseURL = void 0;
// archMap is a mapping of how node detects an operating system to the
// associated cloud sdk architecture value.
const archMap = {
    x64: 'x86_64',
    arm64: 'arm',
};
/**
 * buildReleaseURL builds the URL at which to dowbnload the gcloud SDK,
 * according to the specified arguments.
 *
 * @param os The OS of the requested release.
 * @param arch The system architecture of the requested release.
 * @param version The version of the requested release.
 * @returns The formatted gcloud SDK release URL.
 */
function buildReleaseURL(os, arch, version) {
    // massage the arch to match gcloud sdk conventions
    if (archMap[arch]) {
        arch = archMap[arch];
    }
    let objectName;
    switch (os) {
        case 'linux':
            objectName = `google-cloud-sdk-${version}-linux-${arch}.tar.gz`;
            break;
        case 'darwin':
            objectName = `google-cloud-sdk-${version}-darwin-${arch}.tar.gz`;
            break;
        case 'win32':
            objectName = `google-cloud-sdk-${version}-windows-${arch}.zip`;
            break;
        default:
            throw new Error(`Unexpected OS '${os}'`);
    }
    return `https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${encodeURI(objectName)}`;
}
exports.buildReleaseURL = buildReleaseURL;


/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021 Google LLC
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLatestGcloudSDKVersion = exports.installComponent = exports.setProject = exports.authenticateGcloudSDK = exports.installGcloudSDK = exports.isAuthenticated = exports.isProjectIdSet = exports.gcloudRunJSON = exports.gcloudRun = exports.getToolCommand = exports.isInstalled = exports.userAgentString = void 0;
const path = __importStar(__nccwpck_require__(1017));
const os = __importStar(__nccwpck_require__(2037));
const exec_1 = __nccwpck_require__(1514);
const http_client_1 = __nccwpck_require__(6255);
const core = __importStar(__nccwpck_require__(2186));
const toolCache = __importStar(__nccwpck_require__(7784));
const actions_utils_1 = __nccwpck_require__(308);
const format_url_1 = __nccwpck_require__(3844);
const download_util_1 = __nccwpck_require__(208);
// Do not listen to the linter - this can NOT be rewritten as an ES6 import statement.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: appVersion } = __nccwpck_require__(4147);
/**
 * userAgentString is the UA to use for this installation. It dynamically pulls
 * the app version from the package declaration.
 */
exports.userAgentString = `google-github-actions:setup-cloud-sdk/${appVersion}`;
/**
 * Checks if gcloud is installed.
 *
 * @param version - (Optional) Cloud SDK version.
 * @returns true if gcloud is found in toolpath.
 */
function isInstalled(version) {
    let toolPath;
    if (version) {
        toolPath = toolCache.find('gcloud', version);
        return toolPath != undefined && toolPath !== '';
    }
    toolPath = toolCache.findAllVersions('gcloud');
    return toolPath.length > 0;
}
exports.isInstalled = isInstalled;
/**
 * Returns the correct gcloud command for OS.
 *
 * @returns gcloud command.
 */
function getToolCommand() {
    // A workaround for https://github.com/actions/toolkit/issues/229
    // Currently exec on windows runs as cmd shell.
    let toolCommand = 'gcloud';
    if (process.platform == 'win32') {
        toolCommand = 'gcloud.cmd';
    }
    return toolCommand;
}
exports.getToolCommand = getToolCommand;
/**
 * gcloudRun executes the given gcloud command using actions/exec under the
 * hood. It handles non-zero exit codes and throws a more semantic error on
 * failure.
 *
 * @param cmd The command to run.
 * @param options Any options.
 *
 * @return ExecOutput
 */
function gcloudRun(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const toolCommand = getToolCommand();
        const opts = Object.assign({}, { silent: true, ignoreReturnCode: true }, options);
        const commandString = `${toolCommand} ${cmd.join(' ')}`;
        core.debug(`Running command: ${commandString}`);
        const result = yield (0, exec_1.getExecOutput)(toolCommand, cmd, opts);
        if (result.exitCode !== 0) {
            const errMsg = result.stderr || `command exited ${result.exitCode}, but stderr had no output`;
            throw new Error(`failed to execute command \`${commandString}\`: ${errMsg}`);
        }
        return {
            stderr: result.stderr,
            stdout: result.stdout,
            output: result.stdout + '\n' + result.stderr,
        };
    });
}
exports.gcloudRun = gcloudRun;
/**
 * gcloudRunJSON runs the gcloud command with JSON output and parses the result
 * as JSON. If the parsing fails, it throws an error.
 *
 * @param cmd The command to run.
 * @param options Any options.
 *
 * @return Parsed JSON as an object (or array).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gcloudRunJSON(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonCmd = ['--format', 'json'].concat(cmd);
        const output = yield gcloudRun(jsonCmd, options);
        try {
            const parsed = JSON.parse(output.stdout);
            return parsed;
        }
        catch (err) {
            throw new Error(`failed to parse output as JSON: ${err}\n\nstdout:\n${output.stdout}\n\nstderr:\n${output.stderr}`);
        }
    });
}
exports.gcloudRunJSON = gcloudRunJSON;
/**
 * Checks if the project Id is set in the gcloud config.
 *
 * @returns true is project Id is set.
 */
function isProjectIdSet() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield gcloudRun(['config', 'get-value', 'project']);
        return !result.output.includes('unset');
    });
}
exports.isProjectIdSet = isProjectIdSet;
/**
 * Checks if gcloud is authenticated.
 *
 * @returns true is gcloud is authenticated.
 */
function isAuthenticated() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield gcloudRun(['auth', 'list']);
        return !result.output.includes('No credentialed accounts.');
    });
}
exports.isAuthenticated = isAuthenticated;
/**
 * Installs the gcloud SDK into the actions environment.
 *
 * @param version - The version being installed.
 * @returns The path of the installed tool.
 */
function installGcloudSDK(version) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrieve the release corresponding to the specified version and OS
        const osPlat = os.platform();
        const osArch = os.arch();
        const url = (0, format_url_1.buildReleaseURL)(osPlat, osArch, version);
        // Download and extract the release
        const extPath = yield (0, download_util_1.downloadAndExtractTool)(url);
        if (!extPath) {
            throw new Error(`Failed to download release, url: ${url}`);
        }
        // Install the downloaded release into the github action env
        const toolRoot = path.join(extPath, 'google-cloud-sdk');
        let toolPath = yield toolCache.cacheDir(toolRoot, 'gcloud', version);
        toolPath = path.join(toolPath, 'bin');
        core.addPath(toolPath);
        return toolPath;
    });
}
exports.installGcloudSDK = installGcloudSDK;
/**
 * Authenticates the gcloud tool using the provided credentials file.
 *
 * @param filepath - Path to the credentials file.
 */
function authenticateGcloudSDK(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield gcloudRun(['--quiet', 'auth', 'login', '--force', '--cred-file', filepath]);
    });
}
exports.authenticateGcloudSDK = authenticateGcloudSDK;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
function setProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield gcloudRun(['--quiet', 'config', 'set', 'project', projectId]);
    });
}
exports.setProject = setProject;
/**
 * Install a Cloud SDK component.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
function installComponent(component) {
    return __awaiter(this, void 0, void 0, function* () {
        let cmd = ['--quiet', 'components', 'install'];
        if (Array.isArray(component)) {
            cmd = cmd.concat(component);
        }
        else {
            cmd.push(component);
        }
        yield gcloudRun(cmd);
    });
}
exports.installComponent = installComponent;
/**
 * getLatestGcloudSDKVersion fetches the latest version number from the API.
 *
 * @returns The latest stable version of the gcloud SDK.
 */
function getLatestGcloudSDKVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://dl.google.com/dl/cloudsdk/channels/rapid/components-2.json';
        try {
            const http = new http_client_1.HttpClient(exports.userAgentString, undefined, { allowRetries: true, maxRetries: 3 });
            const res = yield http.get(url);
            const body = yield res.readBody();
            const statusCode = res.message.statusCode || 500;
            if (statusCode >= 400) {
                throw new Error(`(${statusCode}) ${body}`);
            }
            const parsed = JSON.parse(body);
            if (!parsed.version) {
                throw new Error(`invalid response - ${body}`);
            }
            return parsed.version;
        }
        catch (err) {
            const msg = (0, actions_utils_1.errorMessage)(err);
            throw new Error(`failed to retrieve gcloud SDK version from ${url}: ${msg}`);
        }
    });
}
exports.getLatestGcloudSDKVersion = getLatestGcloudSDKVersion;
__exportStar(__nccwpck_require__(7245), exports);


/***/ }),

/***/ 7245:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/*
 * Copyright 2021 Google LLC
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _TestToolCache_originalToolsDir, _TestToolCache_originalTempDir;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TEST_SA_KEY_CREDS_FILE = exports.TEST_WIF_CREDS_FILE = exports.TEST_SDK_VERSION = exports.TEST_SDK_VERSIONS = exports.TestToolCache = void 0;
/**
 * A collection of utility functions for testing.
 */
const path = __importStar(__nccwpck_require__(1017));
const fs = __importStar(__nccwpck_require__(3292));
const actions_utils_1 = __nccwpck_require__(308);
/**
 * Creates an overridden runner cache and tool path. This is slightly
 * complicated by the fact that the runner initializes its cache path exactly
 * once at startup, so this must be imported and called BEFORE the toolcache is
 * used.
 */
class TestToolCache {
    /**
     * Creates temporary directories for the runner cache and temp.
     */
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rootDir = path.join(__dirname, 'runner', (0, actions_utils_1.randomFilename)());
            this.toolsDir = path.join(this.rootDir, 'tools');
            yield fs.mkdir(this.toolsDir, { recursive: true });
            process.env.RUNNER_TOOL_CACHE = this.toolsDir;
            this.tempDir = path.join(this.rootDir, 'temp');
            yield fs.mkdir(this.tempDir, { recursive: true });
            process.env.RUNNER_TEMP = this.toolsDir;
            __classPrivateFieldSet(this, _a, process.env.RUNNER_TOOL_CACHE, "f", _TestToolCache_originalToolsDir);
            __classPrivateFieldSet(this, _a, process.env.RUNNER_TEMP, "f", _TestToolCache_originalTempDir);
        });
    }
    /**
     * Restores the Action's runner to use the original directories and deletes
     * the temporary files.
     **/
    static stop() {
        return __awaiter(this, void 0, void 0, function* () {
            process.env.RUNNER_TOOL_CACHE = __classPrivateFieldGet(this, _a, "f", _TestToolCache_originalToolsDir);
            process.env.RUNNER_TEMP = __classPrivateFieldGet(this, _a, "f", _TestToolCache_originalTempDir);
            yield (0, actions_utils_1.forceRemove)(this.rootDir);
        });
    }
}
exports.TestToolCache = TestToolCache;
_a = TestToolCache;
_TestToolCache_originalToolsDir = { value: void 0 };
_TestToolCache_originalTempDir = { value: void 0 };
/**
 * The version of the gcloud SDK being tested against.
 */
exports.TEST_SDK_VERSIONS = ['0.9.83', '270.0.0', '272.0.0', '275.0.0', '349.0.0'];
exports.TEST_SDK_VERSION = exports.TEST_SDK_VERSIONS[exports.TEST_SDK_VERSIONS.length - 1];
exports.TEST_WIF_CREDS_FILE = `
{
  "audience": "//iam.googleapis.com/my-provider",
  "credential_source": {
    "format": {
      "subject_token_field_name": "value",
      "type": "json"
    },
    "headers": {
      "Authorization": "Bearer github-token"
    },
    "url": "https://actions-token.url/?audience=my-aud"
  },
  "service_account_impersonation_url": "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/my-service@my-project.iam.gserviceaccount.com:generateAccessToken",
  "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
  "token_url": "https://sts.googleapis.com/v1/token",
  "type": "external_account"
}
`;
exports.TEST_SA_KEY_CREDS_FILE = `
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "1234567890abcdefghijklmnopqrstuvwxyzaabb",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCRVYIJRuxdujaX\\nUfyY9mXT1O0M3PwyT+FnPJVY+6Md7KMiPKpZRYt7okj51Ln1FLcb9mY17LzPEAxS\\nBPn1LWNpSJpmttI/D3U+bG/znf/E89ErVopYWpaynbYrb/Mu478IE9TgvnqJMlkj\\nlQbaxnZ7qhnbI5h6p/HINWfY7xBDGZM1sc2FK9KbNfEzLdW1YiK/lWAwtfM7rbiO\\nZj+LnWm2dgwZxu0h8m68qYYMywzLcV3NTe35qdAznasc1WQvJikY+N82Wu+HjsPa\\nH0fLE3gN5r+BzDYQxEQnWANgxlsHeN9mg5LAg5fyTBwTS7Ato/qQ07da0CSoS1M0\\nriYvuCzhAgMBAAECggEAAai+m9fG5B03kIMLpY5O7Rv9AM+ufb91hx6Nwkp7r4M5\\nt11vY7I96wuYJ92iBu8m4XR6fGw0Xz3gkcQ69ZCu5320hBdPrJsrqXwMhgxgoGcq\\nWuB8aJEWASi+T9hGENA++eDQFMupWV6HafzCdxd4NKAfmZ/xf1OFUu0TVpvxKlAD\\ne6Njz/5+QFdUcNioi7iGy1Qz7xdpClEWdVin8VWe3p6UsCLfHmQfPPuLXOvpBj6k\\niFu9dl93z+8vlDLoAyXSaDeYyRMBGVOBM36cICuVpxfV1s/corEZXhz3aI8mlYiQ\\n6YXTcEnllt+NTJDIL99CnYn+WBVzeIGXtr0EKAyM6QKBgQDCU6FDvU0P8qt45BDm\\nSP2V7uMoI32mjEA3plJzqqSZ9ritxFmylrOttOoTYH2FVjrKPZZsLihSjpmm+wEz\\nGfjd75eSJYAb/m7GNOqbJjqAJIbIMaHfVcH6ODT2b0Tc8v/CK0PZy/jzgt68TdtF\\no462tr8isj7yLpCGdoLq9iq4gwKBgQC/dWTGFnaI08v1uqx6derf+qikSsjlYh4L\\nDdTlI8/eaTR90PFPQ4a8LE8pmhMhkJNg87jAF5VF29sPmlpfKbOC87C2iI8uIHcn\\nu0sTdhn6SukyUSN/eeb1KSDJuxDvIgPRTZj6XMlUulADeLRnlAoWOe0tu/wqpse6\\nB0Qu2oAfywKBgQCMWukESyro1OZit585JQj7jQJG0HOFopETYK722g5vIdM7trDu\\nm4iFc0EJ48xlTOXDgv4tfp0jG9oA0BSKuzyT1+RK64j/LyMFR90XWGIyga9T0v1O\\nmNs1BfnC8JT1XRG7RZKJMZjLEQAdU8KHJt4CPDYLMmDifR1n8RsX59rtTwKBgQCS\\nnAmsKn1gb5cqt2Tmba+LDj3feSj3hjftTQ0u3kqKTNOWWM7AXLwrEl8YQ1TNChHh\\nVyCtcCGtmhrYiuETKDK/X259iHrj3paABUsLPw/Le1uxXTKqpiV2rKTf9XCVPd3g\\ng+RWK4E8cWNeFStIebNzq630rJP/8TDWQkQzALzGGwKBgQC5bnlmipIGhtX2pP92\\niBM8fJC7QXbyYyamriyFjC3o250hHy7mZZG7bd0bH3gw0NdC+OZIBNv7AoNhjsvP\\nuE0Qp/vQXpgHEeYFyfWn6PyHGzqKLFMZ/+iCTuy8Iebs1p5DZY8RMXpx4tv6NfRy\\nbxHUjlOgP7xmXM+OZpNymFlRkg==\\n-----END PRIVATE KEY-----\\n",
  "client_email": "my-service-account@my-project.iam.gserviceaccount.com",
  "client_id": "123456789098765432101",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40my-project.iam.gserviceaccount.com"
}
`;


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 4655:
/***/ ((module) => {

"use strict";
module.exports = require("v8");

/***/ }),

/***/ 4147:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@google-github-actions/setup-cloud-sdk","version":"1.0.0","description":"Utilities to download, install and interact with the Cloud SDK for GitHub Actions","module":"dist/index.js","main":"dist/index.js","types":"dist/index.d.js","scripts":{"build":"rm -rf dist/ && ncc build --source-map --no-source-map-register src/index.ts","lint":"eslint . --ext .ts,.tsx","format":"prettier --write **/*.ts","docs":"rm -rf docs/ && typedoc","test":"mocha -r ts-node/register -t 600s \'tests/*.ts\' --exit"},"files":["dist/**/*"],"repository":{"type":"git","url":"https://github.com/google-github-actions/setup-cloud-sdk"},"keywords":["Cloud SDK","google cloud","gcloud"],"author":"Google LLC","license":"Apache-2.0","dependencies":{"@actions/core":"^1.10.0","@actions/exec":"^1.1.1","@actions/http-client":"^2.0.1","@actions/tool-cache":"^2.0.1","@google-github-actions/actions-utils":"^0.4.3"},"devDependencies":{"@types/chai":"^4.3.x","@types/mocha":"^10.0.0","@types/node":"^18.8.5","@types/sinon":"^10.0.13","@typescript-eslint/eslint-plugin":"^5.40.0","@typescript-eslint/parser":"^5.40.0","@vercel/ncc":"^0.34.0","chai":"^4.3.x","eslint":"^8.25.0","eslint-config-prettier":"^8.5.0","eslint-plugin-prettier":"^4.2.1","mocha":"^10.0.0","prettier":"^2.7.1","sinon":"^14.0.1","ts-node":"^10.9.1","typedoc":"^0.23.16","typedoc-plugin-markdown":"^3.13.6","typescript":"^4.8.4"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(6144);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map