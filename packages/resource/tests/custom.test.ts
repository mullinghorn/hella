import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";
import { resource } from "../lib";
import {
  resourceTestCleanup,
  resourceTestSetup,
  testUser,
  User,
} from "./setup";

describe("custom resource fetcher", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("fetcher", async () => {
    const customFetcher = mock(() => Promise.resolve(testUser));
    const result = resource<User>(customFetcher);
    await result.fetch();

    expect(customFetcher).toHaveBeenCalled();
    expect(result.data()).toEqual(testUser);
  });
});
