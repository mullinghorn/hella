import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { render } from "../../lib";
import { container, renderTestCleanup, renderTestSetup } from "./setup";
import { tick } from "@hellajs/core";
import { signal } from "@hellajs/core";

describe("render performance", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("batch", async () => {
    const items = signal(new Array(1000).fill("item"));
    const start = performance.now();

    render(
      () => ({
        tag: "ul",
        content: items().map((item: number) => ({
          tag: "li",
          content: item,
        })),
      }),
      "#app",
    );

    items.set(["single"]);
    await tick();

    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should be fast
    expect(container.innerHTML).toBe("<ul><li>single</li></ul>");
  });
});
