// AI-assisted: see AI-ATTRIBUTION.md

// Runs a Lambda's operation and makes sure any error it throws carries a
// status prefix that template.yaml's response mappings recognize.
// Errors already prefixed (e.g. "[bad-request] ...") are rethrown unchanged;
// anything else becomes "[internal-server-error] <message>".
export const handleErrors = async <T>(operation: () => Promise<T>): Promise<T> => {
    try {
        return await operation();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.startsWith("[")) {
            throw error;
        }
        throw new Error(`[internal-server-error] ${message}`);
    }
};
