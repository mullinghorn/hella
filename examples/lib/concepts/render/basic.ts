import { render, HellaElement } from "@hellajs/core";

const greeting: HellaElement<"div"> = {
  tag: "div",
  content: "Hello World",
};

render(greeting, "#app");
