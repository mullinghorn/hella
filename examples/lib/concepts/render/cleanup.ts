import { render, html } from "@hella/render";
import { signal } from "@hella/core";

const { div, h1, p, button } = html;

const counter = signal(0);

const app = render(
  () =>
    div([
      h1("Counter"),
      p(counter),
      button(
        {
          onclick: () => counter.set(counter() + 1),
        },
        "Increment",
      ),
    ]),
  "#app",
);

setTimeout(() => {
  app();
}, 3000);
