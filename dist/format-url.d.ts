/**
 * buildReleaseURL builds the URL at which to dowbnload the gcloud SDK,
 * according to the specified arguments.
 *
 * @param os The OS of the requested release.
 * @param arch The system architecture of the requested release.
 * @param version The version of the requested release.
 * @returns The formatted gcloud SDK release URL.
 */
export declare function buildReleaseURL(os: string, arch: string, version: string): string;
