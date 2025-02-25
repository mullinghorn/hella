import { describe, test, expect, beforeEach, mock, Mock } from "bun:test";
import { signal, effect, Signal } from "../lib";
import { reactiveContext } from "../lib/global";
import { tick } from "@hella/global";
import { count, reactiveTestSetup, spy } from "./setup";

describe("effect", () => {
  beforeEach(reactiveTestSetup);

  test("execution", async () => {
    effect(() => spy(count()));

    await tick();
    expect(spy).toHaveBeenCalledWith(0);

    count.set(1);
    await tick();
    expect(spy).toHaveBeenCalledWith(1);
  });

  test("cleanup", async () => {
    const count = signal(0);
    let cleanupRun = false;

    effect(() => {
      count();
      return () => {
        cleanupRun = true;
      };
    });

    count.set(1);
    await tick();
    expect(cleanupRun).toBe(true);
  });

  test("nested", async () => {
    const outer = mock((_: number) => {});
    const inner = mock((_: number) => {});

    effect(() => {
      outer(count());
      effect(() => {
        inner(count());
      });
    });

    count.set(1);
    await tick();
    expect(outer).toHaveBeenCalledWith(1);
    expect(inner).toHaveBeenCalledWith(1);
  });

  test("disposal", async () => {
    const spy = mock((_: number) => {});

    const dispose = effect(() => {
      spy(count());
    });

    count.set(1);
    await tick();
    expect(spy).toHaveBeenCalledWith(1);
    dispose();
    count.set(2);
    expect(spy).not.toHaveBeenCalledWith(2);
  });
});
