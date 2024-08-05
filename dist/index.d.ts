import { ExecOptions as ActionsExecOptions } from '@actions/exec/lib/interfaces';
/**
 * userAgentString is the UA to use for this installation. It dynamically pulls
 * the app version from the package declaration.
 */
export declare const userAgentString: string;
/**
 * Checks if gcloud is installed.
 *
 * @param version - (Optional) Cloud SDK version.
 * @returns true if gcloud is found in toolpath.
 */
export declare function isInstalled(version?: string): boolean;
/**
 * Returns the correct gcloud command for OS.
 *
 * @returns gcloud command.
 */
export declare function getToolCommand(): string;
/**
 * ExecOptions is a type alias to core/exec ExecOptions.
 */
export type ExecOptions = ActionsExecOptions;
/**
 * ExecOutput is the output returned from a gcloud exec.
 */
export type ExecOutput = {
    stderr: string;
    stdout: string;
    output: string;
};
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
export declare function gcloudRun(cmd: string[], options?: ExecOptions): Promise<ExecOutput>;
/**
 * gcloudRunJSON runs the gcloud command with JSON output and parses the result
 * as JSON. If the parsing fails, it throws an error.
 *
 * @param cmd The command to run.
 * @param options Any options.
 *
 * @return Parsed JSON as an object (or array).
 */
export declare function gcloudRunJSON(cmd: string[], options?: ExecOptions): Promise<any>;
/**
 * Checks if the project Id is set in the gcloud config.
 *
 * @returns true is project Id is set.
 */
export declare function isProjectIdSet(): Promise<boolean>;
/**
 * Checks if gcloud is authenticated.
 *
 * @returns true is gcloud is authenticated.
 */
export declare function isAuthenticated(): Promise<boolean>;
/**
 * Installs the gcloud SDK into the actions environment.
 *
 * @param version - The version or version specification to install. If a
 * specification is given, the most recent version that still matches the
 * specification is installed.
 * @returns The path of the installed tool.
 */
export declare function installGcloudSDK(version: string): Promise<string>;
/**
 * computeGcloudVersion computes the appropriate gcloud version for the given
 * string. If the string is the empty string or the special value "latest", it
 * returns the latest known version of the Google Cloud SDK. Otherwise it
 * returns the provided string. It does not validate that the string is a valid
 * version.
 *
 * This is most useful when accepting user input which should default to
 * "latest" or the empty string when you want the latest version to be
 * installed, but still want users to be able to choose a specific version to
 * install as a customization.
 *
 * @deprecated Callers should use `installGcloudSDK('> 0.0.0.')` instead.
 *
 * @param version String (or undefined) version. The empty string or other
 * falsey values will return the latest gcloud version.
 *
 * @return String representing the latest version.
 */
export declare function computeGcloudVersion(version?: string): Promise<string>;
/**
 * Authenticates the gcloud tool using the provided credentials file.
 *
 * @param filepath - Path to the credentials file.
 */
export declare function authenticateGcloudSDK(filepath: string): Promise<void>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param projectId - The project ID to set.
 * @returns project ID.
 */
export declare function setProject(projectId: string): Promise<void>;
/**
 * Install a Cloud SDK component.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
export declare function installComponent(component: string[] | string): Promise<void>;
/**
 * getLatestGcloudSDKVersion fetches the latest version number from the API.
 *
 * @returns The latest stable version of the gcloud SDK.
 */
export declare function getLatestGcloudSDKVersion(): Promise<string>;
/**
 * bestVersion takes a version constraint and gets the latest available version
 * that satisfies the constraint.
 *
 * @param spec Version specification
 * @return Resolved version
 */
export declare function bestVersion(spec: string): Promise<string>;
/**
 * computeBestVersion computes the latest available version that still satisfies
 * the spec. This is a helper function and is only exported for testing.
 *
 * @param versions List of versions
 * @param spec Version specification
 *
 * @return Best version or an error if no matches are found
 */
export declare function computeBestVersion(spec: string, versions: string[]): string;
export * from './test-util';
