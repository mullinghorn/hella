import { render, html } from "@hella/render";

const { $, div, h1, h2, p, span } = html;

render(
  $([
    div({ classes: "foo" }, h1("Foo")),
    div({ classes: "bar" }, h2("Bar")),
    div({ classes: "fizz" }, p("Fizz")),
    div({ classes: "buzz" }, span("Buzz")),
  ]),
  "#app",
);
