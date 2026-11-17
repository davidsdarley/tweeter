// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

// userAlias (from TweeterRequest) is the user who may be following selectedUserAlias
export interface IsFollowerRequest extends TweeterRequest {
    readonly selectedUserAlias: string;
}
