import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { render } from "../lib";
import { container, renderTestCleanup, renderTestSetup } from "./setup";
import { tick } from "@hella/core";

describe("render lifecycle", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("calls", async () => {
    const hooks = {
      pre: mock(() => {}),
      post: mock((_: HTMLElement) => {}),
    };

    render(
      () => ({
        tag: "div",
        onPreRender: hooks.pre,
        onRender: hooks.post,
      }),
      "#app"
    );

    await tick();
    expect(hooks.pre).toHaveBeenCalled();
    expect(hooks.post).toHaveBeenCalledWith(container.firstElementChild);
  });

  test("cleanup", async () => {
    const cleanup = mock(() => {});
    const dispose = render(
      () => ({
        tag: "div",
        onRender: () => cleanup,
      }),
      "#app"
    );
    await tick();
    dispose();
    await tick();
    expect(cleanup).toHaveBeenCalled();
  });
});
