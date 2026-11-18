// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handler } from "../../src/lambda/status/PostStatusLambda";
import { FakeData, PostStatusRequest } from "tweeter-shared";

describe("PostStatusLambda", () => {
  const user = FakeData.instance.firstUser!;

  const request: PostStatusRequest = {
    token: "fake-token",
    userAlias: user.alias,
    newStatus: {
      post: "Hello from the PostStatusLambda test",
      user: user.toDto(),
      timestamp: Date.now(),
    },
  };

  it("returns a successful response for a valid status", async () => {
    const response = await handler(request);

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
  });

  it("rejects a request with a missing token as a bad request", async () => {
    await expect(handler({ ...request, token: "" })).rejects.toThrow(
      "[bad-request] Missing auth token"
    );
  });
});
