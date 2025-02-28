import { describe, test, expect, beforeEach } from "bun:test";
import {
  batchSignals,
  effect,
  signal,
  maxSubscribersLimit,
  tick,
} from "../../lib";
import {
  count,
  fn,
  onDispose,
  onRead,
  onSubscribe,
  onUnsubscribe,
  onWrite,
  reactiveTestSetup,
  spy,
  validate,
} from "./setup";

describe("reactive signals", () => {
  beforeEach(reactiveTestSetup);

  test("operations", () => {
    expect(count()).toBe(0);
    count.set(1);
    expect(count()).toBe(1);
  });

  test("hooks", () => {
    count();
    expect(onRead).toHaveBeenCalledTimes(1);

    count.set(1);
    expect(onWrite).toHaveBeenCalledWith(0, 1);

    const unsub = count.subscribe(fn);
    expect(onSubscribe).toHaveBeenCalled();

    unsub();
    expect(onUnsubscribe).toHaveBeenCalled();

    count.dispose();
    expect(onDispose).toHaveBeenCalled();
  });

  test("validation/sanitization", () => {
    expect(() => signal(-1, { validate })).toThrow(
      "Signal value validation failed",
    );
  });

  test("sanitization", () => {
    count.set(0.8);
    expect(count()).toBe(1);
  });

  test("subscriber limit", () => {
    const limit = maxSubscribersLimit();
    const subs = Array(limit + 1)
      .fill(null)
      .map(() => count.subscribe(() => { return }));

    expect(() => count.subscribe(fn)).toThrow(
      "Maximum subscriber limit (1000) exceeded",
    );

    subs.forEach((unsub) => { unsub(); });
  });

  test("disposal", () => {
    const unsub = count.subscribe(spy);
    count.set(1);
    expect(spy).toHaveBeenCalled();

    count.dispose();
    count.set(2);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(() => { unsub(); }).not.toThrow();
  });

  test("batched", async () => {
    effect(() => { spy(count()); });

    batchSignals(() => {
      count.set(1);
      count.set(2);
      count.set(3);
    });

    await tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(3);
  });
});
