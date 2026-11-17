// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

// userAlias (from TweeterRequest) is the alias logging in; token is empty
export interface LoginRequest extends TweeterRequest {
    readonly password: string;
}
