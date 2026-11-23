// AI-assisted: see AI-ATTRIBUTION.md

export interface AuthTokenRecord {
    readonly token: string;
    readonly alias: string;
    readonly expiresAt: number; // epoch seconds
}

export interface AuthTokenDAO {
    putToken(token: string, alias: string, expiresAt: number): Promise<void>;
    getToken(token: string): Promise<AuthTokenRecord | null>;
    updateExpiration(token: string, expiresAt: number): Promise<void>;
    deleteToken(token: string): Promise<void>;
}
