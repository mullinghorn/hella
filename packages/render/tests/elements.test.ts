import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { render } from "../lib";
import { container, renderTestCleanup, renderTestSetup } from "./setup";

describe("render elements", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("basic", () => {
    render({ tag: "div", content: "Hello" }, "#app");
    expect(container.innerHTML).toBe("<div>Hello</div>");
  });

  test("nested", () => {
    render(
      {
        tag: "div",
        content: [
          { tag: "h1", content: "Title" },
          { tag: "p", content: "Text" },
        ],
      },
      "#app"
    );
    expect(container.innerHTML).toBe("<div><h1>Title</h1><p>Text</p></div>");
  });

  test("attributes", () => {
    render(
      {
        tag: "div",
        id: "test",
        classes: "foo bar",
        data: { test: "value" },
      },
      "#app"
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.id).toBe("test");
    expect(div.className).toBe("foo bar");
    expect(div.dataset.test).toBe("value");
  });

  test("null/undefined", () => {
    render(
      {
        tag: "div",
        content: [null, undefined, "valid"],
      },
      "#app"
    );
    expect(container.innerHTML).toBe("<div>valid</div>");
  });
});
