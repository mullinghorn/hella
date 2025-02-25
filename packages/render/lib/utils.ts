import { toError } from "@hella/core";

export function getRootElement(rootSelector: string): Element {
  const rootElement = document.querySelector(rootSelector);
  if (!rootElement) {
    throw toError(`Root selector not found: ${rootSelector}`);
  }
  return rootElement;
}
