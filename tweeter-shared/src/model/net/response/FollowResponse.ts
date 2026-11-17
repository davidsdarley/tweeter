// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

// Counts for the followed/unfollowed user after the follow or unfollow
export interface FollowResponse extends TweeterResponse {
    readonly followerCount: number;
    readonly followeeCount: number;
}
