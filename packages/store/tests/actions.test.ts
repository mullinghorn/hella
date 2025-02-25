import { describe, test, expect } from "bun:test";
import { store } from "../lib";

describe("store actions", () => {
  test("methods", async () => {
    const testStore = store((state) => ({
      count: 0,
      increment() {
        state.count.set(state.count() + 1);
      },
    }));

    testStore.increment();
    expect(testStore.count()).toBe(1);
  });

  test("external", () => {
    const testStore = store({
      count: 0,
    });

    function incrementStore() {
      testStore.count.set(testStore.count() + 1);
    }

    incrementStore();
    expect(testStore.count()).toBe(1);
  });

  test("batched", () => {
    const testStore = store({
      count: 0,
      name: "test",
    });

    testStore.set({
      count: 1,
      name: "updated",
    });

    expect(testStore.count()).toBe(1);
    expect(testStore.name()).toBe("updated");

    testStore.set((state) => ({
      count: state.count() + 1,
    }));

    expect(testStore.count()).toBe(2);
  });
});
