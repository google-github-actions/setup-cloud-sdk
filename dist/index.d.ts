import { getLatestGcloudSDKVersion } from './version-util';
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
 * Checks if the project Id is set in the gcloud config.
 *
 * @returns true is project Id is set.
 */
export declare function isProjectIdSet(silent?: boolean): Promise<boolean>;
/**
 * Checks if gcloud is authenticated.
 *
 * @returns true is gcloud is authenticated.
 */
export declare function isAuthenticated(silent?: boolean): Promise<boolean>;
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
 * Authenticates the gcloud tool using a service account key.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns exit code.
 */
export declare function authenticateGcloudSDK(serviceAccountKey: string, silent?: boolean): Promise<number>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export declare function setProject(projectId: string, silent?: boolean): Promise<number>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export declare function setProjectWithKey(serviceAccountKey: string): Promise<string>;
/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
export declare function installComponent(component: string, silent?: boolean): Promise<void>;
export declare function runCmdWithJsonFormat(cmd: string, silent?: boolean): Promise<any>;
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
