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

// TODO: replace with the real S3 bucket that holds profile images.
export const IMAGE_BUCKET = "tweeter-images-dsd2001";
