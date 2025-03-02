import { render, HellaElement } from "@hella/core";

const greeting: HellaElement<"div"> = {
  tag: "div",
  content: "Hello World",
};

render(greeting, "#app");
