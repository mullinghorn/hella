import { render } from "@hellajs/core";

render(
  {
    tag: "div",
    classes: "card",
    content: [
      {
        tag: "h2",
        content: "Card Title",
      },
      {
        tag: "p",
        content: "Card content",
      },
    ],
  },
  "#app",
);
