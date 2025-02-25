import { describe, test, expect } from "bun:test";
import { render } from "../lib";

describe("render errors", () => {
  test("mount", () => {
    expect(() => render({ tag: "div" }, "#missing")).toThrow();
  });
});
