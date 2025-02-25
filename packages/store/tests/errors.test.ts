import { describe, test, expect } from "bun:test";
import { store } from "../lib";

describe("store errors", () => {
  test("undefined", () => {
    const testStore = store({
      count: 0,
    });

    expect(() => {
      // @ts-ignore - Testing runtime error
      testStore.undefined();
    }).toThrow();
  });

  test("disposed", () => {
    const testStore = store({
      count: 0,
    });

    testStore.cleanup();
    expect(() => {
      testStore.set({ count: 1 });
    }).toThrow("Attempting to update a disposed store");
  });
});
