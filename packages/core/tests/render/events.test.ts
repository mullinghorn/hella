import { describe, test, expect, beforeEach, afterEach, spyOn } from "bun:test";
import { render } from "../../lib";
import { container, fn, renderTestCleanup, renderTestSetup } from "./setup";
import { tick } from "@hellajs/core";

describe("element events", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("delegate", async () => {
    const clicks: number[] = [];
    render(
      () => ({
        tag: "div",
        content: [1, 2].map((n) => ({
          tag: "button",
          onclick: () => clicks.push(n),
        })),
      }),
      "#app",
    );

    await tick();
    const buttons = container.getElementsByTagName("button");
    buttons[0].click();
    buttons[1].click();
    expect(clicks).toEqual([1, 2]);
  });

  test("cleanup", async () => {
    const spy = spyOn(container, "removeEventListener");
    const cleanup = render(
      () => ({
        tag: "button",
        onclick: fn,
      }),
      "#app",
    );
    cleanup();
    await tick();
    expect(spy).toHaveBeenCalled();
  });

  test("blocks", () => {
    expect(() =>
      render(
        {
          tag: "button",
          // @ts-expect-error invalid event
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          onclick: new Function("alert('xss')"),
        },
        "#app",
      ),
    ).toThrow();
  });
});
