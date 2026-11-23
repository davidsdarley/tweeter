// AI-assisted: see AI-ATTRIBUTION.md

// Matches the region the API is deployed to (see tweeter-web / deploy config).
export const AWS_REGION = "us-west-2";

export const TABLES = {
    user: "user",
    follows: "follows",
    followsIndex: "follows_index",
    story: "story",
    feed: "feed",
    authToken: "authtoken",
} as const;
