import { render } from "@hella/core";

render(
  {
    tag: "button",
    classes: "btn",
    onclick: () => console.log("clicked"),
    data: {
      id: "submit-btn",
      testid: "submit",
    },
    content: "Click me",
  },
  "#app",
);
