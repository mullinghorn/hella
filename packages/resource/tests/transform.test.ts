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

describe("request transforms", () => {
  beforeEach(resourceTestSetup);
  afterEach(resourceTestCleanup);

  test("validation", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockJsonResponse(testUser)));

    const validate = mock((data: User) => data.id === 1);
    const result = resource<User>(testUrl, { validate });
    await result.fetch();

    expect(validate).toHaveBeenCalledWith(testUser);
    expect(result.data()).toEqual(testUser);
  });

  test("mutation", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockJsonResponse(testUser)));

    const result = resource<User>(testUrl, {
      transform: (user) => ({ ...user, name: user.name.toUpperCase() }),
    });
    await result.fetch();

    expect(result.data()?.name).toBe("TEST USER");
  });
});
