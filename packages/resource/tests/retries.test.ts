import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";
import {
  mockJsonResponse,
  resourceTestCleanup,
  resourceTestSetup,
  testUrl,
  testUser,
  User,
} from "./setup";
import { resource } from "../lib";

describe("resource retries", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("success", async () => {
    let attempts = 0;
    globalThis.fetch = mock(() => {
      attempts++;
      return attempts < 3
        ? Promise.reject(new Error("Retry error"))
        : Promise.resolve(mockJsonResponse(testUser));
    });

    const result = resource<User>(testUrl, { retries: 3, retryDelay: 0 });
    await result.fetch();

    expect(attempts).toBe(3);
    expect(result.data()).toEqual(testUser);
  });
});
