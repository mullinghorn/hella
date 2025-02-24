import { render } from "@hella/render";

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
  "#app"
);
