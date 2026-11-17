// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
    readonly firstName: string;
    readonly lastName: string;
    readonly userImageBytes: string; // base64-encoded image
    readonly imageFileExtension: string;
}
