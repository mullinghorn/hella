import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { render } from "../../lib";
import { renderTestCleanup, renderTestSetup } from "./setup";

describe("render sanitization", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("attributes", () => {
    expect(() => {
      render(
        {
          tag: "a",
          href: "javascript:alert('xss')",
          // @ts-expect-error invalid attribute
          onclick: "alert('xss')",
        },
        "#app",
      );
    }).toThrow();
  });

  test("tags", () => {
    expect(() => render({ tag: "script" }, "#app")).toThrow();
    expect(() => render({ tag: "iframe" }, "#app")).toThrow();
  });
});
