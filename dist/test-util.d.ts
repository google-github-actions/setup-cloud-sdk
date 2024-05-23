/**
 * Creates an overridden runner cache and tool path. This is slightly
 * complicated by the fact that the runner initializes its cache path exactly
 * once at startup, so this must be imported and called BEFORE the toolcache is
 * used.
 */
export declare class TestToolCache {
    #private;
    static rootDir: string;
    static toolsDir: string;
    static tempDir: string;
    /**
     * Creates temporary directories for the runner cache and temp.
     */
    static start(): Promise<void>;
    /**
     * Restores the Action's runner to use the original directories and deletes
     * the temporary files.
     **/
    static stop(): Promise<void>;
    private static setGlobal;
}
