import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { render } from "../lib";
import { container, renderTestCleanup, renderTestSetup } from "./setup";
import { signal } from "@hella/reactive";
import { tick } from "@hella/global";

describe("reactive render", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("updates", async () => {
    const count = signal(0);
    render(
      () => ({
        tag: "div",
        content: count,
      }),
      "#app"
    );

    await tick();
    expect(container.innerHTML).toBe("<div>0</div>");

    count.set(1);
    await tick();
    expect(container.innerHTML).toBe("<div>1</div>");
  });

  test("classes", async () => {
    const active = signal(false);
    render(
      () => ({
        tag: "div",
        classes: { active: active() },
      }),
      "#app"
    );
    await tick();
    expect(container.firstElementChild?.className).toBe("");

    active.set(true);
    await new Promise((r) => setTimeout(r, 0));
    expect(container.firstElementChild?.className).toBe("active");
  });

  test("nested", async () => {
    const items = signal(["a", "b"]);
    render(
      () => ({
        tag: "ul",
        content: items().map((item) => ({
          tag: "li",
          content: item,
        })),
      }),
      "#app"
    );
    await tick();
    expect(container.innerHTML).toBe("<ul><li>a</li><li>b</li></ul>");

    items.set(["c"]);
    await tick();
    expect(container.innerHTML).toBe("<ul><li>c</li></ul>");
  });
});
