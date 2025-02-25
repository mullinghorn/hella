import { describe, test, expect, beforeEach, mock } from "bun:test";
import { computed, signal } from "../lib";
import { count, fn, reactiveTestSetup } from "./setup";

describe("computed", () => {
  beforeEach(reactiveTestSetup);
  test("computation", () => {
    const double = computed(() => count() * 2);

    expect(double()).toBe(0);
    count.set(2);
    expect(double()).toBe(4);
  });

  test("dependencies", () => {
    const x = signal(1);
    const y = signal(2);
    const sum = computed(() => x() + y());

    expect(sum()).toBe(3);

    x.set(2);
    expect(sum()).toBe(4);

    y.set(3);
    expect(sum()).toBe(5);
  });

  test("hooks", () => {
    const onCreate = mock(fn);
    const onCompute = mock(fn);

    const double = computed(() => count() * 2, {
      onCreate,
      onCompute,
    });

    count.set(1);
    expect(double()).toBe(2);
    expect(onCreate).toHaveBeenCalled();

    count.set(2);
    expect(onCompute).toHaveBeenCalled();
  });

  test("nested", () => {
    const double = computed(() => count() * 2);
    const quadruple = computed(() => double() * 2);

    expect(quadruple()).toBe(0);

    count.set(1);
    expect(quadruple()).toBe(4);
  });
});
