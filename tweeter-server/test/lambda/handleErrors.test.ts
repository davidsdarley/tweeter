// AI-assisted: see AI-ATTRIBUTION.md

import { describe, expect, it } from "@jest/globals";
import { handleErrors } from "../../src/lambda/handleErrors";

describe("handleErrors", () => {
  it("returns the operation's result when it succeeds", async () => {
    await expect(handleErrors(async () => 42)).resolves.toBe(42);
  });

  it("rethrows an already-prefixed error unchanged", async () => {
    const original = new Error("[bad-request] Missing auth token");

    await expect(
      handleErrors(async () => {
        throw original;
      })
    ).rejects.toBe(original);
  });

  it("wraps an unprefixed error as an internal server error", async () => {
    await expect(
      handleErrors(async () => {
        throw new Error("something broke");
      })
    ).rejects.toThrow("[internal-server-error] something broke");
  });
});
