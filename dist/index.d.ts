import { getLatestGcloudSDKVersion } from './version-util';
import { ExecOptions as ActionsExecOptions } from '@actions/exec/lib/interfaces';
export { getLatestGcloudSDKVersion };
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
export declare type ExecOptions = ActionsExecOptions;
/**
 * ExecOutput is the output returned from a gcloud exec.
 */
export declare type ExecOutput = {
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
 * @param version - The version being installed.
 * @returns The path of the installed tool.
 */
export declare function installGcloudSDK(version: string): Promise<void>;
/**
 * Parses the service account string into JSON.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns ServiceAccountKey as an object.
 */
export declare function parseServiceAccountKey(serviceAccountKey: string): ServiceAccountKey;
/**
 * Authenticates the gcloud tool using a service account key or WIF credential configuration
 * discovered via GOOGLE_GHA_CREDS_PATH environment variable. An optional serviceAccountKey
 * param is supported for legacy Actions and will take precedence over GOOGLE_GHA_CREDS_PATH.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 */
export declare function authenticateGcloudSDK(serviceAccountKey?: string): Promise<void>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export declare function setProject(projectId: string): Promise<void>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export declare function setProjectWithKey(serviceAccountKey: string): Promise<string>;
/**
 * Install a Cloud SDK component.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
export declare function installComponent(component: string[] | string): Promise<void>;
interface ServiceAccountKey {
    type: string;
    project_id: string;
    project_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}
