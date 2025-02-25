import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { html, render } from "../lib";
import { container, renderTestCleanup, renderTestSetup } from "./setup";
import { tick } from "@hella/core";

describe("html helper", () => {
  beforeEach(renderTestSetup);
  afterEach(renderTestCleanup);

  test("tags", () => {
    const { div, p } = html;
    render(div([p("Hello"), p("World")]), "#app");
    expect(container.innerHTML).toBe("<div><p>Hello</p><p>World</p></div>");
  });

  test("fragments", () => {
    const { $, p } = html;
    render($([p("One"), p("Two")]), "#app");
    expect(container.innerHTML).toBe("<p>One</p><p>Two</p>");
  });

  test("props", async () => {
    const { button } = html;
    const onClick = () => {};
    render(
      () =>
        button(
          {
            classes: "btn",
            onclick: onClick,
          },
          "Click me",
        ),
      "#app",
    );

    await tick();
    const btn = container.firstElementChild as HTMLElement;
    expect(btn.className).toBe("btn");
    expect(btn.onclick).toBeDefined();
  });
});
