// AI-assisted: see AI-ATTRIBUTION.md

// Request field checks shared by the server services. Each throws a
// "[bad-request]" error so API Gateway maps it to a 400 response.

export const requireToken = (token: string): void => {
    if (!token) {
        throw new Error("[bad-request] Missing auth token");
    }
};

export const requireAlias = (alias: string, fieldName: string = "user alias"): void => {
    if (!alias) {
        throw new Error(`[bad-request] Missing ${fieldName}`);
    }
};

export const requirePositivePageSize = (pageSize: number): void => {
    if (!(pageSize > 0)) {
        throw new Error("[bad-request] pageSize must be greater than 0");
    }
};
